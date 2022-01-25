import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  updateDueFromFilter,
  updateDueToFilter,
  clearFilters,
} from "../../../reducers/searchSlice";
import { getSearchFilters } from "../../../reducers/taskSlice";

import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import { Typography } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import TextField from "@mui/material/TextField";
import { format, addDays, parseISO } from "date-fns";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import SortIcon from '@mui/icons-material/Sort';
/* 
this component is the tool bar at top of the task table, where users can set 
simple filters and sorting orders
*/
const TaskToolBar: React.FC<{
  order: string
  setOrder: React.Dispatch<React.SetStateAction<string>>
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  tasksNumber: number;
}> = ({ order, setOrder, setShowCompleted, tasksNumber }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(getSearchFilters);
  
  //Show completed tasks or not
  const handleToggle = () => {
    setShowCompleted((prev) => !prev);
  };
  //Date picker
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const today = new Date();
  const next7Days = addDays(today, 20);
  const formatedToday = format(today, "yyyy-MM-dd");
  const formatedNext7Days = format(next7Days, "yyyy-MM-dd");

  const handleChangeDate = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openDatePicker = Boolean(anchorEl);
  //Menu
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

  //sort
  const handleSortAlph = () => {
    order === 'a-z'? setOrder('z-a') : setOrder('a-z')
  }
  const handleSortDate = () => {
    order === 'new-old'? setOrder('') : setOrder('new-old')
  }
  const message = `You have ${tasksNumber} task` 
  + ((tasksNumber > 1) ? 's' : '')
  + (filters.due_to && filters.due_to === filters.due_from 
      ?`  [${format(parseISO(filters.due_to), 'EEEE | MMM d')}]`
      : ''
    )
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: "secondary.light",
        minWidth: "460px",
        width: "90%",
        margin: "auto",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
      }}
    >
      <Typography sx={{ flex: "1 1 100%" }} variant="h6">
       {message}
      </Typography>

      <Tooltip title="Sort Alphabetically">
        <IconButton
          id="sort-alph"
          onClick={handleSortAlph}
        >
          <SortByAlphaIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Sort by due date">
        <IconButton
          id="sort-date"
          onClick={handleSortDate}
        >
          <SortIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Change date">
        <IconButton onClick={handleChangeDate}>
          <TodayIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Show Completed">
        <Switch defaultChecked onClick={handleToggle} color="secondary" />
      </Tooltip>

      <Tooltip title="More options">
        <IconButton
          id="long-button"
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
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Popover>
    </Toolbar>
  );
};

export default TaskToolBar;
