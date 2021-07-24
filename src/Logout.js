import React from "react"
import { Redirect } from "react-router";
const Logout=()=>{
    const checkLogin=localStorage.getItem('email')
    if (checkLogin==null) return (<Redirect to="login"/>)
    localStorage.removeItem('email')
    return (
        <Redirect to="/login"/>
    )
}
export default Logout;