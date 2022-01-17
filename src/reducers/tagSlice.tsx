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
    id: number;
    name: string;
  }
  
  interface tagState {
    tags: Tag[];
    status: 'idle' | 'success' | 'failed' | 'loading';
    error: string | undefined;
  }
  
  const initialState: tagState = {
    tags:[],
    status: 'idle',
    error: ""
  };
  
  export const fetchAllTags = createAsyncThunk("tag/fetchAllTags", async () => {
    return axios
      .get(API_URL + "tags", { headers: authHeader() })
      .then((response) => response.data);
  });
  
  export const deleteTag = createAsyncThunk(
    "tag/deleteTag",
    async (tagId: number) => {
      return axios
        .delete(API_URL + `tags/${tagId}`, { headers: authHeader() })
        .then((response) => 
        {console.log(response.data)
            return response.data});
    }
  );
  export const addTag = createAsyncThunk(
    "tag/addTag",
    async (data: {tag:{name: string}}) => {
      return axios
        .post(API_URL + 'tags/', data, { headers: authHeader() })
        .then((response) => response.data);
    }
  );
  
  const tagSlice = createSlice({
    name: "tag",
    initialState,
    reducers: {
      tagUpdated(state, action) {
        const { id, name } = action.payload.data.attributes;
        const existingTag = state.tags.find((tag) => tag.id === id);
  
        if (existingTag) {
          existingTag.name = name;
        }
      },
    },
    extraReducers(builder) {
      builder
        .addCase(fetchAllTags.fulfilled, (state, action) => {
            state.status = 'success';
          state.tags = action.payload.data.map(
            (task: { attributes: any }) => task.attributes
          );
        })
        .addCase(fetchAllTags.rejected, (state, action) => {
            state.status ='failed'
          state.error = action.error.message;
        })
        .addCase(addTag.fulfilled, (state, action) => {
            state.tags.push(action.payload.data.attributes);
        })
        .addCase(deleteTag.fulfilled, (state, action) => {
            const idToDelete = parseInt(action.payload.id) 
          state.tags = state.tags.filter(
            (tag) => tag.id !== idToDelete
          );
        });
    },
  });
  
  const { reducer, actions } = tagSlice;
  
  export const { tagUpdated } = actions;
  export default reducer;
  
  ///////////////============= Useful Selectors =============////////////////
  
  export const selectAllTags = (state: RootState) => state.tag.tags;
  
  export const getSearchFilters = (state: RootState) => state.search;
  
 