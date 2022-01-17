import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const Registration = (props: { handleLogin: (arg0: any) => void; }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setPassword_confirmation] = useState('')
    let navigate = useNavigate();

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        console.log("form sumbitted");
        
        axios.post("http://localhost:8000/api/v1/register", {
          user: {
            email: email,
            password: password,
            password_confirmation: password_confirmation,
          },
        }).then(response => {
            console.log(response)
            props.handleLogin(response.data)
            navigate('/home')
        });
    }

    return (
    <div>
        <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            
            placeholder="Confirm Password"
            value={password_confirmation}
            onChange={e => setPassword_confirmation(e.target.value)}
            required
          />

          <button type="submit">Register</button>
        </form>
        </div>
        <div>
            Already a user?  Sign in <Link to="/login">Here</Link>!
        </div>
    </div>
    )
}
export default Registration;