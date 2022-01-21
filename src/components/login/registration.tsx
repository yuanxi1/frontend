import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Register } from "../../reducers/userSlice";
import AlertBar from "../alertBar";

const Registration = (props: { handleLogin: (arg0: any) => void; }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setPassword_confirmation] = useState('')
    let navigate = useNavigate();
    const dispatch = useAppDispatch()
    
    // useEffect(() => {
    //   if(successMessage ==='account created!'){
    //   navigate('/login')}
    // }, [successMessage])

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        const data = {user: {
              email: email,
              password: password,
              password_confirmation: password_confirmation,
            }}
        dispatch(Register(data))
    }

    return (
      <Paper sx={{ padding: 3, borderRadius: 5, width: "80%", margin: "auto" }}>
        
      <Typography variant="h6">Sign Up</Typography>

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