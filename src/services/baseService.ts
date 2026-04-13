export const API_URL = import.meta.env.VITE_API_URL;

export const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('sgd_token');
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`
  };
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};
