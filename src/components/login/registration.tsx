import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Registration = (props: { handleLogin: (arg0: any) => void; }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setPassword_confirmation] = useState('')
    let navigate = useNavigate();

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        console.log("form sumbitted");
        
        axios.post("http://localhost:8000/api/v1/register", {
          user: {
            email: email,
            password: password,
            password_confirmation: password_confirmation,
          },
        }).then(response => {
            console.log(response)
            props.handleLogin(response.data)
            navigate('/home')
        });
    }

    return (
      <Paper sx={{ padding: 3, borderRadius: 5, width: "80%", margin: "auto" }}>
      <Typography>Log In</Typography>

      <Stack
        spacing={2}
        sx={{
          padding: 3,
          border: "1px solid #B39DDB",
          borderRadius: 5,
          margin: "auto",
        }}
      >
        <TextField
          fullWidth
          id="outlined-basic"
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // {...(errors.oldPassword && {
          //   error: true,
          //   helperText: errors.oldPassword,
          // })}
        />
        <TextField
          fullWidth
          id="outlined-basic"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // {...(errors.newPassword && {
          //   error: true,
          //   helperText: errors.newPassword,
          // })}
        />
        <TextField
          fullWidth
          id="outlined-basic"
          label="Confirm Password"
          type="password_confirmation"
          variant="outlined"
          value={password_confirmation}
          onChange={(e) => setPassword_confirmation(e.target.value)}
          // {...(errors.newPassword && {
          //   error: true,
          //   helperText: errors.newPassword,
          // })}
        />

        <Button onClick={handleSubmit}>Sign Up</Button>
      <div>
            Already a user?  Log in <Link to="/login">Here</Link>!
        </div>
        </Stack>
      </Paper>
        
    )
}
export default Registration;