import { useAppSelector, useAppDispatch } from "../app/hooks";
import authHeader from "../api/auth-header";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { setBg_Preference } from "../reducers/userSlice";

const Settings = () => {
  const dispatch = useAppDispatch();
  
  const changeBg = (e:React.FormEvent, number: number) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).user.data.id : "";
    
    axios
      .patch(
        `http://localhost:8000/api/v1/preference/${userId}`,
        {
          user: {
            bg_preference: number
          },
        },
        { headers: authHeader() }
      )
      .then((response) => {
        dispatch(setBg_Preference(response.data.bg_preference))
      })
      .catch((err) => {
        console.log(err.response.data)
      });
  }
  return (
    <Paper sx={{ padding: 3, borderRadius: 5, width: "80%", margin: "auto" }}>
      <Typography variant='h6'>Settings</Typography>

      <Box
        sx={{
          padding: 3,
          border: "1px solid #B39DDB",
          borderRadius: 5,
          margin: "auto",
        }}
      >
        <Typography>Change Background</Typography>
        <ImageList sx={{ width: 500, height: 100 }} cols={5}>
      
        {[1, 2, 3, 4, 5].map(num => 
          <ImageListItem key={num} onClick={(e)=>changeBg(e, num)} sx={{border:'2px solid #B39DDB', "&:hover": { border: "2px solid red" }}} >
          <img
            src={require(`../images/${num}.jpg`)}
            alt={`${num}`}
            loading="lazy"
          />
        </ImageListItem>)}
      
    </ImageList>
      </Box>
    </Paper>
  );
}

export default Settings;
