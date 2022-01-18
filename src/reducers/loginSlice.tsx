import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit/";
import axios from "axios";
const API_URL = "http://localhost:8000/api/v1/";
interface loginState {
  isLoading: Boolean;
  loggedIn: Boolean;
  error: string;
}

const initialState: loginState = {
  isLoading: false,
  loggedIn: !!localStorage.getItem("user"),
  error: "",
};

export const logIn = createAsyncThunk(
  "login/login",
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
        console.log("response", response);
        localStorage.setItem('user', JSON.stringify(response.data)); 
      })
      .catch((error) => {
        return rejectWithValue(error.response.data.error);
      });
  }
);
export const Register = createAsyncThunk(
    "login/register",
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
  name: "login",
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
    }
  },
  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state, action) => {
        // state.status = "loading";
        state.isLoading = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        // state.status = "succeeded";
        state.isLoading = false;
        state.loggedIn = true;
        state.error = "";
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

export const { logOut, clearLoginError, setError } = actions;
export default reducer;
