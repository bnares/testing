import {v4 as uuidv4} from 'uuid'
export type ProjectStatus = "Pending" | "Active" | "Finished"

export interface IProject{
    name: string,
    description: string,
    status: ProjectStatus,
    finishDate: Date,
    ifcName: string | null,
    cost: number,
    progress: number,
   
}


export class Project implements IProject{
    name: string = "";
    description: string="";
    status: ProjectStatus = "Active";
    finishDate: Date = new Date();
    ifcName: string | null = null;
    cost: number = 0;
    progress: number = 0;
    id:string = "";

    constructor(data: IProject, id = uuidv4()){
        this.id = id;
        this.name = data.name;
        this.description = data.description;
        this.status = data.status;
        this.finishDate = data.finishDate,
        this.ifcName = data.ifcName,
        this.cost = data.cost;
        this.progress = data.progress;
    }
}