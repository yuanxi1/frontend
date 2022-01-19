import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "../../reducers/userSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AlertBar from "../alertBar";
import { clearLoginError } from "../../reducers/userSlice";

export interface loginDataType {
  JWTToken: string;
  user: {};
}
const Login: React.FC<{ handleLogin: (data: loginDataType) => void }> = (
  props
) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, loggedIn, error } = useAppSelector((state) => state.user);
  //if isLoading, put a spinner, if there's error, alert the error
  // const loginError = useAppSelector((state) => state.user.error);
  useEffect(() => {
    if (loggedIn) {
      navigate("/home");
    }
  }, [loggedIn])
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      user: {
        email: email,
        password: password,
      },
    };
    dispatch(logIn(data));
  
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 5, width: "80%", margin: "auto" }}>
      {error && (
        <AlertBar
          message={error}
          severity="error"
          clearMessage={clearLoginError}
        />
      )}
      <Typography variant="h6">Log In</Typography>

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
          id="email"
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
          id="password"
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

        <Button onClick={handleSubmit} disabled={isLoading}>Log In</Button>
        <div>
          New to the app? Sign up <Link to="/register">Here</Link>!
        </div>
      </Stack>
    </Paper>
  );
};
export default Login;
