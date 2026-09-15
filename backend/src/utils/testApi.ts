import http from 'http';
import app from '../app';
import { connectDB, disconnectDB } from '../config/db';
import { runSeed } from './seed';

const makeRequest = (
  port: number,
  method: string,
  path: string,
  body?: any,
  token?: string
): Promise<{ status: number; data: any }> => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData).toString(),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = rawData ? JSON.parse(rawData) : {};
            resolve({ status: res.statusCode || 500, data: parsed });
          } catch {
            resolve({ status: res.statusCode || 500, data: rawData });
          }
        });
      }
    );

    req.on('error', (e) => reject(e));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const runAllTests = async () => {
  console.log('==================================================');
  console.log('   Starting Comprehensive CareerGraph API Audit   ');
  console.log('==================================================');

  await connectDB();
  await runSeed(true); // silent seed

  const server = app.listen(0);
  const address = server.address() as any;
  const port = address.port;
  console.log(`[Test Suite] Ephemeral test server listening on port ${port}`);

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, detail?: string) => {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed += 1;
    } else {
      console.error(`  [FAIL] ${testName} - ${detail || ''}`);
      failed += 1;
    }
  };

  try {
    // 1. Health API
    const healthRes = await makeRequest(port, 'GET', '/api/health');
    assert(healthRes.status === 200 && healthRes.data.status === 'ok', 'Health Check Endpoint (/api/health)');

    // 2. Auth: Student Login (Rahul)
    const loginRes = await makeRequest(port, 'POST', '/api/auth/login', {
      email: 'rahul.sharma@college.edu',
      password: 'Student@123456',
    });
    assert(loginRes.status === 200 && !!loginRes.data.token, 'Student Login (rahul.sharma@college.edu)');
    const studentToken = loginRes.data.token;

    // 3. Auth: Current User (/api/auth/me)
    const meRes = await makeRequest(port, 'GET', '/api/auth/me', undefined, studentToken);
    assert(meRes.status === 200 && meRes.data.user.email === 'rahul.sharma@college.edu', 'Get Authenticated User (/api/auth/me)');

    // 4. User Profile & Career Readiness Score
    const readinessRes = await makeRequest(port, 'GET', '/api/users/readiness', undefined, studentToken);
    assert(
      readinessRes.status === 200 && readinessRes.data.readiness.overallScore >= 70,
      `Career Readiness Score Calculation: ${readinessRes.data.readiness?.overallScore}% (${readinessRes.data.readiness?.level})`
    );

    // 5. Student Dashboard Aggregator
    const dashRes = await makeRequest(port, 'GET', '/api/users/dashboard', undefined, studentToken);
    assert(dashRes.status === 200 && dashRes.data.data.stats.totalDsaSolved > 100, 'Student Dashboard Aggregated Stats');

    // 6. Skills API: Get and Add Skill
    const skillsRes = await makeRequest(port, 'GET', '/api/skills', undefined, studentToken);
    assert(skillsRes.status === 200 && skillsRes.data.skills.length > 0, 'Get Student Skills');

    const addSkillRes = await makeRequest(port, 'POST', '/api/skills', {
      name: 'Tailwind CSS',
      category: 'Frontend',
      proficiency: 'Advanced',
    }, studentToken);
    assert(addSkillRes.status === 201 && addSkillRes.data.skill.name === 'Tailwind CSS', 'Add Student Skill with Proficiency');

    // 7. DSA Tracker: Get and Update Topic
    const dsaRes = await makeRequest(port, 'GET', '/api/preparation/dsa', undefined, studentToken);
    assert(dsaRes.status === 200 && dsaRes.data.topics.length === 12, 'Get All 12 DSA Topics');

    const topicId = dsaRes.data.topics[0]._id;
    const updateDsaRes = await makeRequest(port, 'PUT', `/api/preparation/dsa/${topicId}`, {
      easySolved: 15,
      mediumSolved: 18,
      hardSolved: 5,
    }, studentToken);
    assert(updateDsaRes.status === 200 && updateDsaRes.data.topic.solvedProblems === 38, 'Update DSA Topic Counts');

    // 8. Interview Preparation: Get and Toggle Check item
    const prepRes = await makeRequest(port, 'GET', '/api/preparation/interview', undefined, studentToken);
    assert(prepRes.status === 200 && prepRes.data.categories.length === 10, 'Get 10 Interview Categories');

    const catId = prepRes.data.categories[0]._id;
    const toggleRes = await makeRequest(port, 'POST', `/api/preparation/interview/${catId}/toggle`, { itemIndex: 0 }, studentToken);
    assert(toggleRes.status === 200 && toggleRes.data.category.percentage >= 0, 'Toggle Interview Checklist Item');

    // 9. Placement Opportunities: Browse and Filter
    const oppRes = await makeRequest(port, 'GET', '/api/opportunities?jobType=Full-time', undefined, studentToken);
    assert(oppRes.status === 200 && oppRes.data.opportunities.length > 0, 'Browse & Filter Opportunities');

    const oppId = oppRes.data.opportunities[3]._id; // an opportunity not yet tracked
    const applyRes = await makeRequest(port, 'POST', '/api/applications', {
      opportunityId: oppId,
      status: 'Applied',
      notes: 'Applied in campus placement drive',
    }, studentToken);
    assert(applyRes.status === 201 || applyRes.status === 200, 'Apply to Placement Opportunity');

    // 10. Admin: Login
    const adminLoginRes = await makeRequest(port, 'POST', '/api/auth/login', {
      email: 'admin@careergraph.dev',
      password: 'Admin@123456',
    });
    assert(adminLoginRes.status === 200 && adminLoginRes.data.user.role === 'admin', 'Admin Login');
    const adminToken = adminLoginRes.data.token;

    // 11. Admin: Dashboard
    const adminDashRes = await makeRequest(port, 'GET', '/api/admin/dashboard', undefined, adminToken);
    assert(adminDashRes.status === 200 && adminDashRes.data.data.metrics.totalStudents >= 3, 'Admin Directorate Dashboard Metrics');

    // 12. Admin: Student Directory with Readiness Scores
    const studentsRes = await makeRequest(port, 'GET', '/api/admin/students', undefined, adminToken);
    assert(studentsRes.status === 200 && studentsRes.data.students.length >= 3, 'Admin Student Directory with Scores');

    // 13. Admin: Manage Applications
    const adminAppsRes = await makeRequest(port, 'GET', '/api/admin/applications', undefined, adminToken);
    assert(adminAppsRes.status === 200 && adminAppsRes.data.applications.length > 0, 'Admin Manage Applications');

    // 14. Admin: Placement Analytics
    const analyticsRes = await makeRequest(port, 'GET', '/api/admin/analytics', undefined, adminToken);
    assert(analyticsRes.status === 200 && analyticsRes.data.data.distribution.placementReady >= 1, 'Placement Analytics Readiness Distribution');

    // 15. Security: Student accessing Admin route should be Forbidden (403)
    const forbiddenRes = await makeRequest(port, 'GET', '/api/admin/dashboard', undefined, studentToken);
    assert(forbiddenRes.status === 403, 'Role Guard: Student Access to Admin Endpoint returns 403 Forbidden');

    // 16. Security: Unauthenticated request to protected route should return 401
    const unauthRes = await makeRequest(port, 'GET', '/api/users/profile');
    assert(unauthRes.status === 401, 'Auth Guard: Missing token returns 401 Unauthorized');
  } catch (err: any) {
    console.error('Test execution error:', err.message);
    failed += 1;
  } finally {
    server.close();
    await disconnectDB();
  }

  console.log('==================================================');
  console.log(`   API Audit Complete: ${passed} Passed, ${failed} Failed   `);
  console.log('==================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runAllTests();
