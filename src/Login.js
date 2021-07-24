import React, { useState } from "react"
import './Login.css'
import AOS from "aos"
import endpoint from './EndPoint'
import { Link, Redirect } from "react-router-dom";
AOS.init({
    easing :"swing"
});
const Login=()=>{
    const[email, setEmail]=useState('')
    const[password, setPassword]=useState('')
    const[state, setState]=useState('')
    let checkLogin=localStorage.getItem('email')
    const loginFunction=async()=>{
        const response=await fetch('login/', {
            method :"POST",
            headers :{
                "content-type" :"application/json",
            },
            body :JSON.stringify({
                email :email,
                password :password
            })
        })
        const data=await response.json();
        console.log(data)
        if (data.state) {
            localStorage.setItem('email', email)
            console.log(localStorage.getItem('email'))
            setEmail('')
            setPassword('')
            window.location.href="https://muhsocial.herokuapp.com/login"
        }
        else {
            setState(data.process)
        }
    }
    if (checkLogin!=null) return (<Redirect to="/profil"/>)
    return (
        <div className="forms_container">
            <section className="login-sec">
                <div className="desc-sec d-none d-lg-block">
                    <h4>Social App</h4>
                    <p>this a social media app where you can share your best moments on and share other's opinion, speaking with your best friends.</p>
                </div>
                <form data-aos="zoom-out" data-aos-delay="100" onSubmit={(e)=>{e.preventDefault();loginFunction()}}>
                    <input value={email} required onChange={(e)=>setEmail(e.target.value)} className="form-control" type="email" maxLength="30" id="emailInp" placeholder="type your email :"/>
                    <input value={password} required  onChange={(e)=>setPassword(e.target.value)} className="form-control" type="password" maxLength="40" id="passwordInp" placeholder="type your password :"/>
                    <button className="btn btn-primary">login</button>
                    <p className="text-danger mt-2">{state}</p>
                    <Link to="/signup" className="text text-white bg-dark p-2 rounded">sign up</Link>
                </form>
            </section>
        </div>
    )
}
export default Login;