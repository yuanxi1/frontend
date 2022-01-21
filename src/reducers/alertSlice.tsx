import {
    createSlice,
    PayloadAction,
  } from "@reduxjs/toolkit/";

interface alertState {  
    error: string;
  }
  
  const initialState: alertState = {
    error: "",
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
}
});

const { reducer, actions } = loginSlice;

export const { clearErrorAlert, setErrorAlert } = actions;
export default reducer;
