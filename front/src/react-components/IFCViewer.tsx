import React from 'react'
import * as OBC from "openbim-components";
import { FragmentsGroup } from 'bim-fragment';
//import { TodoCreator } from '../bim-components/TodoCreator';
import { useNavigate, useParams } from 'react-router-dom';
import agent from '../../api/agent';
import * as THREE from "three"
import axios, { AxiosResponse } from 'axios';
import { Project } from '../class/Project';


export interface downloadedToDo {
    camera: string,
    date: string,
    description: string,
    id: number,
    priority: string,
    fragmentMap: string,
    projectId: number,
    project: any,
}




export function IFCViewer(props: Project){
    //const {setViewer} = React.useContext(ViewerContext);
    const {id} = useParams();
    const [fileData, setFileData] = React.useState<Blob | null>(null);
    const [modelDownloaded, setModelDownloaded] = React.useState<boolean>(false);
    const [ifcLoader, setIfcLoader] = React.useState<OBC.FragmentIfcLoader | null>(null);
    const navigate = useNavigate();
    const [viewer, setViewer] = React.useState< OBC.Components | null>( null);
    const [viewerScene, setViewerScene] = React.useState<THREE.Scene | null>(null);
    const [initialize, setInitialize] = React.useState<boolean>(false);

    console.log("props: ",props);

    const downloadFile = async () => {
        var testName = "NAV-IPI-ET242736339.ifc";
        var fileName = props.ifcName;
        console.log("props fileName: ",fileName);
        if(props.ifcName){
            try {
                // const response: AxiosResponse<Blob> = await agent.project.getFileModel(props.ifcName,{
                //     responseType:"blob",
                // });
                const response: AxiosResponse<Blob> = await axios.get(`https://localhost:7115/api/Project/ifc/${props.ifcName}`, {
                    responseType: 'blob',
                });
    
                if (response.status === 200) {
                    setFileData(response.data);
                    setModelDownloaded(true);
                } else {
                    console.error('Failed to download Ifc file.');
                }
            } catch (error) {
                console.error('Error downloading Ifc file:', error);
            }
        }
        
    };

   const createBimViewer = async (viewerContainer : HTMLDivElement)=>{
        let viewer : OBC.Components  = new OBC.Components;
        const sceneComponent = new OBC.SimpleScene(viewer);
        sceneComponent.setup();
        viewer.scene = sceneComponent;
        const scene = sceneComponent.get();
        setViewerScene(scene);
        scene.background = null;
        const rendereComponent = new OBC.PostproductionRenderer(viewer, viewerContainer);
        viewer.renderer = rendereComponent;

        const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
        viewer.camera = cameraComponent;

        const raycasterCompoent = new OBC.SimpleRaycaster(viewer);
        viewer.raycaster = raycasterCompoent;

        viewer.init();
        cameraComponent.updateAspect();
        rendereComponent.postproduction.enabled = true;
        const fragmentManager = new OBC.FragmentManager(viewer);
        const highlighter = new OBC.FragmentHighlighter(viewer);
        highlighter.setup();

        const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);

        //const taskItem = new AsignTask(viewer, Number(id), props);
        //taskItem.setup();

        const createFragmentMapFromDownladedTodo = (model : FragmentsGroup, todo: downloadedToDo)=>{
            var fragmentMap : any = {};
            for(var taskExpressIdDownloaded of todo.fragmentMap.split(", ").filter(x=>x.length!=0)){
                for(var item of model.items){
                    var fragmentIdModel = item.id;
                    for(var expressIDsModel of item.items){
                        if(taskExpressIdDownloaded == expressIDsModel){
                            if(Object.keys(fragmentMap).includes(fragmentIdModel)){
                                var addedData = fragmentMap[fragmentIdModel];
                                //addedData.push(taskExpressIdDownloaded);
                                addedData.add(taskExpressIdDownloaded);
                                var newFragmentMap = {...fragmentMap, fragmentIdModel: addedData};
                                fragmentMap = newFragmentMap;
                            }else{
                                //fragmentMap[fragmentIdModel] = [taskExpressIdDownloaded];
                                fragmentMap[fragmentIdModel] = new Set([taskExpressIdDownloaded]);
                            }
                        }
                    }
                }
            }
            if(Object.keys(fragmentMap).includes("fragmentIdModel")){
                delete fragmentMap["fragmentIdModel"];
            }
            return fragmentMap; 
        }

        const createCameraPositionFromDwonloadedToDo=(cameraDownloaded: string)=>{
            
            if(!(viewer.camera instanceof OBC.OrthoPerspectiveCamera) ){
                throw new Error("This is not orthoperspective camera");
            }
            var camera = JSON.parse(cameraDownloaded);
            var position = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
            var target = new THREE.Vector3(camera.target.x, camera.target.y, camera.target.z);
            return {position, target};
        }

        const onModelLoaded = async (model : FragmentsGroup)=>{
            console.log(model);
            highlighter.update();
            propertiesProcessor.process(model);
            highlighter.events.select.onHighlight.add((fragmentMap)=>{
                const expressID = [...Object.values(fragmentMap)[0]][0];
                propertiesProcessor.renderProperties(model, Number(expressID));
            })
            
            if(id){
                // const todo :downloadedToDo[] = await agent.todo.getAllModelToDo(Number.parseInt(id));
                // for(var item  of todo){
                    
                //     var fragmentMapCreated = createFragmentMapFromDownladedTodo(model,item);
                //     var cameraCreated =  createCameraPositionFromDwonloadedToDo(item.camera);
                //     await taskItem.loadTaskFromDb(fragmentMapCreated,cameraCreated,item);
                // }
                
            }else{
                navigate("/not-found");
            }
        }

        const getIfcFile = async ()=>{
            const file = await fetch(props.ifcSrc);
            const data = await file.arrayBuffer();
            const buffer = new Uint8Array(data);
            const model = await ifcLoader.load(buffer,"example");
            var test = viewer.scene.get();
            test.add(model);
        }

        const ifcLoader = new OBC.FragmentIfcLoader(viewer);
        setIfcLoader(ifcLoader);
        ifcLoader.settings.wasm = {
            path: "https://unpkg.com/web-ifc@0.0.43/",
            absolute: true
        }

        ifcLoader.onIfcLoaded.add(async (model)=>{
            onModelLoaded(model);
        });

        const toolbar = new OBC.Toolbar(viewer);
        toolbar.addChild(
            //ifcLoader.uiElement.get("main"),
            propertiesProcessor.uiElement.get("main"),
            //taskItem.uiElement.get("activationButton"),
        )
        viewer.ui.addToolbar(toolbar);
        return viewer;

   }

    const loadIfcFile = async (fileData : Blob, ifcLoader : OBC.FragmentIfcLoader) => {
        try {

            const file = await fileData.arrayBuffer();
            const buffer = new Uint8Array(file);
            
            const model = await ifcLoader.load(buffer, props.name);
            console.log("model: ",model);
            if(viewerScene instanceof THREE.Scene){
                viewerScene.add(model);
                
            }
            
        } catch (error) {
            console.error("Error loading Ifc file:", error);
            console.log()
           
        }
    };

    React.useEffect(()=>{
        if(!initialize){
            downloadFile();
            
            let IfcViewer : OBC.Components | undefined = undefined;
            const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement; 
            const initialize = async (IfcContainer : HTMLDivElement)=> {
                IfcViewer = (await createBimViewer(IfcContainer)) as OBC.Components;
                if(!IfcViewer) return;
                else{
                    setInitialize(true);
                }
            }

            if(viewerContainer){
                initialize(viewerContainer);
                
            }
            if(fileData && ifcLoader){
                loadIfcFile(fileData, ifcLoader);   
            }
        }
        
        //loadIfcFile(viewer);
        return ()=>{
            if(viewer !=null){
                viewer.dispose();
                setViewer(null);
            }
        }
    },[initialize])

    React.useEffect(()=>{
        downloadFile();
        if(modelDownloaded){
            console.log("blob data: ",fileData);
            if(fileData instanceof Blob && ifcLoader instanceof OBC.FragmentIfcLoader && viewerScene instanceof THREE.Scene ){
                loadIfcFile(fileData, ifcLoader);
                setInitialize(true);
            }else{
                alert("Not right file ");
            }
            
        }

    },[JSON.stringify(props), modelDownloaded, ifcLoader, viewerScene])

    return(
        <>
            
            <div
                id="viewer-container"
                className="dashboard-card"
                style={{ minWidth: 0, position: "relative", height:'100%', width:'100%' }}
            >
           
            </div>
            
            
        </>
    )
}