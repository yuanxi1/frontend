import { useEffect, useState } from "react";
import { fetchAllTags } from "../reducers/tagSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Backdrop from "@mui/material/Backdrop";
import Fab from "@mui/material/Fab";
import { EditTagForm, AddTagForm } from "../components/tags/tagForms";


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

export default ManageTags;
