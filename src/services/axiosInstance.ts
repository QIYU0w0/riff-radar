import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'https://apis.netstart.cn/music',
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log('请求发送前:', config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('响应数据:', response);
    if (response.data.code !== 200) {
      console.error('API 返回错误:', response.data);
      return Promise.reject(new Error('API 返回错误'));
    }
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    console.error('响应错误:', error);
    return Promise.reject(error);
  }
);

export default instance;