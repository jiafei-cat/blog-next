import axios from 'axios'
import { API_STATUS_CODE } from 'types/enum'

declare module 'axios' {
  interface IAxios<D = null> {
    code: API_STATUS_CODE
    message: string
    extra: D
  }
  export interface AxiosResponse<T = any> extends IAxios<D> {}
}
