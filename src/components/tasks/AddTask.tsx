import React, { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { taskAdded } from "../../reducers/taskSlice";
import authHeader from "../../api/auth-header";
import TagInput from "./TagsInput";
import TextField from '@mui/material/TextField';
import { Paper } from "@mui/material";
import { Button } from "@mui/material";
import Switch from '@mui/material/Switch';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import format from 'date-fns/format'

const AddTaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showdate, setShowdate] = useState(false)
  const [duedate, setDuedate] = useState<Date>(new Date());
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // const handleToggle = () => {
  //   setShowdate(prev => !prev);
  // }
  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault();
    axios.post("http://localhost:8000/api/v1/tasks", 
      {task: {
          title: title,
          description: description,
          completed: false,
          duedate: format(duedate, 'yyyy-MM-dd') ,
          tag_list: tags
      }}, 
      {headers: authHeader()})
      .then((response) => { 
        
        dispatch(taskAdded(response.data));
        navigate('/home')
      });
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
      
      {/* <FormGroup>
        <FormControlLabel control={<Switch onClick={handleToggle} />} label="Due Date" />
      </FormGroup> */}  
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
