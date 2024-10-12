// 引入axios
import axios from 'axios'
// 请求超时时间
axios.defaults.timeout = 10000

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} headers [可选的请求头]
 */
export function get(url, params, headers = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
        headers: headers, 
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} headers [可选的请求头]
 */
export function post(url, params, headers = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, {
        headers: headers,
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} headers [可选的请求头]
 */
export function put(url, params, headers = {}) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params, {
        headers: headers, 
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} headers [可选的请求头]
 */
export function del(url, params, headers = {}) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: headers, 
        data: params, 
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
