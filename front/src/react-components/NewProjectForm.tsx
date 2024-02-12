import React from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { FormHelperText, Input, InputAdornment, TextField } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ImageIcon from '@mui/icons-material/Image';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import PercentIcon from '@mui/icons-material/Percent';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { Note } from '@material-ui/icons';
import TitleIcon from '@mui/icons-material/Title';
import agent from '../../api/agent';

export interface ProjectModalWidnow{
    openModal:boolean,
    setOpenModal: (value: boolean)=> void,
}
type ifcValue = null | ArrayBuffer | Blob;

export interface ProjectFormData{
    ifcFile: null | File | Blob,
    ifcSrc: ifcValue,
    ifcName: string | null,
    name:string,
    description:string,
    status:string,
    finishDate: string,
    progress:number,
    cost:number,
}

const initialValues : ProjectFormData = {
    ifcFile: null,
    ifcSrc:null,
    ifcName: null,
    name:"",
    description:"",
    status: "Active",
    finishDate: "",
    progress:0,
    cost:0,
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height:750,
    //bgcolor: 'background.paper',
    bgcolor:'grey',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:'center',
   // overflowY:'scroll'
  };

function NewProjectForm(props: ProjectModalWidnow) {
    const [errors, setErrors] = React.useState({
        ifcSrc:false,
        name:false,
        description:false,
        status:false,
        finishDate:false,
        progress:false,
    });
    const [values, setValues] = React.useState(initialValues);

    const handleInputChange = (e:any)=>{
        const {name, value} = e.target;
        setValues({
            ...values,
            [name]:value,
        });
        console.log(values);
    }

    const resetForm = ()=>{
        setValues(initialValues);
        setErrors({
            ifcSrc:false,
            name:false,
            description:false,
            status:false,
            finishDate:false,
            progress:false,
        })
    }

    const handleClose = ()=>{
        resetForm();
        props.setOpenModal(false);
    }

    const onChangeIfcInput = (e: any)=>{
        console.log("inside ifc on change");
        if(e.target.files && e.target.files[0]){
            console.log("inside if of ifc on change");
            let ifcFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (x: any)=>{
                let ifcSrc = x.target.result;
                setValues({
                    ...values,
                    ifcFile,
                    ifcSrc,
                })
            }
            reader.readAsDataURL(ifcFile)
        }else{
            console.log("inside else of ifc on change");
            setValues({
                ...values,
                ifcName:'',
                ifcSrc:null,
            })
        }
        console.log("after on change ifc on change: ",values);
    }


    const validateForm = ()=>{
        values.name =="" ? errors.name = true : false;
        values.description=="" ? errors.description = true : false;
        values.status=="" ? errors.status = true : false;
        values.finishDate=="" ? errors.finishDate = true : false;
        values.ifcSrc ==null? errors.ifcSrc = true : false;
        
        if(Object.values(errors).every(x=>x==false)) return true;
        return false;
    }

    const submitForm = (e: any)=>{
        e.preventDefault();
        console.log("inside submit");
        if(validateForm()){

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("status", values.status);
            formData.append("cost", values.cost);
            formData.append("finishDate", values.finishDate);
            formData.append("progress", values.progress);

            formData.append("ifcName", values.ifcName);
            formData.append("ifcFile", values.ifcFile);
            formData.append("ifcSrc", values.ifcSrc);
            
            
            //console.log("formData: ",formData);
            agent.project.addProject(formData).then(()=>handleClose()).catch(e=>console.warn(e));
            
        }else{
            console.log("errors:", errors);
            alert("Form is not valid, try again");
        }

    }

  return (
    <>
        <Modal
            open={props.openModal}
            onClose={()=>props.setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box display="flex" flexDirection="column" justifyContent="flex-start" sx={style} component="form" onSubmit={(e)=>submitForm(e)}>
                
                <FormControl>
                    
                    <TextField 
                        name='name' 
                        value={values.name} 
                        error={errors.name}
                        required
                        label="Project Name"
                        sx={{marginBottom:'10px'}}
                        onChange={handleInputChange}
                        
                    />
                    {errors.name && <FormHelperText style={{color:'red'}}>Fill in Name</FormHelperText> }
                    <TextField
                        name='description'
                        value={values.description}
                        error={errors.description}
                        required
                        label="Description"
                        sx={{marginBottom:'10px'}}
                        onChange={handleInputChange}
                        
                    />
                    {errors.description && <FormHelperText style={{color:'red'}}>Fill in Description</FormHelperText>}
                    
                    <Select
                        value={values.status}
                        name='status'
                        onChange={handleInputChange}
                        required
                        defaultValue='active'
                        error={errors.status}
                        sx={{marginBottom:'10px'}}
                        
                    >
                        <MenuItem value={"Active"}>Active</MenuItem>
                        <MenuItem value={"Pending"}>Pending</MenuItem>
                        <MenuItem value="Finished">Finished</MenuItem>
                    </Select>
                    {errors.status && <FormHelperText style={{color:'red'}}>Select Status</FormHelperText>}
                    <TextField 
                        type='date' 
                        required 
                        value={values.finishDate} 
                        name='finishDate'
                        error={errors.finishDate}
                        sx={{marginBottom:'10px'}}
                        onChange={handleInputChange}
                    />
                    {errors.finishDate && <FormHelperText style={{color:'red'}}>Select Date</FormHelperText>}
                    <TextField
                        type='number'
                        inputProps={{min:0, max:100}}
                        value={values.progress}
                        name='progress'  
                        onChange={handleInputChange}  
                        sx={{marginBottom:'10px'}}  
                        InputProps={{
                            startAdornment: <InputAdornment position="start"> <PercentIcon  color='warning'/> </InputAdornment>,
                          }}         
                    />
                    {errors.finishDate && <FormHelperText style={{color:'red'}}>Fill in Progress</FormHelperText>}
                    <label htmlFor="ifcProjectFile" style={{color:'black'}}>Select IFC File</label>
                    <input id='ifcProjectFile' style={{marginBottom:'10px'}}  type='file' required  onChange={onChangeIfcInput} name='ifcSrc' accept=".ifc"/>
                    {errors.ifcSrc ? <FormHelperText style={{color:'red'}}>Select File</FormHelperText> : null}
                    <Box display="flex" justifyContent="center" alignItems="center" gap="10px">
                        <Button variant='contained' color='error' startIcon={<CancelIcon />} onClick={handleClose}>Cancel</Button>
                        <Button variant='contained' color='primary' startIcon={<SendIcon />} type='submit'>Submit</Button>
                    </Box>
                    
                </FormControl>
            </Box>
            
        </Modal>
    </>
  )
}

export default NewProjectForm