export const SEED_SKILLS = [
  // Programming
  { name: 'C++', category: 'Programming', description: 'Systems and competitive programming language', isPredefined: true },
  { name: 'Java', category: 'Programming', description: 'Object-oriented language for enterprise and DSA', isPredefined: true },
  { name: 'Python', category: 'Programming', description: 'Versatile scripting and machine learning language', isPredefined: true },
  { name: 'JavaScript', category: 'Programming', description: 'Standard language for web applications', isPredefined: true },
  { name: 'TypeScript', category: 'Programming', description: 'Typed superset of JavaScript for scalable systems', isPredefined: true },

  // Frontend
  { name: 'React.js', category: 'Frontend', description: 'Component-based frontend UI library', isPredefined: true },
  { name: 'HTML5 & CSS3', category: 'Frontend', description: 'Foundational web presentation and markup standards', isPredefined: true },
  { name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS styling framework', isPredefined: true },
  { name: 'Redux Toolkit', category: 'Frontend', description: 'State management library for React apps', isPredefined: true },
  { name: 'Next.js', category: 'Frontend', description: 'React framework for server-side rendering and static sites', isPredefined: true },

  // Backend
  { name: 'Node.js', category: 'Backend', description: 'Asynchronous event-driven JavaScript runtime', isPredefined: true },
  { name: 'Express.js', category: 'Backend', description: 'Minimalist web API framework for Node.js', isPredefined: true },
  { name: 'Spring Boot', category: 'Backend', description: 'Production-ready framework for Java backend microservices', isPredefined: true },
  { name: 'Django', category: 'Backend', description: 'High-level Python web framework', isPredefined: true },
  { name: 'REST APIs', category: 'Backend', description: 'Architectural style for web services and data interchange', isPredefined: true },

  // Database
  { name: 'MongoDB', category: 'Database', description: 'NoSQL document-oriented distributed database', isPredefined: true },
  { name: 'SQL & PostgreSQL', category: 'Database', description: 'Relational database management and query language', isPredefined: true },
  { name: 'MySQL', category: 'Database', description: 'Popular open-source relational DBMS', isPredefined: true },
  { name: 'Redis', category: 'Database', description: 'In-memory key-value cache and store', isPredefined: true },

  // CS Fundamentals
  { name: 'Data Structures & Algorithms', category: 'CS Fundamentals', description: 'Core problem solving and computational efficiency', isPredefined: true },
  { name: 'Object-Oriented Programming (OOP)', category: 'CS Fundamentals', description: 'Design paradigms and modular code principles', isPredefined: true },
  { name: 'Database Management Systems (DBMS)', category: 'CS Fundamentals', description: 'Relational design, normalization, ACID properties', isPredefined: true },
  { name: 'Operating Systems', category: 'CS Fundamentals', description: 'Processes, concurrency, memory management, file systems', isPredefined: true },
  { name: 'Computer Networks', category: 'CS Fundamentals', description: 'OSI model, TCP/IP, protocols, HTTP, DNS', isPredefined: true },

  // Tools & DevOps
  { name: 'Git & GitHub', category: 'Tools & DevOps', description: 'Version control and collaborative software development', isPredefined: true },
  { name: 'Docker', category: 'Tools & DevOps', description: 'Containerization and environment reproducibility', isPredefined: true },
  { name: 'Postman', category: 'Tools & DevOps', description: 'API testing, documentation, and debugging', isPredefined: true },
  { name: 'Linux Command Line', category: 'Tools & DevOps', description: 'Shell scripting and server administration', isPredefined: true },
];

export const SEED_OPPORTUNITIES = [
  {
    companyName: 'Nexus Infotech Solutions',
    jobTitle: 'Software Development Engineer - I (SDE-1)',
    description:
      'We are looking for passionate graduate engineers to join our Core Backend Platform Team. You will build highly scalable RESTful services, optimize database queries, and contribute to system architecture.',
    location: 'Bangalore, Karnataka (Hybrid)',
    ctc: '14.5 LPA',
    eligibility: 'B.Tech / B.E. (CSE/IT/ECE) with 7.5+ CGPA. No active backlogs.',
    requiredSkills: ['Java', 'Spring Boot', 'Data Structures & Algorithms', 'SQL & PostgreSQL', 'Git & GitHub'],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days ahead
    jobType: 'Full-time' as const,
    status: 'Active' as const,
    openings: 5,
    applyLink: 'https://campus.nexus-infotech.demo/jobs/sde1',
    isDemoData: true,
  },
  {
    companyName: 'CloudScale Labs',
    jobTitle: 'Cloud Infrastructure & DevOps Engineer',
    description:
      'Join our Platform Engineering team deploying resilient distributed systems on AWS and Kubernetes. Perfect opportunity for students passionate about Linux, containers, CI/CD pipelines, and infrastructure automation.',
    location: 'Hyderabad, Telangana (On-site)',
    ctc: '12 LPA',
    eligibility: 'B.Tech (Any Circuit Branch) with 7.0+ CGPA. Strong Linux fundamentals.',
    requiredSkills: ['Linux Command Line', 'Docker', 'Python', 'Computer Networks', 'Git & GitHub'],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days ahead
    jobType: 'Full-time' as const,
    status: 'Active' as const,
    openings: 3,
    applyLink: 'https://cloudscalelabs.demo/careers/grad',
    isDemoData: true,
  },
  {
    companyName: 'FinEdge Systems',
    jobTitle: 'Associate Software Engineer (FinTech Platform)',
    description:
      'Build mission-critical transaction gateways handling high-throughput payments. Requires strong grasp of concurrency, relational transactions, ACID guarantees, and clean OOP design.',
    location: 'Mumbai, Maharashtra (Hybrid)',
    ctc: '16 LPA',
    eligibility: 'B.Tech / Dual Degree (CSE/IT/Data Science) with 8.0+ CGPA.',
    requiredSkills: ['Data Structures & Algorithms', 'Java', 'Object-Oriented Programming (OOP)', 'Database Management Systems (DBMS)', 'SQL & PostgreSQL'],
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days ahead
    jobType: 'Full-time' as const,
    status: 'Active' as const,
    openings: 8,
    applyLink: 'https://finedge.demo/campus',
    isDemoData: true,
  },
  {
    companyName: 'DataPulse Analytics',
    jobTitle: 'Data Platform Engineer Trainee',
    description:
      'Design ETL data pipelines and batch workflows processing terabytes of analytical data. Work with Python, distributed data stores, and cloud warehousing solutions.',
    location: 'Pune, Maharashtra (Remote)',
    ctc: '10 LPA',
    eligibility: 'B.Tech / M.Tech in CS/IT/AI/DS with 7.0+ CGPA.',
    requiredSkills: ['Python', 'SQL & PostgreSQL', 'MongoDB', 'Data Structures & Algorithms'],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days ahead
    jobType: 'Full-time' as const,
    status: 'Active' as const,
    openings: 4,
    applyLink: 'https://datapulse.demo/careers/trainee',
    isDemoData: true,
  },
  {
    companyName: 'AppSphere Mobile & Web',
    jobTitle: 'Frontend Engineer (React / TypeScript)',
    description:
      'Create high-performance, responsive web interfaces and design systems. Work closely with product designers to ship slick customer-facing dashboards and web apps.',
    location: 'Bangalore, Karnataka (On-site)',
    ctc: '9.5 LPA + Performance Bonus',
    eligibility: 'B.Tech/BCA/MCA with demonstrable web development projects.',
    requiredSkills: ['JavaScript', 'TypeScript', 'React.js', 'Tailwind CSS', 'HTML5 & CSS3'],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days ahead
    jobType: 'Full-time' as const,
    status: 'Active' as const,
    openings: 6,
    applyLink: 'https://appsphere.demo/campus/frontend',
    isDemoData: true,
  },
  {
    companyName: 'CyberCore Security Networks',
    jobTitle: 'Graduate Security Analyst & Penetration Tester',
    description:
      'Analyze network traffic, evaluate web application vulnerabilities (OWASP Top 10), and implement defensive hardening measures across enterprise architectures.',
    location: 'Gurugram, Haryana (On-site)',
    ctc: '11.2 LPA',
    eligibility: 'B.Tech (CSE/IT) with 7.0+ CGPA. Knowledge of TCP/IP and web protocols.',
    requiredSkills: ['Computer Networks', 'Operating Systems', 'Python', 'Linux Command Line'],
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    jobType: 'Full-time' as const,
    status: 'Active' as const,
    openings: 2,
    applyLink: 'https://cybercore.demo/apply/security',
    isDemoData: true,
  },
  {
    companyName: 'Velocity AI Labs',
    jobTitle: 'Software Engineering Intern (Summer 2026)',
    description:
      '6-month pre-placement internship working on AI-assisted workflow engines. Top performers receive a pre-placement offer (PPO) of 18 LPA upon graduation.',
    location: 'Bangalore, Karnataka (Hybrid)',
    ctc: '₹55,000 / month Stipend (PPO: 18 LPA)',
    eligibility: 'Pre-final and Final Year Students (Graduation 2026 or 2027) with 8.0+ CGPA.',
    requiredSkills: ['Python', 'TypeScript', 'Data Structures & Algorithms', 'REST APIs', 'Git & GitHub'],
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    jobType: 'Intern + PPO' as const,
    status: 'Active' as const,
    openings: 10,
    applyLink: 'https://velocityai.demo/internship-2026',
    isDemoData: true,
  },
  {
    companyName: 'ZetaFlow Enterprise Systems',
    jobTitle: 'Junior Full Stack Developer',
    description:
      'Develop end-to-end features across Node.js microservices and modern single page applications. Collaborative agile sprint environment with senior mentor pairing.',
    location: 'Chennai, Tamil Nadu (Hybrid)',
    ctc: '8.5 LPA',
    eligibility: 'B.Tech CSE/IT/ECE with 6.5+ CGPA.',
    requiredSkills: ['JavaScript', 'Node.js', 'Express.js', 'React.js', 'MongoDB'],
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Expiring soon
    jobType: 'Full-time' as const,
    status: 'Active' as const,
    openings: 4,
    applyLink: 'https://zetaflow.demo/careers/fullstack',
    isDemoData: true,
  },
];
