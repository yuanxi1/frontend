import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import { Paper, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateTask } from "../../reducers/taskSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TagInput from "./TagsInput";
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'
import AlertBar from "../alertBar";
import { clearTaskErrorMessage } from "../../reducers/taskSlice";


const EditTaskForm = () => {
  const{ taskId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const task = useAppSelector(state => state.task.tasks.find(task => (task.id).toString() === taskId))
  const tag_list = task ? task.tag_list.map(tag => tag.name) : []
  const [title, setTitle] = useState(task?.title);
  const [description, setDescription] = useState(task?.description)
  const [tags, setTags] = useState(tag_list);
  const [duedate, setDuedate] = useState< Date >(task?.duedate ? parseISO(task?.duedate): new Date());

  const errorMessage = useAppSelector(state=> state.task.error)
  const successMessage = useAppSelector(state=> state.task.success)
  useEffect(() => {
    if(successMessage ==='updated'){
    navigate('/home')}
  }, [successMessage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if(taskId) {
      const data = {
        task: {
          title: title,
          description: description,
          tag_list: tags,
          duedate: format(duedate, 'yyyy-MM-dd'),
          taskId: taskId
      }
      }
      dispatch(updateTask(data))
    }
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
            if(newValue){
              setDuedate(newValue);}
          }}
          renderInput={(params) => <TextField {...params} />}
        />
    
         <Button variant="contained" onClick={handleSubmit}>Update</Button>
        </Paper>
  );
};
export default EditTaskForm;
