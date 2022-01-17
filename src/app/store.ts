import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../reducers/loginSlice';
import taskReducer from '../reducers/taskSlice';
import searchReducer from '../reducers/searchSlice';
import tagReducer from '../reducers/tagSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        task: taskReducer,
        search: searchReducer,
        tag: tagReducer
    }
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;