const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
  ? 'http://localhost:5000' 
  : window.location.origin;

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
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
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async saveSettingsBulk(data) {
    const res = await fetch(`${API_BASE}/api/settings/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ data })
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Failed to save settings');
    return out;
  },

  // Projects
  async getProjects(category = 'all') {
    const res = await fetch(`${API_BASE}/api/projects?category=${category}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async createProject(projectData) {
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Failed to create project');
    return out;
  },

  async updateProject(id, projectData) {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Failed to update project');
    return out;
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Failed to delete project');
    return out;
  },

  // Certifications
  async getCerts() {
    const res = await fetch(`${API_BASE}/api/certs`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch certs');
    return res.json();
  },

  async createCert(certData) {
    const res = await fetch(`${API_BASE}/api/certs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(certData)
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Failed to create certificate');
    return out;
  },

  async deleteCert(id) {
    const res = await fetch(`${API_BASE}/api/certs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Failed to delete certificate');
    return out;
  },

  // Contact (Public submission & Admin reading)
  async submitContact(contactData) {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Failed to submit message');
    return out;
  },

  async getContacts() {
    const res = await fetch(`${API_BASE}/api/contact`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch contact inquiries');
    return res.json();
  },

  async deleteContact(id) {
    const res = await fetch(`${API_BASE}/api/contact/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Failed to delete inquiry');
    return out;
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
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Avatar upload failed');
    return out; // { url }
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
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Resume upload failed');
    return out; // { url, name }
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
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || 'Project image upload failed');
    return out; // { url }
  }
};
