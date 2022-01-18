import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { addTask } from "../../reducers/taskSlice";
import TagInput from "./TagsInput";
import TextField from '@mui/material/TextField';
import { Paper } from "@mui/material";
import { Button } from "@mui/material";
import DatePicker from '@mui/lab/DatePicker';
import format from 'date-fns/format'
import AlertBar from "../alertBar";
import { clearTaskErrorMessage } from "../../reducers/taskSlice";

const AddTaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [duedate, setDuedate] = useState<Date>(new Date());
  const successMessage = useAppSelector(state=> state.task.success)
  const errorMessage = useAppSelector(state=> state.task.error)
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if(successMessage ==='added'){
    navigate('/home')}
  }, [successMessage])

  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault();
    const data = {task: {
            title: title,
            description: description,
            completed: false,
            duedate: format(duedate, 'yyyy-MM-dd') ,
            tag_list: tags
        }}
    dispatch(addTask(data))
  };

  return (
    <Paper 
      component="form" 
      sx={{ display: 'flex',
            flexDirection: 'column',
            maxWidth: '80%',
            gap: 2,
            margin: 'auto',
            padding: 2
            
    }}>
      {errorMessage && <AlertBar message={errorMessage} severity="error" clearMessage={clearTaskErrorMessage}/> }
      {/* {successMessage && <AlertBar message={'Task '+successMessage+' successfully!'} severity="success" clearMessage={clearTaskSuccessMessage}/> } */}
      <Button variant="outlined" color='secondary' onClick={() => navigate('/home')}>Go Back to Home Page</Button>
      <TextField 
          id="outlined-basic" 
          label="Title" 
          variant="outlined"
          value={title} 
          onChange={e => setTitle(e.target.value)} />
      <TextField
          id="outlined-multiline-flexible"
          label="Description"
          multiline
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      <TagInput tags={tags} setTags={setTags} />
      
        <DatePicker
          label="Due Date"
          value={duedate}
          onChange={(newValue) => {
            console.log(newValue)
            if(newValue){
            setDuedate(newValue);}
          }}
          renderInput={(params) => <TextField {...params} />}
        />
         <Button variant="contained" onClick={handleSubmit}>Add</Button>
        </Paper>
  );
};
export default AddTaskForm;
