import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  loginPending,
  loginSuccess,
  loginFail,
} from "../../reducers/loginSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
export interface loginDataType {
  JWTToken: string;
  user: {};
}
const Login: React.FC<{ handleLogin: (data: loginDataType) => void }> = (
  props
) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, loggedIn, error } = useAppSelector((state) => state.login);
  //if isLoading, put a spinner, if there's error, alert the error

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form sumbitted"); //

    axios
      .post("http://localhost:8000/api/v1/login", {
        user: {
          email: email,
          password: password,
        },
      })
      .then((response) => {
        console.log(response); //
        dispatch(loginPending());
        props.handleLogin(response.data);
        dispatch(loginSuccess());
        navigate("/home");
      });
  };

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

        <Button onClick={handleSubmit}>Log In</Button>
      </Stack>
      {/* <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember Me" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Log in
        </Button>{" "}
      </Form> */}
    </Paper>
  );
};
export default Login;
