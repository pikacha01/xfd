import { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * api 请求的截流做法，如果同时有多个同样的请求执行一次
 */
class RequestPrompis {
  constructor(public reslove: any, public reject: any) {
    // TODO
  }
}

class AxiosCache {
  timer: any | undefined;

  data: AxiosResponse<any> | undefined;

  requestes: Array<RequestPrompis> = [];
}

export default class ThrottleAxios {
  requestMap = new Map<string, AxiosCache>();

  constructor(public axios: AxiosInstance) {
    // TODO
  }

  getUri = (config?: AxiosRequestConfig): string => {
    return this.axios.getUri(config);
  };

  request = <T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> => {
    return this.axios.request(config);
  };

  // get = <T = any, R = AxiosResponse<T>>(
  //   url: string,
  //   config?: AxiosRequestConfig
  // ): Promise<R> => {
  //   return this.axios.get(url, config);
  // };

  delete = <T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> => {
    return this.axios.delete(url, config);
  };

  head = <T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> => {
    return this.axios.head(url, config);
  };

  options = <T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> => {
    return this.axios.options(url, config);
  };

  post = <T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> => {
    return this.axios.post(url, data, config);
  };

  put = <T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> => {
    return this.axios.put(url, data, config);
  };

  patch = <T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R> => {
    return this.axios.patch(url, data, config);
  };

  getCacheValue(token: string) {
    const cache = this.requestMap.get(token);
    if (cache) {
      return cache.data;
    }
    return undefined;
  }

  get = <T>(url: string, config?: AxiosRequestConfig, invaldateTime = 1000): AxiosPromise<T> => {
    const cache = this.requestMap.get(url);
    if (cache) {
      if (cache.timer) {
        clearTimeout(cache.timer);
      }
      return new Promise<AxiosResponse<T>>((resolve, reject) => {
        const cache = this.requestMap.get(url);
        if (!cache) {
          reject(Error("错误的请求"));
        } else if (cache.data) {
          cache.timer = setTimeout(() => {
            this.requestMap.delete(url);
          }, invaldateTime);
          resolve(cache.data);
        } else {
          cache.requestes.push(new RequestPrompis(resolve, reject));
        }
      });
    }
    this.requestMap.set(url, new AxiosCache());
    return new Promise<AxiosResponse<T>>((reslove, reject) => {
      this.axios
        .get<T>(url, config)
        .then((result) => {
          const cache = this.requestMap.get(url);
          if (cache && cache.requestes) {
            cache.data = result;
            cache.requestes.forEach((request) => request.reslove(result));
            cache.timer = setTimeout(() => {
              this.requestMap.delete(url);
            }, invaldateTime);
          }
          reslove(result);
        })
        .catch((error) => {
          const cache = this.requestMap.get(url);
          if (cache && cache.requestes) {
            cache.requestes.forEach((request) => request.reject(error));
          }
          this.requestMap.delete(url);
          reject(error);
        });
    });
  };
}
