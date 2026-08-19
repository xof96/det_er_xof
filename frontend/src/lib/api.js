// Thin API client for the FastAPI backend. The base URL is configurable so the
// same build works behind a dev proxy or against a deployed API.
const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) || `Request failed (${res.status})`;
    const error = new Error(typeof message === 'string' ? message : 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  health: () => request('/health'),
  sections: () => request('/sections'),
  projects: () => request('/projects'),
  project: (slug) => request(`/projects/${slug}`),
  githubRepos: () => request('/github/repos'),
  photography: () => request('/photography'),
  photographyCollection: (slug) => request(`/photography/${slug}`),
  contact: (payload) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
};

export { BASE as API_BASE };
