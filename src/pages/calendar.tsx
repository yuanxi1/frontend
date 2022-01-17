import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { updateDueToFilter, updateDueFromFilter } from "../reducers/searchSlice";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import {startOfMonth, endOfMonth, startOfWeek, endOfWeek} from 'date-fns'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import parse from 'date-fns/parse'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { styled } from '@mui/material/styles';
import {
    fetchTasks,
    getSearchFilters,
    selectAllTasks,
    Task,
  } from "../reducers/taskSlice";
import { withStyles } from "@mui/material";
  const styledCalendar = styled(Calendar)({
    marginTop: '7%',
//         marginLeft: '15%',
//         height: '80vh',
//         width: '80%',
//         backgroundColor: 'rgba(255, 255, 255, 0.6)',

  })
  // , {
    
//         marginTop: '7%',
//         marginLeft: '15%',
//         height: '80vh',
//         width: '80%',
//         backgroundColor: 'rgba(255, 255, 255, 0.6)',


  
// });
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
  useEffect(() => {
    const start = format(startOfWeek(startOfMonth(today)), 'yyyy-MM-dd')
    const end = format(endOfWeek(endOfMonth(today)), 'yyyy-MM-dd')
    dispatch(updateDueFromFilter(start))
    dispatch(updateDueToFilter(end))
  }, [])

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [filters]);

  const styleEvent= (event: Task) => {
    return event.completed
    ? {style: {backgroundColor: '#00C853'}} //green
    : parseISO(event.duedate) < today
    ? {style:{backgroundColor: '#F44336'}} //orange
    : {style:{backgroundColor: '#FFC107'}} //yellow

  }
    const myEventsList = useAppSelector(selectAllTasks)
    return (<div>
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
        style={{ height: 600, margin:'5%', backgroundColor: '#F5F5F5' }}
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
        eventPropGetter={event => styleEvent(event)}
      />
    </div>)
 }

export default CalendarPage;