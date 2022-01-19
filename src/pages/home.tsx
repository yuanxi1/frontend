import { useEffect, useState } from "react";
import {
  fetchTasks,
  getSearchFilters,
  getSortedTasks,
  selectAllTasks,
} from "../reducers/taskSlice";
import { resetFilters } from "../reducers/searchSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import FilterAltTwoToneIcon from "@mui/icons-material/FilterAltTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Fab from '@mui/material/Fab';

import TaskList from "../components/tasks/TaskDisplay";
import SearchTasksField from "../components/tasks/SearchTask";
import { fetchAllTags } from "../reducers/tagSlice";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const filters = useAppSelector(getSearchFilters);

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(resetFilters())
    dispatch(fetchAllTags());
  }, []);
  
  const [showSearch, setShowSearch] = useState(false);
  const handleSearchClick = () => {
    if(showSearch) {
      dispatch(resetFilters())
    }
    setShowSearch((prev) => !prev);
  };

  return (
    <div>
      <Button variant="contained" onClick={() => navigate("/add_task")}>
        Add a new task
      </Button>

      {/* <Box sx={{  padding: 5, bgcolor: "#F5F5F5" }}> */}
        <Grid container spacing={3}>
          
          <Grid item lg={11} md={11} sm={12} xs={12}>
            <SearchTasksField showSearch={showSearch}/>
            
          </Grid>
          
          <Grid item lg={1} md={1} sm={12} xs={12} sx={{ margin: 'auto' }}>
            <Fab color="primary" aria-label="search" onClick={handleSearchClick}>
              {showSearch ?  <CloseIcon /> : <SearchIcon />}
            </Fab>
          </Grid>
          

          <Grid item lg={12} md={12} sm={12} xs={12}>
              <TaskList />
          </Grid>

        </Grid>
      {/* </Box> */}
    </div>
  );
};
export default Home;
