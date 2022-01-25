import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Register } from "../../reducers/userSlice";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const validate = () => {
    let temp = { email: "", password: "", password_confirmation: "" };
    temp.email = email.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)
      ? ""
      : "Invalid Email.";
    temp.password =
      password.length > 5 ? "" : "Must not be less than 6 characters.";
    temp.password_confirmation =
      password_confirmation === password ? "" : "Must match the password.";
    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const successMessage = useAppSelector(state => state.alert.success)
  useEffect(() => {
    if(successMessage ==='Registed'){
    navigate('/login')}
  }, [successMessage])

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validate()) {
      const data = {
        user: {
          email: email,
          password: password,
          password_confirmation: password_confirmation,
        },
      };
      dispatch(Register(data));
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 5, width: "80%", margin: "auto" }}>
      <Typography variant="h6">Sign Up</Typography>

      <Stack
        spacing={2}
        sx={{
          padding: 3,
          border: "1px solid secondary",
          borderRadius: 5,
          margin: "auto",
        }}
      >
        <TextField
          fullWidth
          id="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          {...(errors.email && {
            error: true,
            helperText: errors.email,
          })}
        />
        <TextField
          fullWidth
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          {...(errors.password && {
            error: true,
            helperText: errors.password,
          })}
        />
        <TextField
          fullWidth
          id="password_confirmation"
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={password_confirmation}
          onChange={(e) => setPassword_confirmation(e.target.value)}
          {...(errors.password_confirmation && {
            error: true,
            helperText: errors.password_confirmation,
          })}
        />

        <Button onClick={handleSubmit}>Sign Up</Button>
        <div>
          Already a user? Log in <Link to="/login">Here</Link>!
        </div>
      </Stack>
    </Paper>
  );
};
export default Registration;
