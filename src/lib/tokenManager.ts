export const setToken = (token: string) => {
  document.cookie = `token=${token}; path=/; HttpOnly; Secure; SameSite=Strict`;
};

export const getToken = () => {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  return match ? match[2] : null;
};

export const clearToken = () => {
  document.cookie = 'token=; path=/; HttpOnly; Secure; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};
