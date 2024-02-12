import React from "react"
import { Project } from "../class/Project"

interface IViewerContext{
    projectList: Project[] | null,
    setProjectList: (data: Project[])=> void,
}

export const ViewerContext = React.createContext<IViewerContext>({
    projectList: null,
    setProjectList: ()=>{}
})

export function ViewerProvider(props:{children:React.ReactNode}){
    const [projectList, setProjectList] = React.useState<Project[] | null>(null);
    return(
        <ViewerContext.Provider value={{projectList, setProjectList}}>
            {props.children}
        </ViewerContext.Provider>
    )
}