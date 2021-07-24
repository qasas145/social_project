import React, { useState, useCallback, useEffect } from 'react'
import Calc from './Calc.js'
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import endpoint from "./EndPoint";
import './Home.css'
const Home=()=>{
    const checkLogin=localStorage.getItem('email')
    const[searchList, setSearchList]=useState([])
    // this the part of the searching function in that app
    const searchF=async(search)=>{
        const response=await fetch(endpoint+'search/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                search :search
            })
        })
        const data=await response.json();
        console.log(data)
        setSearchList(data)
    }
    const SearchR=useCallback(()=>{
        if (searchList.length>1 || searchList.length==1) {
            return (
                searchList.map((data)=>{
                    return (
                        <li key={data.id} className="nav-item border"><Link to={`profil-${data.email}`} className="nav-link d-flex flex-row"><img className="img-fluid"  style={{width :"50px",}} src={data.profilimage}/><p className="text-dark text-center">{data.name}</p></Link></li>
                    )
                })
            )
        }
        else {
            return ""
        }
    },[searchList])
    useEffect(()=>{
        window.addEventListener('scroll', function(){
            let header_website=document.getElementsByClassName('header-website')
            if (window.scrollY > 0) {
                header_website[0].classList.add('activeHeaderWebsite')
            }
            else {
                header_website[0].classList.remove('activeHeaderWebsite')
            }
        })
    },[])
    if (checkLogin==null) return (<Redirect to="/login"/>)
    return (
        <div>
            <nav className="navbar navbar-expand-lg header-website  bg-white">
                <Link to="/profil" className="navbar-brand text-dark">w3 school</Link>
                <button className="navbar-toggler" role="button" aria-controls="collapseExample" aria-label="Toggle navigation" aria-expanded="false" data-toggle="collapse" data-target="#collapseExample">
                    <span className="fi-menu text-dark"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapseExample">
                    <ul className="navbar-nav">
                    <li className="nav-item active"><Link to="/home" className="nav-link"><i className="bi bi-house-door"></i></Link></li>
                        <li className="nav-item"><Link to="/profil" className="nav-link"><i className="bi bi-person"></i></Link></li>
                        <li className="nav-item"><Link to="/messages" className="nav-link"><i className="bi bi-briefcase"></i></Link></li>
                        <li className="nav-item"><Link to="/logout" className="nav-link"><i className="fa fa-sign-in" aria-hidden="true"></i></Link></li>
                    </ul>
                    <div className="form-inline">
                        <input onChange={(e)=>{searchF(e.target.value);}} className="form-control" type="text" placeholder="search" type="search" aria-label="Search" required maxLength="100"/>
                        <ul id="search_ul" className="nav d-flex flex-column position-absolute bg-white" style={{top:"100%"}}>
                            <SearchR />
                        </ul>
                    </div>
                        
                </div>
            </nav>
        </div>
    )
}
export default Home;