import axios, { AxiosError } from 'axios';

const AxiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BE_URL,
  withCredentials: true,
});

let accessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

AxiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

AxiosClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest: any = error.config!;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      window.location.pathname !== '/login'
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(AxiosClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await AxiosClient.get(
          import.meta.env.VITE_APP_REFRESH_TOKEN_ENDPOINT,
        );
        const newAccessToken = (res.data as any).accessToken;

        setAccessToken(newAccessToken);
        onRefreshed(newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return AxiosClient(originalRequest);
      } catch (refreshErr) {
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default AxiosClient;
