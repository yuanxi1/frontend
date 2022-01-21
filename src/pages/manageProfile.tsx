import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import authHeader from "../api/auth-header";
import axios from "axios";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { logOut } from "../reducers/userSlice";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const validate = () => {
    let temp = { oldPassword: "", newPassword: "", confirmPassword: "" };
    temp.oldPassword = oldPassword ? "" : "This field is required.";
    temp.newPassword =
      newPassword.length > 5 ? "" : "Must not be less than 6 characters.";
    temp.confirmPassword =
      confirmPassword === newPassword ? "" : "Must match New Password.";
    setErrors(temp);

    return Object.values(temp).every((x) => x === "");
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).user.data.id : "";
    if (validate()) {
    axios
      .patch(
        `http://localhost:8000/api/v1/resetpw/${userId}`,
        {
          user: {
            old_password: oldPassword,
            password: newPassword,
            password_confirmation: confirmPassword,
          },
        },
        { headers: authHeader() }
      )
      .then((response) => {
        localStorage.clear();
        dispatch(logOut());
      });
    }
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 5, width: "80%", margin: "auto" }}>
      <Typography>Manage Your Account</Typography>

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
          label="Old Password"
          type="password"
          variant="outlined"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          {...(errors.oldPassword && {
            error: true,
            helperText: errors.oldPassword,
          })}
        />
        <TextField
          fullWidth
          id="outlined-basic"
          label="New Password"
          type="password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          {...(errors.newPassword && {
            error: true,
            helperText: errors.newPassword,
          })}
        />
        <TextField
          fullWidth
          id="outlined-basic"
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          {...(errors.confirmPassword && {
            error: true,
            helperText: errors.confirmPassword,
          })}
        />
        <Button onClick={onSubmit}>Reset Password</Button>
      </Stack>
    </Paper>
  );
};
export default ProfilePage;