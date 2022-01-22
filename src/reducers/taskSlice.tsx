import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit/";
import axios from "axios";
import authHeader from "../api/auth-header";
import { RootState } from "../app/store";
import { logOut } from "./userSlice";
import { SearchFilter } from "./searchSlice";
import format from 'date-fns/format'
import { setErrorAlert, setSuccessAlert } from "./alertSlice";

const API_URL = "http://localhost:8000/api/v1/";

export interface Tag {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  tag_list: Tag[];
  completed: boolean;
  duedate: string;
}
interface taskState {
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
}
interface addTaskFormData {
  task: {
    title: string,
    description?: string,
    completed: boolean,
    duedate: string,
    tag_list: string[]
}
}


const initialState: taskState = {
  tasks: [],         //stores all the tasks to display
  status: "idle",    //shows the fetch task status
};
///////////////============= Thunks =============////////////////
export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (filters: SearchFilter, { rejectWithValue, dispatch }) => {  
    const show_overdue = format(new Date(), 'yyyy-MM-dd') === filters.due_from  && filters.due_from === filters.due_to
    return axios
      .get(
        API_URL +
          `search?&tag_name=${filters.tag}&title=${filters.title}&date_from=${filters.due_from}&date_to=${filters.due_to}&show_overdue=${show_overdue}`,
        { headers: authHeader() }
      )
      .then((response) => {
        return response.data;
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
export const addTask = createAsyncThunk(
  "task/addTask",
  async (data: addTaskFormData, { rejectWithValue, dispatch }) => {
    return axios
      .post(API_URL + `tasks/`, data, { headers: authHeader() })
      .then((response) => {
        dispatch(setSuccessAlert('Task added'))
        return response.data})
      .catch((error) => {
        if(error.response.status === 401){
          dispatch(logOut())
        }
        dispatch(setErrorAlert(error.response.data.error))
        return rejectWithValue(error);
      });
  }
);
export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId: Number, { rejectWithValue, dispatch }: any) => {
    return axios
      .delete(API_URL + `tasks/${taskId}`, { headers: authHeader() })
      .then((response) => {
        dispatch(setSuccessAlert('Task deleted'))
        return response.data})
      .catch((error) => {
        if(error.response.status === 401){
          dispatch(logOut())
        }
        dispatch(setErrorAlert(error.response.data.error))
        return rejectWithValue(error);
      });
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (data: {task:{taskId: string|number}}, { rejectWithValue, dispatch }) => {
    return axios
      .patch(API_URL + `tasks/${data.task.taskId}`, data, { headers: authHeader() })
      .then((response) => {
        dispatch(setSuccessAlert('Task updated'))
        return response.data})
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
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload.data.map(
          (task: { attributes: any }) => task.attributes
        );
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<{
        id: string;}>) => {
        
        const id = parseInt(action.payload.id)
        state.tasks = state.tasks.filter(
          (task) => task.id !== id
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
      })
      .addCase(addTask.fulfilled, (state) => {
 
      })
      .addCase(addTask.rejected, (state, action) => {
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id, title, description, tag_list, duedate, completed } = action.payload.data.attributes;
        const existingTask = state.tasks.find((task) => task.id === id);
        if (existingTask) {
          existingTask.title = title;
          existingTask.description = description;
          existingTask.tag_list = tag_list;
          existingTask.duedate = duedate;
          existingTask.completed = completed;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {

      });
  },
});

const { reducer, actions } = taskSlice;

// export const { taskAdded, clearTaskSuccessMessage } = actions;
export default reducer;

///////////////============= Useful Selectors =============////////////////

export const selectAllTasks = (state: RootState) => state.task.tasks;
export const selectTaskById = (state: RootState, taskId: number) =>
  state.task.tasks.find((task) => task.id === taskId);
export const getSearchFilters = (state: RootState) => state.search;

export const getSortedTasks = (filter: string) =>
  createSelector(selectAllTasks, (tasks) => {
    if (filter === "a-z") {
      return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    } else if (filter === "z-a") {
      return [...tasks].sort((a, b) => b.title.localeCompare(a.title));
    } else if (filter === "active-completed") {
      return [...tasks].sort(
        (a, b) => Number(a.completed) - Number(b.completed)
      );
    } else if (filter === "new-old") {
      return [...tasks].sort(
        (a, b) =>
          Date.parse(b.duedate) -
          Date.parse(a.duedate)
      );
    } else {
      return tasks;
    }
  });
  
export const getCompletedTasks = createSelector(
  selectAllTasks,
  (tasks) => {
    return tasks.filter(
      (task) => task.completed
    );
  }
);
export const getActiveTasks = createSelector(
  selectAllTasks,
  (tasks) => {
    return tasks.filter(
      (task) => !task.completed
    );
  }
);

