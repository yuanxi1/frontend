import {
    createSlice,
    PayloadAction,
  } from "@reduxjs/toolkit/";

interface alertState {  
    error: string;
    success: string;
  }
  
  const initialState: alertState = {
    error: "",
    success: "",
  };

const loginSlice = createSlice({
name: "alert",
initialState,
reducers: {    
    clearErrorAlert: (state) => {
        state.error = "";
    },
    setErrorAlert: (state, action: PayloadAction<string>) => {
        state.error = action.payload
    },
    clearSuccessAlert: (state) => {
      state.success = "";
    },
    setSuccessAlert: (state, action: PayloadAction<string>) => {
        state.success = action.payload
    },
}
});

const { reducer, actions } = loginSlice;

export const { clearErrorAlert, setErrorAlert, clearSuccessAlert, setSuccessAlert } = actions;
export default reducer;
