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


const API_URL = "http://localhost:8000/api/v1/";

export interface Tag {
  id: string;
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
  error: string ;
  success: "" | "added" | "deleted" | "updated";
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
  error: "",         //stores any error message to display
  success: ""        // stores any success message to display
};

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
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        if(error.response.status === 401){
          dispatch(logOut())
        }
        return rejectWithValue(error.response.data.error);
      });
  }
);
export const addTask = createAsyncThunk(
  "task/addTask",
  async (data: addTaskFormData, { rejectWithValue, dispatch }) => {
    return axios
      .post(API_URL + `tasks/`, data, { headers: authHeader() })
      .then((response) => response.data)
      .catch((error) => {
        if(error.response.status === 401){
          dispatch(logOut())
        }
        return rejectWithValue(error.response.data.error);
      });
  }
);
export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId: Number, { rejectWithValue, dispatch }: any) => {
    return axios
      .delete(API_URL + `tasks/${taskId}`, { headers: authHeader() })
      .then((response) => response.data)
      .catch((error) => {
        if(error.response.status === 401){
          dispatch(logOut())
        }
        return rejectWithValue(error.response.data.error);
      });
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (data: {task:{taskId: string|number}}, { rejectWithValue }) => {
    return axios
      .patch(API_URL + `tasks/${data.task.taskId}`, data, { headers: authHeader() })
      .then((response) => response.data)
      .catch((error) => {
        return rejectWithValue(error.response.data.error);
      });
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    taskAdded(state, action) {
      state.success = 'added'
    },
    // taskUpdated(state, action) {
      // const { id, title, description, tag_list, completed } = action.payload.data.attributes;
      // const existingTask = state.tasks.find((task) => task.id === id);

      // if (existingTask) {
      //   existingTask.title = title;
      //   existingTask.description = description;
      //   existingTask.tag_list = tag_list;
      //   existingTask.completed = completed;

      // }
    // },
    clearTaskSuccessMessage(state) {
      state.success = ''
    },
    clearTaskErrorMessage(state) {
      state.error=''
    }
  },
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
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<{
        id: string;}>) => {
        state.success = 'deleted'
        const id = parseInt(action.payload.id)
        state.tasks = state.tasks.filter(
          (task) => task.id !== id
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })
      .addCase(addTask.fulfilled, (state) => {
        state.success ='added'
      })
      .addCase(addTask.rejected, (state, action) => {
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.success ='updated'
        const { id, title, description, tag_list, completed } = action.payload.data.attributes;
        const existingTask = state.tasks.find((task) => task.id === id);
  
        if (existingTask) {
          existingTask.title = title;
          existingTask.description = description;
          existingTask.tag_list = tag_list;
          existingTask.completed = completed;
  
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        if (typeof action.payload === "string") {
          state.error = action.payload;
        }
      });
  },
});

const { reducer, actions } = taskSlice;

export const { taskAdded, clearTaskSuccessMessage, clearTaskErrorMessage } = actions;
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

