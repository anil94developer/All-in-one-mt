import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
});

api.interceptors.request.use((config) => {
  const urlPath = config.url || '';
  const isOnAdminPage = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/admin');
  const isAdminReq = urlPath.includes('/admin') || isOnAdminPage;

  const adminToken = typeof localStorage !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const userToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const authToken = isAdminReq ? (adminToken || userToken) : (userToken || adminToken);

  const curHeader = config.headers['Authorization'] || config.headers['authorization'];
  const isInvalidHeader = !curHeader || curHeader === 'Bearer null' || curHeader === 'Bearer undefined' || curHeader === 'Bearer ';

  if (authToken && isInvalidHeader) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    const urlPath = response.config?.url || '';
    const isOnAdminPage = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/admin');
    const isAdminReq = urlPath.includes('/admin') || isOnAdminPage;

    // Detect session expiration / auth failure on admin endpoints returned as 200 with error msg
    if (isAdminReq && response.data && response.data.success === '0') {
      const msg = typeof response.data.msg === 'string' ? response.data.msg.toLowerCase() : '';
      if (msg.includes('invalid token') || msg.includes('no token') || msg.includes('require admin') || msg.includes('unauthorized')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login?error=session_expired';
        }
      }
    }

    if (response.data && response.data.is_inactive && !isAdminReq) {
      localStorage.removeItem('token');
      localStorage.removeItem('phone');
      localStorage.removeItem('name');
      sessionStorage.removeItem('mpin_unlocked');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?error=inactive';
      }
    }
    return response;
  },
  (error) => {
    const urlPath = error.config?.url || '';
    const isOnAdminPage = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/admin');
    const isAdminReq = urlPath.includes('/admin') || isOnAdminPage;

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (isAdminReq) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login?error=session_expired';
        }
      } else if (error.response.data?.is_inactive || error.response.data?.msg?.toLowerCase().includes('inactive')) {
        localStorage.removeItem('token');
        localStorage.removeItem('phone');
        localStorage.removeItem('name');
        sessionStorage.removeItem('mpin_unlocked');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?error=inactive';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
