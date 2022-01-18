import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { logOut } from './reducers/loginSlice';
const ProtectedRoute = () => {
    const dispatch = useAppDispatch()
    const user = localStorage.getItem('user');
    
    if (user) {
    const token = JSON.parse(user).JWTToken
    const decodedJwt = JSON.parse(window.atob(token.split(".")[1]))
    if (decodedJwt.exp * 1000 < Date.now()) {
      console.log('expired')
      localStorage.removeItem('user');
      dispatch(logOut())
    }}

    const loggedIn = useAppSelector(state => state.login.loggedIn);
    return (
        loggedIn
        ? <Outlet />
        : <Navigate to='/login' />
    )
}
export default ProtectedRoute;