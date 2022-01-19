import Login from "./components/login/login";
import Home from "./pages/home";
import CalendarPage from './pages/calendar'
import Registration from "./components/login/registration";
import ProtectedRoute from "./protected_route"
import EditTaskForm from "./components/tasks/UpdateTask";
import AddTaskForm from "./components/tasks/AddTask";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './app/hooks';
import { logOut } from './reducers/userSlice';
import  { NavBar } from './components/navBar';
import { loginDataType } from "./components/login/login";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { styled, useTheme } from "@mui/material";
import { useState } from "react";
import ManageTags from "./pages/manageTags";
import ProfilePage from "./pages/manageProfile";
import Settings from "./pages/settings";

const drawerWidth = 240;

const Main = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  margin: theme.spacing(1),
  borderRadius: 10,
  ...theme.mixins.toolbar,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: theme.spacing(1),
}))
const NavBarHeader = styled('div')(({theme}) => ({
  ...theme.mixins.toolbar,
  
}))
function App() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const bg_preference = useAppSelector(state=> state.user.bg_preference)

  const handleLogin= (data: loginDataType) => {
    localStorage.setItem('user', JSON.stringify(data)); 

  };
  const handleLogout= () => {
    localStorage.removeItem('user');
    dispatch(logOut());    
  };

  return (
    <div
    style={{
      backgroundImage: `url('${process.env.PUBLIC_URL}/${bg_preference}.jpg')`,
      backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      
    }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
        <NavBar open={open} setOpen={setOpen} handleLogout={handleLogout}/>
        <NavBarHeader />
        
        <Main >
          <Routes>
      
            <Route 
              path={"/login"}  
              element={<Login handleLogin = {handleLogin} />} 
            />
            
            <Route
              path={"/register"}
              element={<Registration handleLogin = {handleLogin} />}
            />
            
            <Route path='/home' element={<ProtectedRoute />}>
              <Route path='/home' element={<Home />} />
            </Route>
            <Route path='/add_task' element={<ProtectedRoute />}>
              <Route path='/add_task' element={<AddTaskForm />} />
            </Route>
            <Route path='/edit_task' element={<ProtectedRoute />}>
              <Route path='/edit_task/:taskId' element={<EditTaskForm />} />
            </Route>
            <Route path='/tags' element={<ProtectedRoute />}>
              <Route path='/tags' element={<ManageTags />} />
            </Route>
            <Route path='/calendar' element={<ProtectedRoute />}>
              <Route path='/calendar' element={<CalendarPage />} />
            </Route>
            <Route path='/profile' element={<ProtectedRoute />}>
              <Route path='/profile' element={<ProfilePage />} />
            </Route>
            <Route path='/settings' element={<ProtectedRoute />}>
              <Route path='/settings' element={<Settings />} />
            </Route>

          </Routes>
          </Main>
        </BrowserRouter>
        </LocalizationProvider>
      
      
    </div>
  );
}

export default App;
