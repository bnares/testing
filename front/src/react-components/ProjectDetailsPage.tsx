import React from 'react'
import * as Router  from 'react-router-dom'
import { ViewerContext } from './ReactContext';
import { IFCViewer } from './IFCViewer';
import { Project } from '../class/Project';

function ProjectDetailsPage() {
    const {projectList, setProjectList} = React.useContext(ViewerContext);
    const routeParams = Router.useParams<{id: string}>();
    const idProjectNumber = parseInt(routeParams.id as string);
    const project = projectList?.filter(x=>x.id==idProjectNumber) as Project[];
    console.log("id: ",routeParams);
    console.log("projectList: ", projectList);
    if(!routeParams.id) return (<p>Wrong URL, no such project</p>);
    if(project.length==0) return (<p>No Such Project</p>)


  return (
    <div className="page" id="project-details">
        <div className="main-page-content">
            <IFCViewer  {...project[0]}/>
        </div>
    </div>
  )
}

export default ProjectDetailsPage