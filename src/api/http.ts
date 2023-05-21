import axios from 'axios'
import { getFullURL } from '@/utils/http'
import { useCountStore } from '@/store';
import { storeToRefs } from 'pinia';
import JSONBig from 'json-bigint'
import ThrottleAxios from "@/utils/request/axios.throttle"
const instance = axios.create({
  // Web 侧可以通过 vite.config.js 中的 proxy 配置，指定代理
  // 小程序APP里需写完整路径，如 https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release
  // 可使用条件编译,详见 https://uniapp.dcloud.io/tutorial/platform.html#preprocessor
  // // #ifdef H5
  // baseURL: "/api",
  // // #endif
  // // #ifndef H5
  // // @ts-ignore
  // // #endif

  baseURL: 'https://zhuyiyun.com/api',

  timeout: 60 * 1000, // Timeout
  //   baseURL: process.env.NODE_ENV === "development" ? "/api/dev" : "/api",

  transformResponse: (data: unknown) => {
    // instanceof  Blob
    if (data) {
      //   return data;
      // } else {
      return (
        data && JSONBig({ storeAsString: true }).parse(data)
      );
    }
  },

  adapter(config) {
    const { url, method, data, params, headers, baseURL, timeout, paramsSerializer } =
      config;
    return new Promise((resolve, reject) => {
      uni.request({
        method: method!.toUpperCase() as any,
        url: getFullURL(baseURL || '', url!, params, paramsSerializer),
        header: headers,
        data,
        dataType: "text",
        timeout,
        success: (res: any) => {
          resolve(res)
        },
        fail: (err: any) => {
          reject(err)
        }
      })
    })
  }
})

// 用于存储每个请求的 CancelToken
const requests:any = [];
/**
 * 请求拦截
 */
instance.interceptors.request.use((config) => {
  const { method, params } = config

  // 获取自定义的store
  const store = useCountStore();

  // 取需要的 state
  const { token } = storeToRefs(store);

  // 附带鉴权的token
  const headers: any = {
    Authorization: token.value
  }
  // 不缓存get请求
  if (method === 'get') {
    headers['Cache-Control'] = 'no-cache'
  }
  // delete请求参数放入body中
  if (method === 'delete') {
    headers['Content-type'] = 'application/json;'
    Object.assign(config, {
      data: params,
      params: {}
    })
  }

  // 创建 CancelToken
  const source = axios.CancelToken.source();
  // 将 CancelToken 存储到 requests 数组中
  requests.push(source);
  // 将 CancelToken 添加到请求参数中
  config.cancelToken = source.token;
  return {
    ...config,
    headers
  }
})

/**
 * 响应拦截
 */
instance.interceptors.response.use((v) => {
  // @ts-ignore
  if (v.statusCode === 401) {
    // 取消其他请求
    requests.forEach(source => {
      source.cancel('请求被取消');
    });
    // 获取当前路由
    let routes = getCurrentPages();    
    // const refreshToken = uni.getStorageSync('refreshToken')
    // if (refreshToken) {
    //   userApi.refreshToken(refreshToken).then(res => {
    //     uni.setStorageSync("accessToken", res.access_token)
    //     uni.setStorageSync("refreshToken", res.refresh_token)
    //   })
    // }else{

    // }
    uni.removeStorageSync('accessToken')
    // alert('即将跳转登录页。。。', '登录过期')
    // setTimeout(redirectHome, 1500)
    if(routes[routes.length - 1].route === "pages/login") return v.data
    uni.navigateTo({
      url:"/pages/login"
    })
    return v.data
  }

  // @ts-ignore
  if ((v.status || v.statusCode) === 200) {
    return v.data
  }
  // alert(v.statusText, '网络错误')
  return Promise.reject(v)
})

export default new ThrottleAxios(instance)
