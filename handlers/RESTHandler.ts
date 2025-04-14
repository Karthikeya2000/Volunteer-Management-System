// @ts-nocheck
import axios from 'axios';
const token = JSON.parse(sessionStorage.getItem("user"))?.token;
if(!token){
  setTimeout(()=>{},5000);
}
const api = axios.create({
  baseURL: 'https://gxp8728.uta.cloud/volunteer_api/public',
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response) {
      window.location.href = `#/error/${error.response.status}`;
    }
  },
);
export default class RESTHandler {
  static async get(url: string,token:string) {
    const headers = {
      'Authorization': `Bearer ${token || JSON.parse(sessionStorage.getItem("user"))?.token}`,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
    return api.get(url, {headers}).then((res) => res?.data);
  }
  static async post<TData>(url: string, data: TData) {
    const headers = {
      'Authorization': `Bearer ${token || JSON.parse(sessionStorage.getItem("user"))?.token}`,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
    return api.post(url, data, {headers}).then((res) => res?.data);
  }
  static async put<TData>(url: string, data: TData) {
    return api.put(url, data).then((res) => res?.data);
  }
  static async delete(url: string) {
    return api.delete(url).then((res) => res?.data);
  }
  static async patch<TData>(url: string, data: TData) {
    return api.patch(url, data).then((res) => res?.data);
  }
}
