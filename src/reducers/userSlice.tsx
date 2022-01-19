import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit/";
import axios from "axios";
const API_URL = "http://localhost:8000/api/v1/";
interface loginState {
  isLoading: boolean;
  loggedIn: boolean;
  error: string;
  bg_preference: number;
}

const initialState: loginState = {
  isLoading: false,
  loggedIn: !!localStorage.getItem("user"),
  error: "",
  bg_preference:1
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
    { rejectWithValue }
  ) => {
    return axios
      .post(API_URL + "login", data)
      .then((response) => {
        // console.log("response", response);
        localStorage.setItem('user', JSON.stringify(response.data)); 
        return response.data.user.data.attributes
      })
      .catch((error) => {
        return rejectWithValue(error.response.data.error);
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
      { rejectWithValue }
    ) => {
      return axios
        .post(API_URL + "register", data)
        .then((response) => {
          console.log("response", response);
        })
        .catch((error) => {
          
          return rejectWithValue(error.response.data.error);
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
      state.error = "";
    },
    clearLoginError: (state) => {
        state.error = "";
    },
    setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload
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
        state.error = "";
        state.bg_preference = action.payload.bg_preference
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false;
        state.loggedIn = false;
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })
      .addCase(Register.fulfilled, (state, action) => {
        // state.status = "succeeded";
        state.error = "";
      })
      .addCase(Register.rejected, (state, action) => {
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      });
  },
});

const { reducer, actions } = loginSlice;

export const { logOut, clearLoginError, setError, setBg_Preference } = actions;
export default reducer;
