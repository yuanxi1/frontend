import { useAppDispatch } from "../app/hooks";
import authHeader from "../api/auth-header";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ImageListItem from "@mui/material/ImageListItem";
import { setBg_Preference } from "../reducers/userSlice";

const Settings = () => {
  const dispatch = useAppDispatch();

  const changeBg = (e: React.FormEvent, number: number) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : "";

    axios
      .patch(
        `http://localhost:8000/api/v1/preference/${userId}`,
        {
          user: {
            bg_preference: number,
          },
        },
        { headers: authHeader() }
      )
      .then((response) => {
        const res = response.data.data.attributes
        dispatch(setBg_Preference(res.bg_preference));
        localStorage.setItem('user', JSON.stringify(res))
        
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  return (
    <Paper sx={{ padding: 3, borderRadius: 5, width: "80%", margin: "auto" }}>
      <Typography variant="h6">Settings</Typography>

      <Box
        sx={{
          padding: 3,
          border: "1px solid #B39DDB",
          borderRadius: 5,
          margin: "auto",
        }}
      >
        <Typography>Change Background</Typography>
      
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            m: 1,
          }}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <ImageListItem
              key={num}
              onClick={(e) => changeBg(e, num)}
              sx={{
                width: 100,
                height: 100,
                m: 1,
                border: "3px solid grey",
                "&:hover": { border: "3px solid green" },
              }}
            >
              <img
                src={require(`../images/${num}.jpg`)}
                alt={`${num}`}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </Box>
        
      </Box>
    </Paper>
  );
};

export default Settings;
