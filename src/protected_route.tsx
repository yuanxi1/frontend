import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
const ProtectedRoute = () => {
    
    const loggedIn = useAppSelector(state => state.login.loggedIn);
    
    return (
        loggedIn
        ? <Outlet />
        : <Navigate to='/login' />
    )
}
export default ProtectedRoute;