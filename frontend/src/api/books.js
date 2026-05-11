// import api from './axios';

// // ─── Public Library ────────────────────────────────────────────────────────
// export const libraryApi = {
//   listBooks: (params) => api.get('/library/books', { params }),
//   getBook: (id) => api.get(`/library/books/${id}`),
//   listGenres: () => api.get('/library/genres'),
//   // PDF served directly via <src> URL — not an axios call
//   getPdfUrl: (id) => `/api/library/books/${id}/serve`,
// };

// // ─── Personal Section ──────────────────────────────────────────────────────
// export const personalApi = {
//   listBooks: (params) => api.get('/personal/books', { params }),
//   getBook: (id) => api.get(`/personal/books/${id}`),
//   uploadBook: (formData) =>
//     api.post('/personal/books', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     }),
//   updateBook: (id, data) => api.put(`/personal/books/${id}`, data),
//   deleteBook: (id) => api.delete(`/personal/books/${id}`),
//   getPdfUrl: (id) => `/api/personal/books/${id}/serve`,
// };

// // ─── Author Panel ──────────────────────────────────────────────────────────
// export const authorApi = {
//   listBooks: (params) => api.get('/author/books', { params }),
//   publishBook: (formData) =>
//     api.post('/author/books', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     }),
//   togglePublish: (id) => api.put(`/author/books/${id}/publish`),
//   uploadCover: (id, formData) =>
//     api.post(`/author/books/${id}/cover`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     }),
// };

// // ─── History ───────────────────────────────────────────────────────────────
// export const historyApi = {
//   upsertProgress: (bookId, lastPage) => api.post(`/history/${bookId}`, { lastPage }),
//   getHistory: (params) => api.get('/history', { params }),
// };

// // ─── Highlights ────────────────────────────────────────────────────────────
// export const highlightsApi = {
//   getHighlights: (bookId) => api.get(`/highlights/${bookId}`),
//   createHighlight: (data) => api.post('/highlights', data),
//   deleteHighlight: (id) => api.delete(`/highlights/${id}`),
// };

// // ─── AI ────────────────────────────────────────────────────────────────────
// export const aiApi = {
//   // Returns a fetch Response for streaming — not axios
//   summarize: (text, bookId) =>
//     fetch('/api/ai/summarize', {
//       method: 'POST',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text, bookId }),
//     }),
//   synonyms: (text, bookId) =>
//     fetch('/api/ai/synonyms', {
//       method: 'POST',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text, bookId }),
//     }),
// };

// // ─── Recommendations ───────────────────────────────────────────────────────
// export const recommendationsApi = {
//   get: () => api.get('/recommendations'),
// };

// // ─── Admin ────────────────────────────────────────────────────────────────
// export const adminApi = {
//   listRoleRequests: (params) => api.get('/admin/role-requests', { params }),
//   actionRoleRequest: (id, action, adminNote) =>
//     api.put(`/admin/role-requests/${id}`, { action, adminNote }),
//   listUsers: (params) => api.get('/admin/users', { params }),
//   setUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
// };

import api from './axios';

// Resolve the base API origin for URLs that are passed directly to
// browser APIs (fetch, <Worker fileUrl>) instead of going through axios.
// In production VITE_API_URL = 'https://xxx.up.railway.app'
// In development it is empty, so relative '/api' works via Vite proxy.
const API_ORIGIN = import.meta.env.VITE_API_URL ?? '';

function apiUrl(path) {
  return `${API_ORIGIN}/api${path}`;
}

// ─── Public Library ────────────────────────────────────────────────────────
export const libraryApi = {
  listBooks: (params) => api.get('/library/books', { params }),
  getBook: (id) => api.get(`/library/books/${id}`),
  listGenres: () => api.get('/library/genres'),
  // Full absolute URL so the PDF viewer (and fetch) reach Railway, not Vercel
  getPdfUrl: (id) => apiUrl(`/library/books/${id}/serve`),
};

// ─── Personal Section ──────────────────────────────────────────────────────
export const personalApi = {
  listBooks: (params) => api.get('/personal/books', { params }),
  getBook: (id) => api.get(`/personal/books/${id}`),
  uploadBook: (formData) =>
    api.post('/personal/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateBook: (id, data) => api.put(`/personal/books/${id}`, data),
  deleteBook: (id) => api.delete(`/personal/books/${id}`),
  getPdfUrl: (id) => apiUrl(`/personal/books/${id}/serve`),
};

// ─── Author Panel ──────────────────────────────────────────────────────────
export const authorApi = {
  listBooks: (params) => api.get('/author/books', { params }),
  publishBook: (formData) =>
    api.post('/author/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  togglePublish: (id) => api.put(`/author/books/${id}/publish`),
  uploadCover: (id, formData) =>
    api.post(`/author/books/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ─── History ───────────────────────────────────────────────────────────────
export const historyApi = {
  upsertProgress: (bookId, lastPage) => api.post(`/history/${bookId}`, { lastPage }),
  getHistory: (params) => api.get('/history', { params }),
};

// ─── Highlights ────────────────────────────────────────────────────────────
export const highlightsApi = {
  getHighlights: (bookId) => api.get(`/highlights/${bookId}`),
  createHighlight: (data) => api.post('/highlights', data),
  deleteHighlight: (id) => api.delete(`/highlights/${id}`),
};

// ─── AI ────────────────────────────────────────────────────────────────────
// These use fetch() for SSE streaming — must use absolute URLs in production.
export const aiApi = {
  summarize: (text, bookId) =>
    fetch(apiUrl('/ai/summarize'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, bookId }),
    }),
  synonyms: (text, bookId) =>
    fetch(apiUrl('/ai/synonyms'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, bookId }),
    }),
};

// ─── Recommendations ───────────────────────────────────────────────────────
export const recommendationsApi = {
  get: () => api.get('/recommendations'),
};

// ─── Admin ────────────────────────────────────────────────────────────────
export const adminApi = {
  listRoleRequests: (params) => api.get('/admin/role-requests', { params }),
  actionRoleRequest: (id, action, adminNote) =>
    api.put(`/admin/role-requests/${id}`, { action, adminNote }),
  listUsers: (params) => api.get('/admin/users', { params }),
  setUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
};