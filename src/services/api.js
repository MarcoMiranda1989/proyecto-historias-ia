const API_URL = 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }

  return data;
}

export const auth = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  profile: () => request('/auth/profile'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

export const stories = {
  getAll: () => request('/stories'),
  getOne: (id) => request(`/stories/${id}`),
  create: (body) => request('/stories', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/stories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/stories/${id}`, { method: 'DELETE' }),
  addPage: (storyId, body) => request(`/stories/${storyId}/pages`, { method: 'POST', body: JSON.stringify(body) }),
  deletePage: (storyId, pageId) => request(`/stories/${storyId}/pages/${pageId}`, { method: 'DELETE' }),
};

export const generate = {
  image: (body) => request('/generate/image', { method: 'POST', body: JSON.stringify(body) }),
  storyText: (body) => request('/generate/story-text', { method: 'POST', body: JSON.stringify(body) }),
};
