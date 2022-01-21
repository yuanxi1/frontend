import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit/";
import axios from "axios";
import { setErrorAlert } from "./alertSlice";

const API_URL = "http://localhost:8000/api/v1/";
const get_bg_preference = () => {
  const user = localStorage.getItem("user")
  if(user){
  console.log(JSON.parse(user).bg_preference);}
  return user 
  ? JSON.parse(user).bg_preference
  : 1;
}
interface loginState {
  isLoading: boolean;
  loggedIn: boolean;
  bg_preference: number;
}

const initialState: loginState = {
  isLoading: false,
  loggedIn: !!localStorage.getItem("user"),
  bg_preference: get_bg_preference()
};

export const logIn = createAsyncThunk(
  "user/login",
  async (
    data: {
      user: {
        email: string;
        password: string;
      };
    },
    { rejectWithValue, dispatch }
  ) => {
    return axios
      .post(API_URL + "login", data)
      .then((response) => {
        localStorage.setItem('token', JSON.stringify(response.data.JWTToken));
        localStorage.setItem('user', JSON.stringify(response.data.user.data.attributes)); 
        return response.data.user.data.attributes
      })
      .catch((error) => {
        dispatch(setErrorAlert(error.response.data.error))
        return rejectWithValue(error);
      });
  }
);
export const Register = createAsyncThunk(
    "user/register",
    async (
      data: {
        user: {
            email: string,
            password: string,
            password_confirmation: string,
          };
      },
      { rejectWithValue, dispatch }
    ) => {
      return axios
        .post(API_URL + "register", data)
        .then((response) => {
          console.log("response", response);
        })
        .catch((error) => {
        dispatch(setErrorAlert(error.response.data.error))
        return rejectWithValue(error);
        });
    }
  );

const loginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut: (state) => {
      state.isLoading = false;
      state.loggedIn = false;
      
    },
    setBg_Preference: ((state, action: PayloadAction<number>) => {
      state.bg_preference = action.payload
    })
  },
  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state, action) => {
        // state.status = "loading";
        state.isLoading = true;
      })
      .addCase(logIn.fulfilled, (state, action: PayloadAction<{bg_preference: number}>) => {
        // state.status = "succeeded";
        state.isLoading = false;
        state.loggedIn = true;
        state.bg_preference = action.payload.bg_preference
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false;
        state.loggedIn = false;
        // if (typeof action.payload === "string") {
        //   state.error = action.payload;
        // }
      })
      .addCase(Register.fulfilled, (state, action) => {
        // state.status = "succeeded";
      })
      .addCase(Register.rejected, (state, action) => {
        // if (typeof action.payload === "string") {
        //   state.error = action.payload;
        // }
      });
  },
});

const { reducer, actions } = loginSlice;

export const { logOut, setBg_Preference } = actions;
export default reducer;
