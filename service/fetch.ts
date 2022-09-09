import axios from 'axios'

const requestInstance = axios.create({
  baseURL: '/',
})

requestInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)


requestInstance.interceptors.response.use(response => {
  if (response?.status === 200) {
    return response?.data 
  }

  return {
    code: -1,
    message: '未知错误',
    data: null
  }
}, (error) => Promise.reject(error))

const request = requestInstance

export default request
