import React from "react"
import { Redirect } from "react-router";
const Logout=()=>{
    let dateTime=new Date();
    const checkLogin=localStorage.getItem('email')
    if (checkLogin==null) return (<Redirect to="login"/>)
    window.addEventListener('beforeunload', async(e)=>{
        const response=await fetch('updatestate/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                state:0,
                last_seen_year:dateTime.getFullYear(),
                last_seen_month:dateTime.getMonth()+1,
                last_seen_day:dateTime.getDate(),
                last_seen_hour:dateTime.getHours(),
                last_seen_minute:dateTime.getMinutes(),
                last_seen_second:dateTime.getSeconds(),
            })
        })
        const data=await response.json();
        console.log(data)
        e.preventDefault();
        e.returnValue="this the page of the messages in that app"
    })
    localStorage.removeItem('email')
    return (
        <Redirect to="/login"/>
    )
}
export default Logout;