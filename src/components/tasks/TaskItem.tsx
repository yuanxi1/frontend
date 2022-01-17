import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import { useDispatch } from "react-redux";
import { deleteTask, taskUpdated } from "../../reducers/taskSlice";
import { useNavigate } from "react-router-dom";
import { Task } from "../../reducers/taskSlice";
import TagItem from "./TagItem"
interface TaskItemProps {
    task: Task
}
const TaskItem: React.FC<TaskItemProps> = ({ task }) =>{
    const tag_list = task.tag_list
    const tags = tag_list.map(tag => <TagItem key={tag.id} tag={tag.name} />)
    const dispatch = useDispatch()
    const handleDeleteTask = (taskId: Number) => {
        dispatch(deleteTask(taskId))
    }
    const navigate = useNavigate()
    const handleEditTask = (taskId: Number) => {
        navigate(`/edit_task/${taskId}`)
    }
    return (
    
        <Card sx={{ minWidth: 275, maxWidth: "80%" }}>
          <CardContent>
            
                <Typography variant="h6">{task.title}</Typography> 
                {tags}
                <Typography>
                {task.description}
                </Typography>
                {!!task.duedate && <Typography>Due date: {task.duedate}</Typography>}
             
          </CardContent>
          <CardActions>
            <IconButton onClick={()=>handleDeleteTask(task.id)}><DeleteIcon  /></IconButton>
            <IconButton color="primary" onClick={()=>handleEditTask(task.id)}><EditIcon  /></IconButton>
          </CardActions>
        </Card>
    
    )
}

export default TaskItem;