import Alert, { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit/dist/createAction";
import { useAppDispatch } from "../app/hooks";

const AlertBar: React.FC<{
  message: string;
  severity: AlertColor;
  clearMessage: ActionCreatorWithoutPayload<string>;
}> = ({ message, severity, clearMessage }) => {
  const dispatch = useAppDispatch();
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={!!message}
      onClose={() => dispatch(clearMessage())}
      autoHideDuration={3000}
      key="top-center"
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
};

export default AlertBar;
