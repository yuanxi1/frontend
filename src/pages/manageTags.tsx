import { useEffect, useState } from "react";
import { fetchAllTags, addTag, deleteTag, tagUpdated } from "../reducers/tagSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import authHeader from "../api/auth-header";
import axios from "axios";
import { Tag } from "../reducers/tagSlice";
import { Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";

const ManageTags = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [openAddTag, setOpenAddTag] = useState(false);
  const [tagIndex, setTagIndex] = useState(0);
  const tags = useAppSelector((state) => state.tag.tags);
  const tagStatus = useAppSelector((state) => state.tag.status);

  useEffect(() => {
    if (tagStatus === "idle") {
      dispatch(fetchAllTags());
    }
  }, [tagStatus, dispatch]);

  const handleClick = (index: number) => {
    setOpen(true);
    setTagIndex(index);
  };
  const handleAddClick = () => {
    setOpenAddTag(prev => !prev)
  };
  const handleCloseBackdrop = () => {
    setOpen(false);
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 5, width: "80%", margin: "auto" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleCloseBackdrop}
      >
        {open && <EditTagForm tag={tags[tagIndex]} />}
      </Backdrop>
      <Typography>Manage Your Tags</Typography>

      <Box
        sx={{
          padding: 3,
          border: "1px solid #B39DDB",
          borderRadius: 5,
          margin: "auto",
        }}
      >
        {tags.map((tag, index) => (
          <Chip
            label={tag.name}
            onClick={() => handleClick(index)}
            sx={{ margin: 1 }}
          />
        ))}

        <Fab
          size="small"
          color="secondary"
          aria-label="search"
          onClick={handleAddClick}
        >
          <AddIcon />
        </Fab>
        {openAddTag && <AddTagForm />}
      </Box>
    </Paper>
  );
};

const AddTagForm = () => {
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();

  const handleDone = () => {
    const data = { tag: { name: name } };
    dispatch(addTag(data));
  };
  return (
    <TextField
      fullWidth
      id="outlined-basic"
      label="Name"
      variant="outlined"
      value={name}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleDone();
          setName('');
        }
      }}
      onChange={(e) => setName(e.target.value)}
    />
  );
};
const EditTagForm: React.FC<{ tag: Tag }> = ({ tag }) => {
  const [name, setName] = useState(tag.name);
  const dispatch = useAppDispatch();

  const handleDone = (e: React.FormEvent, id: number) => {
    const data = { tag: { name: name } };
    e.preventDefault();
    axios.patch(`http://localhost:8000/api/v1/tags/${id}`, 
    data, 
      {headers: authHeader()})
      .then((response) => { 
        console.log('update tag', response.data)
        dispatch(tagUpdated(response.data));
      });
  };
  const handleDeleteTag = (id: number) => {
    dispatch(deleteTag(id));
  };
  return (
    <Card sx={{ minWidth: 275, maxWidth: "80%" }}>
      <CardContent>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteTag(tag.id)}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={e => handleDone(e, tag.id)}
        >
          Done
        </Button>
      </CardActions>
    </Card>
  );
};
export default ManageTags;
