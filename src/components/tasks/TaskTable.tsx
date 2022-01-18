import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TaskItem from "./TaskItem";
import TagItem from "./TagItem";
import {
  clearTaskSuccessMessage,
  deleteTask,
  updateTask,
} from "../../reducers/taskSlice";
import { useNavigate } from "react-router-dom";
import { Task } from "../../reducers/taskSlice";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import useTable from "../useTable";
import {
  Backdrop,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import AlertBar from "../alertBar";
import { parseISO } from "date-fns";

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
  const today = new Date();

  const { TblContainer, TblHead } = useTable(headCells);
  const successMessage = useAppSelector((state) => state.task.success);
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleCloseBackdrop}
      >
        {open && <TaskItem task={tasksToDisplay[taskIndex]} />}
      </Backdrop>
      {successMessage && (
        <AlertBar
          message={"Task " + successMessage + " successfully!"}
          severity="success"
          clearMessage={clearTaskSuccessMessage}
        />
      )}
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
                    <Typography
                      sx={{
                        color:
                          task.completed || parseISO(task.duedate) >= today ? "black" : "#C62828",
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
