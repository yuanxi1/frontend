import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { updateDueToFilter, updateDueFromFilter } from "../reducers/searchSlice";
import {
  fetchTasks,
  getSearchFilters,
  selectAllTasks
} from "../reducers/taskSlice";
import TaskItem from "../components/tasks/taskDisplay/TaskItem";
import { Task } from "../types/interface";

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import {startOfMonth, endOfMonth, startOfWeek, endOfWeek} from 'date-fns'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import parse from 'date-fns/parse'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Backdrop from "@mui/material/Backdrop";
import { alpha } from "@mui/material";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import {subDays} from "date-fns"

const locales = {
    'en-US': enUS,
  }
  
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  })
  
const CalendarPage = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(getSearchFilters);
  const today = new Date();
  const yesterday = subDays(today, 1);
  const start = format(startOfWeek(startOfMonth(today)), 'yyyy-MM-dd')
  const end = format(endOfWeek(endOfMonth(today)), 'yyyy-MM-dd')
  const [open, setOpen] = useState(false);
  const [taskToDisplay, setTaskToDisplay] = useState<Task | null>(null);
  useEffect(() => {
    dispatch(updateDueFromFilter(start))
    dispatch(updateDueToFilter(end))
  }, [dispatch, start, end])

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);


  const handleCloseBackdrop = () => {
    setOpen(false);
  };
  const style = [
    {color: '#00C853',
     status: 'Completed'},
    {color: '#F44336',
    status: 'overdue'},
    {color: '#FFC107',
    status: 'active'}
  ]
 

  const styleEvent= (event: Task) => {
    return event.completed
    ? {style: {backgroundColor: style[0].color}} //green
    : parseISO(event.duedate) <= yesterday
    ? {style:{backgroundColor: style[1].color}}//orange
    : {style:{backgroundColor: style[2].color}} //yellow

  }
    const myEventsList = useAppSelector(selectAllTasks)
    return (<div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleCloseBackdrop}
      >
        {open && taskToDisplay && <TaskItem task={taskToDisplay} />}
      </Backdrop>
    
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="duedate"
        endAccessor="duedate"
        views={{
            month: true,
          }}
        toolbar={true}
        popup={true}
        popupOffset={0}
        style={{ height:600, margin:'1%', backgroundColor: alpha('#FFFFFF', 0.8), borderRadius:5 }}
        onRangeChange={(range , _view) => {
          if('start' in range && 'end' in range) {
            if(range.start instanceof Date && range.end instanceof Date){
              const start = format(range.start, "yyyy-MM-dd");
              const end = format(range.end, 'yyyy-MM-dd')
              dispatch(updateDueFromFilter(start))
              dispatch(updateDueToFilter(end))
            }
          }
        }}
        onSelectEvent={event => {setTaskToDisplay(event); setOpen(true)}}
        eventPropGetter={event => styleEvent(event)}
      />
      <Stack direction='row' spacing={2}>
        {style.map( ({color, status}) => 
          <Chip sx ={{ bgcolor: color }} label= {status}/>)}
      </Stack>
    </div>)
 }

export default CalendarPage;