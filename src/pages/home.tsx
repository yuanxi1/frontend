import { useEffect, useState } from "react";
import {
  fetchTasks,
  getSearchFilters,
  getSortedTasks,
} from "../reducers/taskSlice";
import { resetFilters } from "../reducers/searchSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";

import TaskToolBar from "../components/tasks/TaskToolBar";
import TaskTable from "../components/tasks/TaskTable";
import SearchTasksField from "../components/tasks/SearchTask";
import { fetchAllTags } from "../reducers/tagSlice";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const filters = useAppSelector(getSearchFilters);
  const tasksToDisplay = useAppSelector(getSortedTasks("active-completed"));

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(resetFilters());
    dispatch(fetchAllTags());
  }, []);

  const [showCompleted, setShowCompleted] = useState(true);

  const [showSearch, setShowSearch] = useState(false);
  const handleSearchClick = () => {
    if (showSearch) {
      dispatch(resetFilters());
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
          <SearchTasksField showSearch={showSearch} />
        </Grid>

        <Grid item lg={1} md={1} sm={12} xs={12} sx={{ margin: "auto" }}>
          <Fab color="primary" aria-label="search" onClick={handleSearchClick}>
            {showSearch ? <CloseIcon /> : <SearchIcon />}
          </Fab>
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TaskToolBar setShowCompleted={setShowCompleted}/>
          <Paper
            sx={{
              width: "90%",
              margin: "auto",
              minWidth: "460px",
              minHeight: 100,
              maxHeight: 400,
              overflow: "scroll",
            }}
          >
            <TaskTable
              tasksToDisplay={tasksToDisplay}
              showCompleted={showCompleted}
            />
          </Paper>
        </Grid>
      </Grid>
      {/* </Box> */}
    </div>
  );
};
export default Home;
