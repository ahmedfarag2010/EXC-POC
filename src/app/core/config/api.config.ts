/**
 * API Configuration
 */
export const API_CONFIG = {
  baseUrl: 'http://www.exc.somee.com',
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register'
    },
    lookups: '/api/lookups',
    requests: {
      create: '/api/requests',
      my: '/api/requests/my'
    },
    manager: {
      tasks: '/api/manager/tasks',
      decision: '/api/manager/decision'
    }
  }
};
