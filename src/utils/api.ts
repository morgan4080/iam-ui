import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

interface Params {url: string, data?: object, method: string, headers?: object}

const apiCall = ({ url, data, method, headers }: Params, configuration?: AxiosRequestConfig<{}>) => new Promise((resolve, reject) => {
    setTimeout(() => {
        try {
            // axios.defaults.headers.common['Authorization'] = localStorage.getItem('user-token');
            if (method === 'GET') {
                axios.get(url, configuration).then((response: AxiosResponse<any>) => {
                    resolve(response.data)
                }).catch((error) => {
                    reject(new Error(error))
                })
            } else if (method === 'POST'){
                axios.post(url,data,configuration).then((response: AxiosResponse<any>) => {
                    resolve(response.data)
                }).catch((error) => {
                    reject(new Error(error))
                });
            } else if (method === 'PUT'){
                axios.put(url,data,configuration).then((response: AxiosResponse<any>) => {
                    resolve(response.data)
                }).catch((error) => {
                    reject(new Error(error))
                });
            } else if (method === 'DELETE'){
                axios({ method: 'delete', url: url, data: null })
                    .then((response: AxiosResponse<any>) => {
                        resolve(response.data)
                    }).catch((error) => {
                    reject(new Error(error))
                });
            }
        } catch (err: any) {
            reject(new Error(err))
        }
    }, 1000)
})

export default apiCall
