import React from 'react'
import agent from '../../api/agent';
import { Project } from '../class/Project';
import ProjectCard from './ProjectCard';
import { Button } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import NewProjectForm from './NewProjectForm';
import { ViewerContext } from './ReactContext';
import { Sidebar } from './Sidebar';

function ProjectPage() {
    const {projectList, setProjectList} = React.useContext(ViewerContext);

    const [projects, setProjects] = React.useState<Project[]>([])
    const [openModal, setOpenModal] = React.useState<boolean>(false);

    React.useEffect(()=>{
        agent.project.allProject().then((resp)=>setProjectList(resp)).catch(e=>console.warn(e));
        //setProjectList(projects);
    },[openModal])
    console.log("projectList in main:",projectList);
  return (
    <div className="page" id="projects-page">
        <div>
            <Button  variant='contained' onClick={()=>setOpenModal(true)} startIcon={<FileUploadIcon />}>New Project</Button>
        </div>
        
        <div id="projects-list">
            {(projectList!=null && projectList.length > 0) ? projectList.map((item : Project)=>(<ProjectCard key={item.id}  {...item}/>)) : (<h2>No Project To Display</h2>)}
        </div>
        {openModal ? <NewProjectForm  openModal={openModal} setOpenModal={setOpenModal}/> : null}
    </div>
  )
}

export default ProjectPage