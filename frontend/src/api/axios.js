import axios from 'axios';

// In production (Vercel/Netlify), VITE_API_URL is set to the Railway backend URL.
// In development, fall back to relative /api so Vite's proxy handles it.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── 401 interceptor — clear Redux auth state and redirect ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Lazily import store to avoid circular deps
      import('../store').then(({ default: store }) => {
        import('../store/slices/authSlice').then(({ clearUser }) => {
          store.dispatch(clearUser());
        });
      });
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
