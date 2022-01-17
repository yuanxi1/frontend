import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import { loginPending, loginSuccess, loginFail } from "../../reducers/loginSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

export interface loginDataType{
  JWTToken: string,
  user: {}
}
const Login: React.FC<{handleLogin:(data:loginDataType) => void;}> = (props) => {
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
    <Container>
      <Form>
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
      </Form>
    </Container>
  );
};
export default Login;
