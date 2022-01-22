import { useEffect, useState } from "react";
import {
  fetchTasks,
  getSearchFilters,
  getSortedTasks,
} from "../reducers/taskSlice";
import { resetFilters } from "../reducers/searchSlice";
import { useAppSelector, useAppDispatch } from "../app/hooks";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";

import TaskToolBar from "../components/tasks/taskDisplay/TaskToolBar";
import TaskTable from "../components/tasks/taskDisplay/TaskTable";
import SearchTasksField from "../components/tasks/taskForm/SearchTask";
import { fetchAllTags } from "../reducers/tagSlice";

const Home = () => {
  const dispatch = useAppDispatch();
  const [showCompleted, setShowCompleted] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [order, setOrder] = useState("active-completed");

  const filters = useAppSelector(getSearchFilters);
  const tasksToDisplay = useAppSelector(getSortedTasks(order));

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(resetFilters());
    dispatch(fetchAllTags());
  }, [dispatch]);

  const handleSearchClick = () => {
    if (showSearch) {
      dispatch(resetFilters());
    }
    setShowSearch((prev) => !prev);
  };

  return (
    <div>
      <Grid container spacing={1} justifyContent={'right'}>
        <Grid item lg={1} md={1} sm={1} xs={1} >
          <Fab color="primary" aria-label="search" onClick={handleSearchClick} >
            {showSearch ? <CloseIcon /> : <SearchIcon />}
          </Fab>
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <SearchTasksField showSearch={showSearch} />
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TaskToolBar
            order={order}
            setOrder={setOrder}
            setShowCompleted={setShowCompleted}
            tasksNumber={tasksToDisplay.length}
          />
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
    </div>
  );
};
export default Home;
