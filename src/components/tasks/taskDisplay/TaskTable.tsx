import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import TaskItem from "./TaskItem";
import TagItem from "./TagItem";
import { deleteTask, updateTask } from "../../../reducers/taskSlice";
import { useNavigate } from "react-router-dom";
import { Task } from "../../../types/interface";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import useTable from "./useTable";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { parseISO } from "date-fns";
import { subDays } from 'date-fns';


const headCells = [
  { id: "title", label: "Title" },
  { id: "tags", label: "Tags" },
  { id: "due", label: "Date" },
  { id: "actions", label: "Actions" },
];
const TaskTable: React.FC<{
  tasksToDisplay: Task[];
  showCompleted: boolean;
}> = ({ tasksToDisplay, showCompleted}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);
  const yesterday = subDays(new Date(), 1);

  const { TblContainer, TblHead } = useTable(headCells);
  
  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask(taskId));
  };

  const handleEditTask = (taskId: number) => {
    navigate(`/edit_task/${taskId}`);
  };
  const handleCompleteTask = (e: React.FormEvent, taskId: number) => {
    e.preventDefault();
    const data = {
      task: {
        completed: true,
        taskId: taskId,
      },
    };
    dispatch(updateTask(data));
  };
  const handleUndoTask = (e: React.FormEvent, taskId: number) => {
    e.preventDefault();
    const data = {
      task: {
        completed: false,
        taskId: taskId,
      },
    };
    dispatch(updateTask(data));
  };
  const handleShowTask = (index: number) => {
    setOpen(true);
    setTaskIndex(index);
  };

  const handleCloseBackdrop = () => {
    setOpen(false);
  };

  return (
    <>
    {/* show details of task in a card */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleCloseBackdrop}
      >
        {open && <TaskItem task={tasksToDisplay[taskIndex]} />}
      </Backdrop>

    {/* display tasks in a table */}
      <TblContainer>
        <TblHead />
        <TableBody>
          {tasksToDisplay.map(
            (task, index) =>
              (showCompleted || !task.completed) && (
                <TableRow
                  key={task.id}
                  sx={{
                    "&:hover": { backgroundColor: "#fff8db" },
                    backgroundColor: task.completed ? "#EEEEEE" : "white", //diff bg between active and completed tasks
                  }}
                >
                  <TableCell
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    onClick={() => handleShowTask(index)}
                  >
                    <Typography
                      sx={{
                        color:
                          task.completed || parseISO(task.duedate) > yesterday ? "black" : "#C62828", //red color for overdue tasks
                      }}
                    >
                      {task.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {task.tag_list.map((tag) => (
                      <TagItem key={tag.id} tag={tag.name} />
                    ))}
                  </TableCell>
                  <TableCell>{task.duedate}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditTask(task.id)} 
                 >
                      <EditIcon />
                    </IconButton>

                    {task.completed ? (
                      <IconButton
                        color="default"
                        onClick={(e) => handleUndoTask(e, task.id)}
                      >
                        <UndoIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="success"
                        onClick={(e) => handleCompleteTask(e, task.id)}
                      >
                        <DoneOutlineIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </TblContainer>
    </>
  );
};

export default TaskTable;
