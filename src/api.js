const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
  ? 'http://localhost:5000' 
  : 'https://portfolio-backend-2-blf2.onrender.com';

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Robust helper to safely parse JSON or plain-text backend errors (like Rate Limiter blocks)
const handleResponse = async (res) => {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    data = { error: text || 'Unknown server response error' };
  }
  
  if (!res.ok) {
    throw new Error(data.error || 'Request to server failed.');
  }
  return data;
};

export const api = {
  // Base URL helper
  base: API_BASE,

  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('admin_token');
  },

  isLoggedIn() {
    return !!localStorage.getItem('admin_token');
  },

  // Settings (Public & Admin)
  async getSettings() {
    const res = await fetch(`${API_BASE}/api/settings`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async saveSettingsBulk(data) {
    const res = await fetch(`${API_BASE}/api/settings/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data })
    });
    return handleResponse(res);
  },

  // Projects
  async getProjects(category = 'all') {
    const res = await fetch(`${API_BASE}/api/projects?category=${category}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async createProject(projectData) {
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    return handleResponse(res);
  },

  async updateProject(id, projectData) {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    return handleResponse(res);
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Certifications
  async getCerts() {
    const res = await fetch(`${API_BASE}/api/certs`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async createCert(certData) {
    const res = await fetch(`${API_BASE}/api/certs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(certData)
    });
    return handleResponse(res);
  },

  async deleteCert(id) {
    const res = await fetch(`${API_BASE}/api/certs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Contact (Public submission & Admin reading)
  async submitContact(contactData) {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    return handleResponse(res);
  },

  async getContacts() {
    const res = await fetch(`${API_BASE}/api/contact`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async deleteContact(id) {
    const res = await fetch(`${API_BASE}/api/contact/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Uploads
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_BASE}/api/upload/avatar`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    return handleResponse(res);
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_BASE}/api/upload/resume`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    return handleResponse(res);
  },

  async uploadProjectImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('admin_token');
    const res = await fetch(`${API_BASE}/api/upload/project`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    return handleResponse(res);
  }
};
