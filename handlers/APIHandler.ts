// @ts-nocheck
import { IData } from "../interfaces/IData";
import { ISigninData } from "../interfaces/ISigninData";
import { ISignupData } from "../interfaces/ISignupData";
import RESTHandler from "./RESTHandler";
export default class APIHandler {
    static signupUser(data:ISignupData,token:string): Promise<IData> {
        return RESTHandler.post(`/api/user_register`, data, token);
    }
    static loginUser(data:ISigninData, token:string): Promise<IData>{
        return RESTHandler.post(`/api/user_login`,data, token);
    }
    static isAIGenerated(data): Promise<any>{
        return RESTHandler.post(`https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/`,data)
    }
    static getGraduates(professorId: string, token:string): Promise<any> {
        return RESTHandler.get(`/api/all_graduates?professor_id=${professorId}`,token);
    }
    static getTaskList(professorId: string,token:string): Promise<any> {
        return RESTHandler.get(`/api/tasks_list?professor_id=${professorId}`,token);
    }
    static createTask(data:any, token:string): Promise<any> {
        return RESTHandler.post(`/api/create_task`,data, token);
    }
    static certify(data:any, token:string): Promise<any> {
        return RESTHandler.post(`/api/certify`,data, token);
    }
    static getUserDetails(id:string, token:string): Promise<any> {
        return RESTHandler.get(`/api/user_details?id=${id}`, token)
    }
    static updateReviewComments(data:any, token:string): Promise<any> {
        return RESTHandler.post(`/api/updateTaskByProfessor`,data, token)
    }

    static getTasksByGraduate(params = "", token:string): Promise<any>{
        return RESTHandler.get(`/api/gradaute_task_list?graduate_id=${JSON.parse(sessionStorage.getItem("user")).user_id}&${params}`, token);
    }

    static getTaskDetails(task_id, token:string): Promise<any> {
        return RESTHandler.get(`/api/tasks_details?task_id=${task_id}`, token);
    }
    
    static getTaskLogs(task_id, token:string): Promise<any> {
        return RESTHandler.get(`/api/task_logs?task_id=${task_id}`, token);
    }
    
    static getImportantDates(token: string): Promise<any>{
        return RESTHandler.get(`/api/gradaute_important_dates?graduate_id=${JSON.parse(sessionStorage.getItem("user"))?.user_id}`, token)
    }

    static getHoursLogged(): Promise<any>{
        return RESTHandler.get(`/api/get_hours?graduate_id=${JSON.parse(sessionStorage.getItem("user")).user_id}`, JSON.parse(sessionStorage.getItem("user"))?.token)
    }

    static getTaskStatus(task_id,token:string): Promise<any>{
        return RESTHandler.get(`api/tast_status?task_id=${task_id}`, token)
    }

    static updateTask(data: any, token:string): Promise<any>{
        return RESTHandler.post(`/api/updateTask`, data, token)
    }

    static getProfessorsList(graduate_id: string, token:string): Promise<any> {
        return RESTHandler.get(`/api/get_professors_list?graduate_id=${graduate_id}`, token);
    }
    static sendContactUs(data:any, token:string): Promise<any> {
        return RESTHandler.post(`/api/contact-us`, data, token);
    }

    // static updateData(data: any): Promise<IData> {
    //     const {id, ...newObj} = data;
    //     return RESTHandler.put(`/api/v1/records/${id}`,newObj);
    // }
    // static deleteData(id: string): Promise<IData> {
    //     return RESTHandler.delete(`/api/v1/records/${id}`);
    // }
}