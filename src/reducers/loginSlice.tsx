import { createSlice } from "@reduxjs/toolkit/";

interface loginState {
    isLoading: Boolean,
    loggedIn: Boolean,
    error: string
}

const initialState: loginState = {
    isLoading: false,
    loggedIn: !!localStorage.getItem('user'),
    error:''
}
const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers:{
        loginPending: (state) => {
            state.isLoading = true
        },

        loginSuccess:(state) => {
            state.isLoading = false
            state.loggedIn = true
            state.error=''
        },

        loginFail: (state, action) => { 
            state.isLoading = false 
            state.loggedIn = false
            state.error= action.payload
        },
        logOut: (state) => {
            state.isLoading = false
            state.loggedIn = false
            state.error=''
        }
    }

})

const {reducer, actions} = loginSlice;

export const{loginPending,  loginSuccess, loginFail, logOut} = actions;
export default reducer;