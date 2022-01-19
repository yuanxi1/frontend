import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  updateDueFromFilter,
  updateDueToFilter,
  clearFilters,
} from "../../reducers/searchSlice";
import { getSortedTasks } from "../../reducers/taskSlice";
import TaskTable from "./TaskTable";

import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import { Paper } from "@mui/material";

import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import { Typography } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import TextField from "@mui/material/TextField";
import { format, addDays } from "date-fns";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { alpha } from "@mui/material/styles";
import { Table, TableCell, TableHead, TableRow } from "@mui/material";
import useTable from "../useTable";

const headCells = [
  { id: "title", label: "Title" },
  { id: "tags", label: "Tags" },
  { id: "due", label: "Date" },
  { id: "actions", label: "Actions" },
];
const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();

  const [showCompleted, setShowCompleted] = useState(true);

  const tasksToDisplay = useAppSelector(getSortedTasks("active-completed"));

  const handleToggle = () => {
    setShowCompleted((prev) => !prev);
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const today = new Date();
  const next7Days = addDays(today, 20);
  const formatedToday = format(today, "yyyy-MM-dd");
  const formatedNext7Days = format(next7Days, "yyyy-MM-dd");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openDatePicker = Boolean(anchorEl);

  const [anchorElMenu, setAnchorElMenu] = useState<HTMLButtonElement | null>(
    null
  );
  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };
  const openMenu = Boolean(anchorElMenu);
  const { TblContainer, TblHead } = useTable(headCells);

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          bgcolor: "#EDE7F6",
          minWidth: "460px",
          width: "90%",
          margin: "auto",
        }}
      >
        <Typography sx={{ flex: "1 1 100%" }} variant="h6">
          You have {tasksToDisplay.length} task(s).{" "}
        </Typography>
        <Tooltip title="Change date">
          <IconButton onClick={handleClick}>
            <TodayIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Show Completed">
          <Switch defaultChecked onClick={handleToggle} color="secondary" />
        </Tooltip>

        <Tooltip title="More options">
          <IconButton
            aria-label="More options"
            id="long-button"
            // aria-controls={open ? 'long-menu' : undefined}
            // aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClickMenu}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="basic-menu"
          anchorEl={anchorElMenu}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              dispatch(updateDueFromFilter(formatedToday));
              dispatch(updateDueToFilter(formatedToday));
            }}
          >
            Today
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch(updateDueFromFilter(formatedToday));
              dispatch(updateDueToFilter(formatedNext7Days));
            }}
          >
            Next 7 Days
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch(clearFilters());
            }}
          >
            All Tasks
          </MenuItem>
        </Menu>

        <Popover
          open={openDatePicker}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={today}
            onChange={(newValue) => {
              const date = newValue ? format(newValue, "yyyy-MM-dd") : "";
              dispatch(updateDueFromFilter(date));
              dispatch(updateDueToFilter(date));
              console.log(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Popover>
      </Toolbar>

      <Paper
        sx={{
          width: "90%",
          margin: "auto",
          minWidth: "460px",
          minHeight: 200,
          maxHeight: 400,
          overflow: "scroll",
        }}
      >
        <TaskTable
          tasksToDisplay={tasksToDisplay}
          showCompleted={showCompleted}
        />
      </Paper>
    </>
  );
};

export default TaskList;
