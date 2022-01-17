import { useState } from "react";
import { useAppDispatch, } from "../../app/hooks";
import axios from "axios";
import authHeader from "../../api/auth-header";
import TaskItem from "./TaskItem";
import TagItem from "./TagItem";
import {
  deleteTask,
  taskUpdated
} from "../../reducers/taskSlice";
import { useNavigate } from "react-router-dom";
import { Task } from "../../reducers/taskSlice";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import useTable from "../useTable";
import { Backdrop, TableBody, TableCell, TableRow } from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

const headCells = [
  { id: "title", label: "Title" },
  { id: "tags", label: "Tags" },
  { id: "due", label: "Date" },
  { id: "actions", label: "Actions" },
];
const TaskTable: React.FC<{
  tasksToDisplay: Task[];
  showCompleted: boolean;
}> = ({ tasksToDisplay, showCompleted }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [taskIndex, setTaskIndex] = useState(0);
  const { TblContainer, TblHead } = useTable(headCells);

  const handleDeleteTask = (taskId: Number) => {
    dispatch(deleteTask(taskId));
  };

  const handleEditTask = (taskId: Number) => {
    navigate(`/edit_task/${taskId}`);
  };
  const handleCompleteTask = (e: React.FormEvent, taskId: Number) => {
    e.preventDefault();
    axios
      .patch(
        `http://localhost:8000/api/v1/tasks/${taskId}`,
        {
          task: { completed: true },
        },
        { headers: authHeader() }
      )
      .then((response) => {
        dispatch(taskUpdated(response.data));
      });
  };
  const handleUndoTask = (e: React.FormEvent, taskId: Number) => {
    e.preventDefault();
    axios
      .patch(
        `http://localhost:8000/api/v1/tasks/${taskId}`,
        {
          task: { completed: false },
        },
        { headers: authHeader() }
      )
      .then((response) => {
        dispatch(taskUpdated(response.data));
      });
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleCloseBackdrop}
      >
        {open && <TaskItem task={tasksToDisplay[taskIndex]} />}
      </Backdrop>

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
                    backgroundColor: task.completed ? "#EEEEEE" : "white",
                  }}
                >
                  <TableCell
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    onClick={() => handleShowTask(index)}
                  >
                    {task.title}
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
