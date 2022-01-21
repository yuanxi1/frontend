import { useState } from "react";
import { addTag, deleteTag, updateTag } from "../../reducers/tagSlice";
import { useAppDispatch } from "../../app/hooks";
import { Tag } from "../../types/interface";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

export const AddTagForm = () => {
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

export const EditTagForm: React.FC<{ tag: Tag }> = ({ tag }) => {
    const [name, setName] = useState(tag.name);
    const dispatch = useAppDispatch();
  
    const handleDone = (e: React.FormEvent, id: number) => {
      const data = { tag: { 
          id: id,
          name: name } };
      e.preventDefault();
      dispatch(updateTag(data));
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