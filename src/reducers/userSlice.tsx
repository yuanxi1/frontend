import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit/";
import axios from "axios";
import authHeader from "../api/auth-header";
import { setErrorAlert, setSuccessAlert } from "./alertSlice";
import { API_URL } from "../api/api_url";

/* Since the state returns to initial state on refresh, some user information
like background preference are stored in localStorage.  */
const get_bg_preference = () => {
  const user = localStorage.getItem("user")
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
///////////////============= Thunks =============////////////////
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
          if (response.status === 201) {
            dispatch(setSuccessAlert('Registed'))
          }
        })
        .catch((error) => {
        dispatch(setErrorAlert(error.response.data.error))
        return rejectWithValue(error);
        });
    }
  );
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (data: {user:{ userId: string|number }}, { rejectWithValue, dispatch }) => {
    return axios
      .patch(API_URL + `resetpw/${data.user.userId}`, data, { headers: authHeader() })
      .then((response) => {
        if(response.status === 204){
          dispatch(setSuccessAlert('Password updated'))
          localStorage.clear();
          dispatch(logOut());
        }})
      .catch((error) => {
        if(error.response.status === 401){
          dispatch(logOut())
        }
        dispatch(setErrorAlert(error.response.data.error))
        return rejectWithValue(error);
      });
  }
);
export const updatePreference = createAsyncThunk(
  "user/updatePreference",
  async (data: {user:{ userId: string|number }}, { rejectWithValue, dispatch }) => {
    return axios
      .patch(API_URL + `preference/${data.user.userId}`, data, { headers: authHeader() })
      .then((response) => {
          const res = response.data.data.attributes
          dispatch(setBg_Preference(res.bg_preference));
          localStorage.setItem('user', JSON.stringify(res))
        })
      .catch((error) => {
        if(error.response.status === 401){
          dispatch(logOut())
        }
        dispatch(setErrorAlert(error.response.data.error))
        return rejectWithValue(error);
      });
  }
);
///////////////============= Reducers =============////////////////
const loginSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut: (state) => {
      state.isLoading = false;
      state.loggedIn = false;
      
    },
    setBg_Preference: ((state, action: PayloadAction<number>) => {
      console.log('setting preference')
      console.log(action.payload)
      state.bg_preference = action.payload
    })
  },
  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logIn.fulfilled, (state, action: PayloadAction<{bg_preference: number}>) => {
        state.isLoading = false;
        state.loggedIn = true;
        state.bg_preference = action.payload.bg_preference
      })
      .addCase(logIn.rejected, (state) => {
        state.isLoading = false;
        state.loggedIn = false;
      })
  },
});

const { reducer, actions } = loginSlice;

export const { logOut, setBg_Preference } = actions;
export default reducer;
