import  TextField  from "@mui/material/TextField";

const InputField = () => {

    return (
        <TextField 
          fullWidth
          id="outlined-basic"
          label="Old Password"
          type="password"
          variant="outlined"
        //   value={oldPassword}
        //   onChange={(e) => setOldPassword(e.target.value)}
        //   {...(errors.oldPassword && {
        //     error: true,
        //     helperText: errors.oldPassword,
        //   })}
          />

        
    )
}