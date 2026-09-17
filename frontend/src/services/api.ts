import axios from 'axios';

const getBaseUrl = (): string => {
  let envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (!envUrl || envUrl === '/api') return '/api';

  // If a host was provided without protocol (e.g. careergraph-backend.onrender.com)
  if (!envUrl.startsWith('http://') && !envUrl.startsWith('https://') && !envUrl.startsWith('/')) {
    envUrl = `https://${envUrl}`;
  }

  const clean = envUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careergraph_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept response to catch 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear it
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('careergraph_token');
        localStorage.removeItem('careergraph_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authService = {
  login: async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updatePassword: async (passwords: any) => {
    const res = await api.put('/auth/update-password', passwords);
    return res.data;
  },
};

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
  getReadinessScore: async () => {
    const res = await api.get('/users/readiness');
    return res.data;
  },
  getDashboardData: async () => {
    const res = await api.get('/users/dashboard');
    return res.data;
  },
};

export const skillService = {
  getCatalog: async () => {
    const res = await api.get('/skills/catalog');
    return res.data;
  },
  getStudentSkills: async () => {
    const res = await api.get('/skills');
    return res.data;
  },
  addSkill: async (skillData: any) => {
    const res = await api.post('/skills', skillData);
    return res.data;
  },
  updateSkill: async (id: string, data: any) => {
    const res = await api.put(`/skills/${id}`, data);
    return res.data;
  },
  deleteSkill: async (id: string) => {
    const res = await api.delete(`/skills/${id}`);
    return res.data;
  },
  createPredefinedSkill: async (skillData: any) => {
    const res = await api.post('/skills/catalog', skillData);
    return res.data;
  },
  deletePredefinedSkill: async (id: string) => {
    const res = await api.delete(`/skills/catalog/${id}`);
    return res.data;
  },
};

export const opportunityService = {
  getAll: async (params?: any) => {
    const res = await api.get('/opportunities', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/opportunities/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post('/opportunities', data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await api.put(`/opportunities/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/opportunities/${id}`);
    return res.data;
  },
};

export const applicationService = {
  getStudentApplications: async (params?: any) => {
    const res = await api.get('/applications', { params });
    return res.data;
  },
  apply: async (data: { opportunityId: string; status?: string; notes?: string }) => {
    const res = await api.post('/applications', data);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await api.put(`/applications/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/applications/${id}`);
    return res.data;
  },
};

export const prepService = {
  getDsaProgress: async () => {
    const res = await api.get('/preparation/dsa');
    return res.data;
  },
  updateDsaTopic: async (id: string, data: any) => {
    const res = await api.put(`/preparation/dsa/${id}`, data);
    return res.data;
  },
  getInterviewPrep: async () => {
    const res = await api.get('/preparation/interview');
    return res.data;
  },
  updateInterviewCategory: async (id: string, data: any) => {
    const res = await api.put(`/preparation/interview/${id}`, data);
    return res.data;
  },
  toggleChecklistItem: async (id: string, itemIndex: number) => {
    const res = await api.post(`/preparation/interview/${id}/toggle`, { itemIndex });
    return res.data;
  },
};

export const adminService = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },
  getStudents: async (params?: any) => {
    const res = await api.get('/admin/students', { params });
    return res.data;
  },
  getStudentDetail: async (id: string) => {
    const res = await api.get(`/admin/students/${id}`);
    return res.data;
  },
  getAllApplications: async (params?: any) => {
    const res = await api.get('/admin/applications', { params });
    return res.data;
  },
  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },
};
