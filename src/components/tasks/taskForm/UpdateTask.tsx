import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import { Paper, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectTaskById, updateTask } from "../../../reducers/taskSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TagInput from "./TagsInput";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";

const EditTaskForm = () => {
  const { taskId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const task = useAppSelector(selectTaskById(parseInt(taskId? taskId : '')))

  const tag_list = task ? task.tag_list.map((tag) => tag.name) : [];
  const [title, setTitle] = useState(task?.title);
  const [description, setDescription] = useState(task?.description);
  const [tags, setTags] = useState(tag_list);
  const [duedate, setDuedate] = useState<Date>(
    task?.duedate ? parseISO(task?.duedate) : new Date()
  );

  const successMessage = useAppSelector((state) => state.alert.success);
  useEffect(() => {
    if (successMessage === "Task updated") {
      navigate(-1);
    }
  }, [successMessage, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (taskId) {
      const data = {
        task: {
          title: title,
          description: description,
          tag_list: tags,
          duedate: format(duedate, "yyyy-MM-dd"),
          taskId: taskId,
        },
      };
      dispatch(updateTask(data));
    }
  };

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "80%",
        gap: 2,
        margin: "auto",
        padding: 2,
      }}
    >
      <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <TextField
        id="title"
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        id="description"
        label="Description"
        multiline
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TagInput tags={tags} setTags={setTags} />

      <DatePicker
        label="Due Date"
        value={duedate}
        onChange={(newValue) => {
          if (newValue) {
            setDuedate(newValue);
          }
        }}
        renderInput={(params) => <TextField disabled {...params} />}
      />

      <Button variant="contained" onClick={handleSubmit}>
        Update
      </Button>
    </Paper>
  );
};
export default EditTaskForm;
