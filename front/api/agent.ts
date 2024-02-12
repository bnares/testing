import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "react-toastify";

axios.defaults.baseURL = "https://localhost:7115/api/";;

const responseBody = (response: AxiosResponse)=>response.data;

const request = {
    get: (url: string)=> axios.get(url).then(responseBody),
    post: (url: string, body:{})=>axios.post(url, body).then(responseBody),
    delete: (url: string)=>axios.delete(url).then(responseBody)
}

const project={
    allProject: ()=>request.get("Project/allProjects"),
    getProject:(id: number)=>request.get(`Project/getProject/${id}`),
    addProject: (data: any)=> request.post("Project/newProject",data),
    getFileModel: (fileName: string, config?: any)=>request.get(`Project/ifc/${fileName}`, config),
}

const agent = {
    project
}

export default agent;