import React, { useState, useCallback, useEffect } from 'react'
import Calc from './Calc.js'
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import endpoint from "./EndPoint";
import $ from "jquery"
import './Messages.css'
// importing io from socketio
import io from "socket.io-client"
const Messages=()=>{
    // this the part of De the date in that app
    let dateTime=new Date();
    let calc=new Calc(dateTime.getFullYear(), (dateTime.getMonth()+1), dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds())
    // enf of this part
    const checkLogin=localStorage.getItem('email')
    const[rooms, setRooms]=useState([])
    const[searchList, setSearchList]=useState([])
    const[content, setContent]=useState('')
    const[lst, setLst]=useState([])
    const[lstDate, setLstDate]=useState([])
    // De io in that app
    var socket=io.connect("")
    // this the part of the searching function in that app
    const searchF=async(search)=>{
        const response=await fetch('search/', {
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
                        <li style={{zIndex :"5"}} key={data.id} className="nav-item border"><Link to={`profil-${data.email}`} className="nav-link d-flex flex-row"><img className="img-fluid"  style={{width :"50px",}} src={data.profilimage}/><p className="text-dark text-center">{data.name}</p></Link></li>
                    )
                })
            )
        }
        else {
            return ""
        }
    },[searchList])
    const getRooms=async()=>{
        const response=await fetch('getrooms/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
            })
        })
        const data=await response.json();
        console.log(data)
        setRooms(data)
        try {
            var checkNum = /\d+/;
            let activePage=document.getElementsByClassName('tab-pane active')
            var numExtracted=activePage[0].id.match(checkNum);
            makeTabBeScrolled(numExtracted[0])
        } catch(e) {

        }
    }
    const CheckSenderMsg=({data})=>{
        let nameModified=data.name.substr(0, 3)
        if (data.email_s==checkLogin) return <span className="text-success">you :</span>
        else return <span className="text-success">{nameModified}.. :</span>
        
    }
    const seenMessagesFunction=async(email)=>{
        const response=await fetch('seenmessages/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                email_reciever :email

            })
        })
        const res=await response.json();
        console.log(res)
        getRooms();
    }
    const sendMsg=async(email)=>{
        socket.emit('sendmsg', {
            email :checkLogin,
            email_reciever :email, 
            content :content,
        })
        setContent('')
        seenMessagesFunction(email)
        modifyActiveTabs();
    }
    const modifyActiveTabsForSocket=(roomsLength, navLength)=>{
        console.log(roomsLength, navLength)
        if (roomsLength>navLength) {
            try {
                // this the part of the activing tab-contents in this app
                var tabs=document.querySelectorAll('.nav-tabs .nav-link')
                    var activeTab=document.querySelector('.nav-tabs .active')
                    const active=document.querySelector('.tab-content .active')
                    const list=document.querySelectorAll('.tab-pane')
                    console.log(list)
                    for (let i=0; i<list.length; i++) {
                        if (list[i]==active) {
                            if (list[i+1]==undefined) {
                                list[i].classList.remove('active')
                                list[list.length-1].classList.add('active')
                            }
                            else {
                                var tabss=document.querySelectorAll('.nav-tabs .nav-link')
                                console.log(tabss)
                                list[i].classList.remove('active')
                                list[i+1].classList.add('active')
                            }
                        }
                    }
                    for (let i=0; i<tabs.length; i++) {
                        if (tabs[i]==activeTab) {
                            if (tabs[i+1]==undefined) {
                                tabs[i].classList.remove('active')
                                tabs[tabs.length-1].classList.add('active')
                            }
                            else {
                                tabs[i].classList.remove('active')
                                tabs[i+1].classList.add('active')
                            }
                        }
                    }
            } catch(e) {}
        }
        else
        {
            var tabs=document.querySelectorAll('.nav-tabs .nav-link')
            var activeTab=document.querySelector('.nav-tabs .active')
            const active=document.querySelector('.tab-content .active')
            const list=document.querySelectorAll('.tab-pane')
            if (list[0]==active) {
                list[0].classList.remove('active')
                list[1].classList.add('active')
            }
            if (tabs[0]==activeTab) {
                tabs[0].classList.remove('active')
                tabs[1].classList.add('active')
            }
        }   
    }
    const modifyActiveTabs=()=>{
        if (rooms.length>1) {
            try {
                var tabs=document.querySelectorAll('.nav-tabs .nav-link')
                var activeTab=document.querySelector('.nav-tabs .active')
                activeTab.classList.remove('active')
                tabs[0].classList.add('active')
                // this the part of getting the tab-content of the all tabs and make the first active in that app
                var tabs_content=document.querySelectorAll('.tab-pane')
                console.log(tabs_content)
                var active_tab_content=document.querySelector('.tab-content .active')
                active_tab_content.classList.remove('active')
                tabs_content[0].classList.add('active')
                // end of that part
            } catch(e) {}
        }
        else {
            console.log('this the app of the ten to have the most of these oks ')
        }
    }
    // this the part of knowing the messages has been seened or not in that app
    const CheckSeeen=({msg})=>{
        if (msg.seen==0) return <section>
            <i className="fa fa-check-circle text-dark mb-3" aria-hidden="true"></i>
        </section>
        else return <section>
            <i className="fa fa-check-circle text-success mb-3" aria-hidden="true"></i>
        </section>
    }
    // end of that part
    // this the part of checing the active or not 
    const StateActive=({data})=>{
        return (
            data.state_active.map((res, index)=>{
                if (res[1]==0) return calc.CalcForStateActive(res[2], res[3], res[4], res[5], res[6], res[5], index)
                else return <p key={index}>active now </p>
            })
        )
    }
    // end of that part
    // this the part of the rooms in that app
    const CheckRooms=({rooms})=>{
        if (rooms.length==0) {
            return <h1 className="position-relative text-dark w-100 text-center mt-5" style={{textTransform :"capitalize"}}>there is no messages </h1>
        }
        return ""
    }
    // end of this part
    // this the part of deleting the chat in that app
    const deleteChat=async(data)=>{
        const response=await fetch('deletechat/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                email_reciever :data.email,
            })
        })
        const data_res=await response.json();
        console.log(data_res)
        getRooms();
    }
    const makeTabBeScrolled=async(index)=>{
        let lastEL=document.querySelectorAll(`#tab-${index} .msgs-container .row .msg-body .msg-time`)
        lastEL[lastEL.length-1].scrollIntoView({
            block:"start",
            inline:"start",
            behavior :"smooth"
        })
    }
    const modifyLength=async()=>{
        let msg_last=document.querySelectorAll('.msg-last-span')
        for(let i=0; i<msg_last.length; i++) {
            if (msg_last[i].innerHTML.length < 40) {
            }
            else {
                let newLength=msg_last[i].innerHTML.substr(0, 26)
                msg_last[i].innerHTML=newLength;
            }
        }
    }
    useEffect(()=>{
        socket.on('connect', async()=>{
            const response=await fetch('updatestate/', {
                method :"POST",
                headers :{
                    "Content-Type" :"application/json"
                },
                body :JSON.stringify({
                    email :checkLogin,
                    state:1,
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
        })
        socket.on('sendedmsg', async(msg)=>{
            console.log(msg)
            if ( checkLogin==msg.email_reciever) {
                let activePage=document.getElementsByClassName('tab-pane active')
                let tabs=document.querySelectorAll('.nav-tabs .nav-link')
                console.log(tabs.length)
                console.log(tabs)
                if (activePage[0]==undefined) {
                    getRooms();
                }
                else {
                    getRooms();
                    // this the part of putting the component of the function getrooms in that area to confirm of the length of the rooms 
                    const response=await fetch('getrooms/', {
                        method :"POST",
                        headers :{
                            "Content-Type" :"application/json"
                        },
                        body :JSON.stringify({
                            email :checkLogin,
                        })
                    })
                    const data=await response.json();
                    console.log(data)
                    setRooms(data)
                    try {
                        var checkNum = /\d+/;
                        let activePage=document.getElementsByClassName('tab-pane active')
                        var numExtracted=activePage[0].id.match(checkNum);
                        makeTabBeScrolled(numExtracted[0])
                    } catch(e) {
            
                    }
                    // end of that part
                    modifyActiveTabsForSocket(data.length, tabs.length)
                }
            }
            else if (msg.email==checkLogin) 
            {
                getRooms();
                modifyActiveTabs();
            }
        })
        getRooms();
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
    useEffect(()=>{
        modifyLength();
    },[rooms])
    if (checkLogin==null) return (<Redirect to="/login"/>)
    return (
        <div>
            <nav className="navbar navbar-expand-lg header-website  bg-white">
                <Link to="/profil" className="navbar-brand text-dark">Social App</Link>
                <button className="navbar-toggler" role="button" aria-controls="collapseExample" aria-label="Toggle navigation" aria-expanded="false" data-toggle="collapse" data-target="#collapseExample">
                    <span className="fi-menu text-dark"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapseExample">
                    <ul className="navbar-nav">
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
            <section className="tabs" id="tabs-messages">
                <div className="row" style={{position :"relative", width: "100%",}}>
                    <section className="tabs-ul col-3">
                        <ul className="nav nav-tabs">
                            {rooms.map((data, index)=>{
                                if (data.unseen_messages > 0 ) {
                                    return (
                                        <li id={`activeLi-${index}`} onClick={(e)=>{makeTabBeScrolled(index); seenMessagesFunction(data.email)}} key={index} className="nav-item unseen-nav-item">
                                            <Link to="/messages" className="nav-link" data-toggle="tab" data-target={`#tab-${index}`}>
                                                <div className="person">
                                                    <img src={data.profilimage} className="img-fluid"/>
                                                    <section className="info-sec">
                                                        <p style={{backgroundColor :"red", borderRadius :"20px", color:"#fff", position :"absolute", right :"0", width :"20px", top :"0", zIndex :"2"}}>{data.unseen_messages}</p>
                                                        <section>
                                                            <h5>{data.name}</h5>
                                                            <p className="msg-last"><CheckSenderMsg data={data}/><span className="msg-last-span">{data.content}</span>.... </p>
                                                        </section>
                                                    </section>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                }
                                return (
                                    <li id={`activeLi-${index}`} onClick={(e)=>{makeTabBeScrolled(index); seenMessagesFunction(data.email)}} key={index} className="nav-item">
                                        <Link to="/messages" className="nav-link" data-toggle="tab" data-target={`#tab-${index}`}>
                                            <div className="person">
                                                <img src={data.profilimage} className="img-fluid"/>
                                                <section className="info-sec">
                                                    <section>
                                                        <h5>{data.name}</h5>
                                                        <p className="msg-last"><CheckSenderMsg data={data}/><span className="msg-last-span">{data.content}</span>.</p>
                                                    </section>
                                                </section>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                            
                        </ul>
                    </section>
                    <section className="tab-content col-9">
                        <CheckRooms rooms={rooms}/>
                        {rooms.map((data, index)=>{
                            return(
                                <div className="tab-pane" id={`tab-${index}`} key={index}>
                                    <div className="position-relative w-100 header-chat">
                                        <div className="main-data">
                                            <section className="data-container">
                                                <Link to={`/profil-${data.email}`}><img src={data.profilimage}/></Link>
                                                <section>
                                                    <h5>{data.name}</h5>
                                                    <StateActive data={data}/>
                                                </section>
                                            </section>
                                            <div className="text-center mr-2 d-flex justify-content-end align-items-end flex-column">
                                                <i data-toggle="collapse" data-target="#dropdownList" style={{fontSize :"20px", cursor :"pointer"}} className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                <div  className="msgs-options-dropdown collapse" id="dropdownList">
                                                    <ul style={{backgroundColor :"white", borderRadius :"10px", padding :"5px"}} className="position-relative w-100 text-center list-unstyled">
                                                        <li onClick={(e)=>deleteChat(data)} className="text-center" style={{cursor :"pointer", textTransform :"capitalize"}}>delete chat </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="msgs-container">
                                        {data.messages.map((res, Index)=>{
                                            return (
                                                <div key={Index}>
                                                    <div className="date-msgs">
                                                        {calc.CalcForMsgs(parseInt(res.date[0]), parseInt(res.date[1]), parseInt(res.date[2]))}
                                                    </div>
                                                    {res.messages.map((msg, index)=>{
                                                            if (msg.email==data.email) {
                                                                return (
                                                                    <div key={index} className="row his-msg">
                                                                        <div className="msg-body">
                                                                            <section className="msg-img">
                                                                                <img src={data.profilimage} className="img-fluid"/>
                                                                            </section>
                                                                            <section className="msg-list">
                                                                                <div className="msg-container">
                                                                                    <p className="msg-content">{msg.content}</p>
                                                                                    <section className="msg-time">
                                                                                        <p>{msg.hour}.{msg.minute}</p>
                                                                                    </section>
                                                                                </div>
                                                                            </section>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                            else {
                                                                return (
                                                                    <div className="row my-msg" key={index}>
                                                                        <div className="msg-body">
                                                                            <section className="msg-img">
                                                                                <img src={data.profilimage_login} className="img-fluid"/>
                                                                            </section>
                                                                            <section className="msg-list">
                                                                                <div className="msg-container">
                                                                                    <p className="msg-content">{msg.content}</p>
                                                                                    <section className="msg-time">
                                                                                        <p>{msg.hour}.{msg.minute}</p>
                                                                                    </section>
                                                                                    <CheckSeeen msg={msg}/>
                                                                                </div>
                                                                            </section>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <form className="form form-inline position-relative d-flex justify-content-between flex-row" onSubmit={(e)=>{e.preventDefault();sendMsg(data.email)}} style={{width: "100%", position: "relative",}}>
                                        <textarea required placeholder="type your messages :" row="3" className="form-control position-relative input-send-msg" onChange={(e)=>{setContent(e.target.value)}} value={content}></textarea>
                                        <button className="btn btn-primary"><i className="fa fa-location-arrow" aria-hidden="true"></i></button>
                                    </form>
                                </div>
                            )
                        })}
                    </section>
                </div>
            </section>
        </div>
    )
}
export default Messages;