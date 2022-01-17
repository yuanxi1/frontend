import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit/";
import axios from "axios";
import authHeader from "../api/auth-header";
import { RootState } from "../app/store";
import { SearchFilter } from "./searchSlice";

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
  created_at: string;
}
interface taskState {
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | undefined;
}

const initialState: taskState = {
  tasks: [],
  status: "idle",
  error: "",
};

export const fetchAllTasks = createAsyncThunk("task/fetchAllTasks", async () => {
  return axios
    .get(API_URL + "tasks", { headers: authHeader() })
    .then((response) => response.data);
});

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (filters: SearchFilter) => {
    // const tag_arr = filters.tags.reduce((prev, curr) => `&tag_name[]=${curr}` + prev, '') 
    
    return axios
      .get(
        API_URL +
          `search?&tag_name=${filters.tag}&title=${filters.title}&date_from=${filters.due_from}&date_to=${filters.due_to}`,
        { headers: authHeader() }
      )
      .then((response) => {
        console.log(response.data);
        return response.data;
      });
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId: Number) => {
    return axios
      .delete(API_URL + `tasks/${taskId}`, { headers: authHeader() })
      .then((response) => response.data);
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    taskAdded(state, action) {
      //TODO: this is not right
      state.tasks.push(action.payload.data.attributes);
    },
    taskUpdated(state, action) {
      const { id, title, description, tag_list, completed } = action.payload.data.attributes;
      const existingTask = state.tasks.find((task) => task.id === id);

      if (existingTask) {
        existingTask.title = title;
        existingTask.description = description;
        existingTask.tag_list = tag_list;
        existingTask.completed = completed;

      }
    },
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
        state.error = action.error.message;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload.id
        );
      });
  },
});

const { reducer, actions } = taskSlice;

export const { taskAdded, taskUpdated } = actions;
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
    } else if (filter === "new-old") {
      return [...tasks].sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
      );
    } else if (filter === "active-completed") {
      return [...tasks].sort(
        (a, b) => Number(a.completed) - Number(b.completed)
      );
    } else {
      return tasks;
    }
  });

export const getFilteredTasks = createSelector(
  [selectAllTasks, getSearchFilters],
  (tasks, filters) => {
    return tasks.filter(
      (task) =>
        (!filters.title || task.title === filters.title) &&
        //( filters.tags.length === 0 || filters.tags.every( input_tag => task.tag_list.some(tag => input_tag === tag.name))) &&
        (!filters.due_from || task.duedate === filters.due_from) &&
        (!filters.due_to || task.duedate === filters.due_to)
    );
  }
);
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

