import {
    createSlice,
    PayloadAction,
    createAsyncThunk,
    createSelector,
  } from "@reduxjs/toolkit/";
import { RootState } from "../app/store";
import format from 'date-fns/format'

const today = format(new Date(), 'yyyy-MM-dd')

export interface SearchFilter {
    title: string;
    tag: string;
    due_from: string;
    due_to: string;
  }
  const initialState: SearchFilter = {
     title: '', 
     tag: '', 
     due_from: today, 
     due_to: today,
  };
  
  const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
      resetFilters(state) {
        state.title = initialState.title;
        state.tag = initialState.tag;
        state.due_from = initialState.due_from;
        state.due_to = initialState.due_to;
      },
      clearFilters(state) {
        state.title = '';
        state.tag = '';
        state.due_from = '';
        state.due_to = '';
      },
      updateTitleFilter(state, action) {
        state.title = action.payload;
      },
      updateTagFilter(state, action) {
        state.tag = action.payload;
      },
      updateDueFromFilter(state, action) {
        state.due_from = action.payload;
      },
      updateDueToFilter(state, action) {
        state.due_to = action.payload;
      },
    }
       
  });
  
  const { reducer, actions } = searchSlice;
  
  export const { resetFilters, clearFilters, updateTitleFilter, updateTagFilter, updateDueFromFilter, updateDueToFilter } = actions;
  export default reducer;
  
  ///////////////============= Useful Selectors =============////////////////
  
  export const selectAllTasks = (state: RootState) => state.task.tasks;
