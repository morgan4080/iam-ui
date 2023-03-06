import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create();

api.interceptors.response.use(
  (
    response: AxiosResponse
  ): AxiosResponse<any, any> | Promise<AxiosResponse<any, any>> => {
    if (response.status === 302) {
      const currentUrl = window.location.href;
      window.location.href = `${
        import.meta.env.VITE_APP_ROOT_AUTH
      }?redirect_url=${currentUrl}`;
    }

    return response;
  }
);

interface Params {
  url: string;
  data?: object;
  method: string;
  headers?: object;
}

const apiCall = (
  { url, data, method, headers }: Params,
  configuration?: AxiosRequestConfig<object>
) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // api.defaults.headers.common['Authorization'] = localStorage.getItem('user-token');
        if (method === "GET") {
          api
            .get(url, configuration)
            .then((response: AxiosResponse<any>) => {
              resolve(response.data);
            })
            .catch(error => {
              reject(new Error(error));
            });
        } else if (method === "POST") {
          api
            .post(url, data, configuration)
            .then((response: AxiosResponse<any>) => {
              resolve(response.data);
            })
            .catch(error => {
              reject(new Error(error));
            });
        } else if (method === "PUT") {
          api
            .put(url, data, configuration)
            .then((response: AxiosResponse<any>) => {
              resolve(response.data);
            })
            .catch(error => {
              reject(new Error(error));
            });
        } else if (method === "DELETE") {
          axios({ method: "delete", url: url, data: null })
            .then((response: AxiosResponse<any>) => {
              resolve(response.data);
            })
            .catch(error => {
              reject(new Error(error));
            });
        }
      } catch (err: any) {
        reject(new Error(err));
      }
    }, 1000);
  });

export default apiCall;
