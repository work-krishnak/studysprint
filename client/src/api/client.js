const BASE_URL = '/api';

async function request(path, options = {}) {
    let res;
    try {
      res = await fetch(`${BASE_URL}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
    } catch (networkErr) {
      throw new Error('Unable to reach the server. Please check your connection and try again.');
    }
  
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong. Please try again.');
    }
    return data;
  }

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  getAssignments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/assignments${query ? `?${query}` : ''}`);
  },
  createAssignment: (payload) => request('/assignments', { method: 'POST', body: JSON.stringify(payload) }),
  updateAssignment: (id, payload) => request(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updateStatus: (id, status) => request(`/assignments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteAssignment: (id) => request(`/assignments/${id}`, { method: 'DELETE' }),

  getDashboard: () => request('/dashboard'),

  exportAssignmentsCsv: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    window.open(`${BASE_URL}/assignments/export${query ? `?${query}` : ''}`, '_blank');
  },
};