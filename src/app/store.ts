import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userSlice';
import taskReducer from '../reducers/taskSlice';
import searchReducer from '../reducers/searchSlice';
import tagReducer from '../reducers/tagSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        task: taskReducer,
        search: searchReducer,
        tag: tagReducer
    }
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;