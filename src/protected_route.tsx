import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { logOut } from './reducers/userSlice';
const ProtectedRoute = () => {
    const dispatch = useAppDispatch()
    // const token = localStorage.getItem('token');
    
    // if (token) {
    // // const token = JSON.parse(token)
    // const decodedJwt = JSON.parse(window.atob(token.split(".")[1]))
    // if (decodedJwt.exp * 1000 < Date.now()) {
    //   console.log('expired')
    //   localStorage.removeItem('user');
    //   dispatch(logOut())
    // }}

    const loggedIn = useAppSelector(state => state.user.loggedIn);
    return (
        loggedIn
        ? <Outlet />
        : <Navigate to='/login' />
    )
}
export default ProtectedRoute;