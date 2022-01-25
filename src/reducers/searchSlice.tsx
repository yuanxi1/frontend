/*
The search state stores the current filters that the users choose, these
include inputs in the search fields or what users pick in the datepicker.
New get requests will be sent when filters are updated. The content of the 
task table depends on the search state 
*/
import { createSlice } from "@reduxjs/toolkit/";
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

