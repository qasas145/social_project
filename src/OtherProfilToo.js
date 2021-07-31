// in here to save the order of the posts in that app we made the checkLogin the email that we get from the username to save the time and the email is the checkligin in real
import React, { useEffect, useState, useRef, useCallback } from "react"
import './Profil.css'
import Calc from './Calc.js'
import CircularProgress from "@material-ui/core/CircularProgress"
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import endpoint from "./EndPoint";
import Modal from "react-awesome-modal"
import { useParams } from "react-router"
import io from "socket.io-client"
const OtherProfilToo=()=>{
    const{checkLogin}=useParams()
    // the date and the time in that app
    let dateTime=new Date();
    // part other related to the defination in that app for the time and the date in that app
    let calc=new Calc(dateTime.getFullYear(), (dateTime.getMonth()+1), dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds())
    // end of this date and the time
    const[visibleMsg, setVisibleMsg]=useState(false)
    const[visibleProgress, setVisibleProgress]=useState(false)
    const[visibleShare, setVisibleShare]=useState(false)
    const[data, setData]=useState([])
    const[data2, setData2]=useState([])
    const[data2One, setData2One]=useState({})
    const[content, setContent]=useState('')
    const[posts, setPosts]=useState([])
    const[pio, setPio]=useState('')
    const[alertData, setAlertData]=useState([])
    const[comment, setComment]=useState('')
    const[postShared, setPostShared]=useState({})
    const[searchList, setSearchList]=useState([])
    const[msgContent, setMsgContent]=useState('')
    let emailLogin=localStorage.getItem('email')
    var socket=io.connect(endpoint)
    const openModalMsg=()=>{
        setVisibleMsg(true)
    }
    const closeModalMsg=()=>{
        setVisibleMsg(false)
    }
    const openModalShare=(post)=>{
        setVisibleShare(true)
    }
    const closeModalShare=()=>{
        setVisibleShare(false)
    }
    const openModalProgress=()=>{
        setVisibleProgress(true)
    }
    const closeModalProgess=()=>{
        setVisibleProgress(false)
    }
    const getDataForLoginEmail=async()=>{
        const response=await fetch('profildata/', {
            method :"POST",
            headers:{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :emailLogin
            })
        })
        const data2=await response.json();
        setData2(data2)
        setData2One(data2[0])
    }
    const getFollowingEmails=async()=>{
        const response=await fetch('getfollowingemails/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                email_following :emailLogin
            })
        })
        const data=await response.json();
        if (data.state) {
            try {
                const followBtn=document.getElementsByClassName('followBtn')
                followBtn[0].innerHTML="unFollow"
                followBtn[0].className="btn btn-white border followBtn"
            } catch(e) {}
        }
        else {
            try {
                const followBtn=document.getElementsByClassName('followBtn')
                followBtn[0].innerHTML="Follow"
                followBtn[0].className="btn btn-primary followBtn"
            } catch(e) {}
        }
    }
    const getData=async()=>{
        const response=await fetch('profildata/', {
            method :"POST",
            headers:{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin
            })
        })
        const data=await response.json();
        setData(data)
    }
    const getPosts=async()=>{
        const response=await fetch('getposts/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin
            })
        })
        const data=await response.json();
        setPosts(data)
    }
    const getTheLikedPosts=async()=>{
        posts.map((post)=>{
            // hey we make all liked btns red unti the below function been done in that app
            const likeBtn=document.querySelector(`#post-${post.idPostsInPublic} ul .likeBtn`)
            likeBtn.className="col-4 likeBtn text-danger"
            // end of that try
            post.likesList.map((data)=>{
                const likeBtn=document.querySelector(`#post-${data.postId} ul .likeBtn`)
                likeBtn.className="col-4 likeBtn text-danger"
                if (data.email==emailLogin){
                    likeBtn.className="col-4 likeBtn text-primary"
                }
                else {
                    likeBtn.className="col-4 likeBtn text-danger"
                }
            })
        })
    }
    const AddComment=async(postId, emailOwnerPost)=>{
        const response=await fetch('addcomment/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :emailLogin,
                email_post_owner:emailOwnerPost,
                post_id :postId,
                comment :comment
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData([])
        setComment('')
    }
    // the process of the liking the post in that app
    const addLike=async(email_owner_post, post_id, el)=>{
        // this the try of making the heart get blue when clicked on it and the next time when clicked on it get red
        // end of that try of the making the button get colored
        const response=await fetch('addlike/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :emailLogin,
                email_owner_post :email_owner_post,
                post_id :post_id
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData([])
    }
    const showDropDown=(postId)=>{
        const dropDownEl=document.getElementById('dropdown-'+postId)
        const activeDropDown=document.getElementsByClassName("activeDropDown")
        if (activeDropDown[0]==undefined) {
            dropDownEl.classList.add('activeDropDown')
        }
        else {
            activeDropDown[0].classList.remove('activeDropDown')
        }
    }
    const showDropDownCommentOptions=(postId)=>{
        const dropDownEl=document.getElementById('dropdownComment-'+postId)
        const activeDropDown=document.getElementsByClassName("activeDropDownComment")
        if (activeDropDown[0]==undefined) {
            dropDownEl.classList.add('activeDropDownComment')
        }
        else {
            activeDropDown[0].classList.remove('activeDropDownComment')
        }
    }
    const savePost=async(postId)=>{
        const response=await fetch('savepost/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :emailLogin,
                post_id :postId
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData([])
    }
    const getSavedEmails=()=>{
        posts.map((post)=>{
            const savePostBtn=document.getElementById(`savePostBtn-${post.idPostsInPublic}`)
            savePostBtn.innerHTML="save post"
            post.savedList.map((data)=>{
                if (data.emailSaving==emailLogin) {
                    savePostBtn.innerHTML="unsave"
                }
            })
        })
    }
    const sharePostFunctionAsync=async(postId)=>{
        openModalProgress();
        const response=await fetch('sharepost/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :emailLogin,
                post_id :postId,
                pio :pio
            })
        })
        const data=await response.json();
        console.log(data);
        setAlertData([])
        setPio('');
        closeModalShare();
        closeModalProgess();
    }
    const modifyLengthFunctionS=(el, postId)=>{
        const activeShowMoreBtns=document.getElementsByClassName('activeShowMoreBtns')
        const postPio=document.querySelector(`#postScrollY-${postId} header .postPio`)
        // first of all the modal in that app
        // end of first of all
        if (activeShowMoreBtns[0]==undefined) {
            if (postShared.idPostsInPublic==postId) {
                postPio.innerHTML=postShared.pio;
            }
            el.classList.add('activeShowMoreBtns')
            el.innerHTML="show less .."
        }
        else {
            if (el==activeShowMoreBtns[0]) {
                let MlengthS=postPio.innerHTML.substring(0, 70)
                postPio.innerHTML=MlengthS;
                activeShowMoreBtns[0].innerHTML="show more .."
                activeShowMoreBtns[0].classList.remove('activeShowMoreBtns')
            }
            else {
                if (postShared.idPostsInPublic==postId) {
                    postPio.innerHTML=postShared.pio;
                }
                el.classList.add('activeShowMoreBtns')
                el.innerHTML="show less .."
            }
    }
    }
    const modifyLengthFunction=(el, postId)=>{
        const activeShowMoreBtn=document.getElementsByClassName('activeShowMoreBtn')
        const postText=document.querySelector(`#post-${postId} header .postPio`)
        if (activeShowMoreBtn[0]==undefined) {
            posts.map((post)=>{
                if (post.idPostsInPublic==postId) {
                    postText.innerHTML=post.pio;
                }
            })
            el.classList.add('activeShowMoreBtn')
            el.innerHTML="show less .."
        }
        else {
            if (el==activeShowMoreBtn[0]) {
                posts.map((post)=>{
                    if (post.idPostsInPublic==postId) {
                        postText.innerHTML=post.pio;
                    }
                })
                let Mlength=postText.innerHTML.substring(0, 150)
                postText.innerHTML=Mlength;
                // postText.innerHTML.substr(0, 150)
                activeShowMoreBtn[0].innerHTML="show more .."
                activeShowMoreBtn[0].classList.remove('activeShowMoreBtn')
            }
            else {
                posts.map((post)=>{
                    if (post.idPostsInPublic==postId) {
                        postText.innerHTML=post.pio;
                    }
                })
                el.classList.add('activeShowMoreBtn')
                el.innerHTML="show less .."
            }
        }
    }
    const modifyLength=async()=>{
        const showMoreBtnShared=document.querySelector(`#postScrollY-${postShared.idPostsInPublic} header .showMoreBtnS`)
        // a next part 
        try {
            const postPio=document.querySelector(`#postScrollY-${postShared.idPostsInPublic} header .postPio`)
            console.log(postShared.pio.length)
            if (postShared.pio.length <=70 ) {
                showMoreBtnShared.style.display="none"
            }
            else {
                showMoreBtnShared.style.display="block"
                let Mlength=postPio.innerHTML.substr(0, 70)
                postPio.innerHTML=Mlength;
            }
        } catch(e) {
        }
        // end of this part
        posts.map((post)=>{
            const postText=document.querySelector(`#post-${post.idPostsInPublic} header .postPio`)
            const showMoreBtnPost=document.querySelector(`#post-${post.idPostsInPublic} header .showMoreBtn`);
            if (post.pio.length <=150 ) {
                showMoreBtnPost.style.display="none"
            }
            else {
                const showMoreBtnPost=document.querySelector(`#post-${post.idPostsInPublic} header .showMoreBtn`);
                showMoreBtnPost.style.display="block"
                let Mlength=postText.innerHTML.substr(0, 150)
                postText.innerHTML=Mlength;
                const showMoreBtn=document.querySelector(`#post-${post.idPostsInPublic} header .showMoreBtn`)
                showMoreBtn.style.display="block"
            }
            // this the part related to the reducting the length of the text of the shared post in that app
            try {
                const shared_post_text=document.querySelector(`#shared_post-${post.idPostsInPublic} section p`)
                if (shared_post_text.innerHTML.length >150) {
                    let minTextForSharedPostText=shared_post_text.innerHTML.substr(0, 80)
                    shared_post_text.innerHTML=minTextForSharedPostText+'.........';
                }
            } catch (e) {
            }
        })
    }
    const GetSharedState=({post})=>{
        if (post.sharedState=="true") {
            return (
                    <div className="shared_post container border-top" id={`shared_post-${post.idPostsInPublic}`} style={{}}>
                        
                        <header className="d-flex flex-row align-items-center w-100 justify-content-start pb-2">
                            <img src={post.postSharedProfilImage}/>
                            <h5 className="ml-2" style={{fontSize :"18px"}}>{post.postSharedName}</h5>
                            <div className="calc-date-time">
                            {calc.CalcT(post.postSharedYear, post.postSharedMonth, post.postSharedDay, post.postSharedHour, post.postSharedMinute , post.postSharedSecond)}
                        </div>
                        </header>
                        <Link to={`/post-${post.postSharedId}`}><i className="fa fa-paper-plane-o" aria-hidden="true"></i></Link>
                        <section className="d-flex flex-column">
                            <p className="text text-dark text-center ml-5">{post.postSharedPio}</p>
                            <img  className="img-fluid imageHover" src={post.postSharedImage}/>
                        </section>
                    </div>
                
            )
        }
        else {
            return <div style={{display :"none"}}></div>
        }
    }
    const MakeProfilEmailNotShownAsLinkInComments=({data})=>{
        if (data.email==emailLogin) return <img style={{ borderRadius :"50%"}} className="img-fluid mt-2" src={data.profilImage}/>
        else {
            return <Link to={`profil-${data.email}`}>
                <img style={{ borderRadius :"50%"}} className="img-fluid mt-2" src={data.profilImage}/>
            </Link>
        }
    }
    const ShowDropDownCommentOptionsReturn=({data})=>{
        if (data.email==emailLogin) return( 
            <i style={{cursor :"pointer"}} onClick={(e)=>showDropDownCommentOptions((data.id+parseInt(data.second)))} className="fa fa-ellipsis-v" aria-hidden="true"></i>
        )
        else return ""
    }
    const deleteComment=async(year, month, day, hour, minute, second, postId)=>{
        const response=await fetch('deletecomment/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :emailLogin,
                year :year,
                month :month,
                day :day,
                hour :hour,
                minute :minute,
                second :second,
                post_id :postId
            })
        })
        const data=await response.json();
        console.log(data)
    }
    // this the function of the follow and unfollow in this app
    const followFunction=async()=>{
        const response=await fetch('follow/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :emailLogin,
                email_wanted_to_follow :checkLogin,
            })
        })
        const data=await response.json();
        console.log(data)
        getFollowingEmails();
    }
    // this the part of the searching function in that app
    const searchF=async(search)=>{
        const response=await fetch('search/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :emailLogin,
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
                        <li style={{zIndex :"2"}} key={data.id} className="nav-item border"><Link  to={`profil-${data.email}`} className="nav-link d-flex flex-row"><img className="img-fluid"  style={{width :"50px",}} src={data.profilimage}/><p className="text-dark text-center">{data.name}</p></Link></li>
                    )
                })
            )
        }
        else {
            return ""
        }
    },[searchList])
    // this the part of sending a message to any one in that app
    const addMessageFunction=async(e)=>{
        openModalProgress();
        e.preventDefault();
        socket.emit('sendmsg', {
            email :emailLogin,
            email_reciever :checkLogin, 
            content :msgContent,
        })
        setMsgContent('')
        closeModalMsg();
        closeModalProgess();
    }
    const goToTop=()=>{
        window.scrollTo({
            top :0,
            behavior :"smooth"
        })
    }
    // end of this part in this app
    useEffect(()=>{
        getData();
        getPosts();
        getDataForLoginEmail();
        getFollowingEmails();
        window.addEventListener('scroll', function(){
            let header_website=document.getElementsByClassName('header-website')
            if (window.scrollY > 0) {
                header_website[0].classList.add('activeHeaderWebsite')
            }
            else {
                header_website[0].classList.remove('activeHeaderWebsite')
            }
        })
    }, [alertData])
    useEffect(()=>{
        getTheLikedPosts();
        getSavedEmails();
        modifyLength();
        // makeStyleOfSharedPostInSharingPostsModal();
    },[posts, postShared, visibleShare])
    useEffect(()=>{
        window.addEventListener('beforeunload', async(e)=>{
            const response=await fetch(endpoint+'updatestate/', {
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
    },[])
    if (checkLogin==emailLogin) return (<Redirect to="/profil"/>)
    if (emailLogin==null) return (<Redirect to="/login"/>)
    return (
        <div>
            <nav className="navbar navbar-expand-lg header-website  bg-white">
                <p style={{cursor :"pointer"}} onClick={goToTop} className="navbar-brand text-dark">Social App</p>
                <button className="navbar-toggler" role="button" aria-controls="collapseExample" aria-label="Toggle navigation" aria-expanded="false" data-toggle="collapse" data-target="#collapseExample">
                    <i class="fa fa-bars text-dark" aria-hidden="true"></i>
                </button>
                <div className="collapse navbar-collapse" id="collapseExample">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link to="/profil" className="nav-link"><i className="fa fa-user-o" aria-hidden="true"></i></Link></li>
                        <li className="nav-item"><Link to="/messages" className="nav-link"><i className="fa fa-envelope-o" aria-hidden="true"></i></Link></li>
                        <li className="nav-item"><Link to="/logout" className="nav-link"><i className="fa fa-sign-in" aria-hidden="true"></i></Link></li>
                    </ul>
                    <div>
                        <input onChange={(e)=>{searchF(e.target.value);}} className="form-control" type="text" placeholder="search" type="search" aria-label="Search" required maxLength="100"/>
                        <ul id="search_ul" className="nav d-flex flex-column position-absolute bg-white" style={{top:"100%"}}>
                            <SearchR />
                        </ul>
                    </div>
                        
                </div>
            </nav>
            <section className="profil-section mt-4">
                <div className="container">
                    {data.map((res)=>{
                        return (
                            <div className="profil-section-header row row d-lg-flex flex-lg-row justify-content-lg-center mr-lg-5" key={res.id}>
                                <div className="col-lg-4 profil-image d-flex justify-content-center justify-content-lg-end">
                                    <img className="mr-lg-5" src={res.profilimage}/>
                                </div>
                                <div className="col-lg-4 profil-data d-flex flex-column justify-content-center">
                                    <section className="mt-lg-3 order-lg-1 order-1 d-flex justify-content-lg-start align-items-center justify-content-between">
                                        <h2>{res.username}</h2>
                                        <button onClick={openModalMsg} className="btn btn-primary ml-lg-5"><i className="fa fa-location-arrow" aria-hidden="true"></i></button>
                                    </section>
                                    {/* this the part of the modal of sending a messages in that app */}
                                    <Modal visible={visibleMsg} width="500px"height="auto"  onClickAway={closeModalMsg} effect="fadeInUp">
                                        <form className="form-inline form-send-msg position-relative w-100" onSubmit={addMessageFunction}>
                                            <textarea required placeholder="type your messages :" rows="3" className="form-control" style={{width :"80%"}} onChange={(e)=>{setMsgContent(e.target.value)}} value={msgContent}></textarea>
                                            <button className="btn btn-primary ml-lg-5"><i className="fa fa-location-arrow" aria-hidden="true"></i></button>
                                        </form>
                                    </Modal>
                                    {/* end of this part */}
                                    {/* this the modal of the post_shared in that app  */}
                                    <Modal visible={visibleShare} width="400px" height="auto" effect="fadeInUp" onClickAway={closeModalShare}>
                                        <div className="post container postScrollYClass" id={`postScrollY-${postShared.idPostsInPublic}`}>
                                            <div className="d-flex justify-content-start align-items-center flex-row">
                                                <img style={{width :"50px", borderRadius :"50%"}} src={data2One.profilimage}/>
                                                <h5 style={{textTransform :"capitalize", fontSize :"17px"}} className="ml-2">{data2One.name}</h5>
                                            </div>
                                            <textarea className="form-control border-0 mt-1" placeholder="post content ...." rows="1" onChange={(e)=>setPio(e.target.value)} value={pio}/>
                                            <hr />
                                            <header>
                                                <img style={{width :"50px"}} src={postShared.profilImage} className="img-fluid"/>
                                                <h4>{postShared.name}</h4>
                                                <p translate="yes" className="postPio">{postShared.pio}</p>
                                                <p className="showMoreBtnS" onClick={(e)=>modifyLengthFunctionS(e.target, postShared.idPostsInPublic)}>show more ..</p>
                                            </header>
                                            <section>
                                                <img src={postShared.image} className="img-fluid"/>
                                            </section>
                                            <button onClick={(e)=>{sharePostFunctionAsync(postShared.idPostsInPublic)}} className="btn btn-primary mt-2">Share</button>
                                        </div>
                                    </Modal>
                                    {/* end of that note that this the part is the part of the shared post in that app */}
                                    {/* this the part related to the model of the profil data edit in that app */}
                                    
                                    {/* part related to the crop image in that app */}
                                    {/* end of this part of that app  */}
                                    <section className="mt-lg-3 order-lg-3 order-4 ">
                                        <button className="btn btn-primary followBtn" onClick={followFunction}>Follow</button>
                                        <p className="mt-3">{res.followers} followers</p>
                                        <p className="mt-3">{res.following} following</p>
                                    </section>
                                    <p className="position-relative w-100 border-top order-3 d-lg-none"></p>
                                    <section className="mt-lg-3 order-lg-3 order-2 d-flex justify-content-between align-items-start flex-row flex-lg-row">
                                        <h3>{res.name}</h3>
                                        <p className="text-muted">{res.pio}</p>
                                    </section>
                                </div>
                            </div>
                        )
                    })}
                    <hr />
                    {/* this the part related to the modal part in that app */}
                    <Modal visible={visibleProgress} height="auto" effect="fadeInUp" >
                        <div className="container bg-white border-rounded d-flex justify-content-center align-items-center flex-row" style={{height :"auto", width :"400px", borderRadius :"10px", padding :"10px"}}>
                            Loading.....<CircularProgress className="ml-3" />
                        </div>
                    </Modal>
                    {/* end of that try of the modal */}
                    {/* this the style of the tabs section  */}
                    <section className="tabs">
                        <div className="container justify-content-center align-items-center flex-column d-flex">
                            <ul className="nav nav-tabs justify-content-center align-items-center" id="tabs-list">
                                <li className="nav-item"><Link to={`/profil-${checkLogin}`} className="nav-link active show" data-toggle="tab" data-target="#tab-posts"><span className="fi-grid-three-up"></span>POSTS</Link></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="tab-posts">
                                    {posts.map((post)=>{
                                            return (
                                                <div style={{minWidth :"200px", maxWidth :"540px"}} key={post.idPostsInPublic} className="post border rounded" id={`post-${post.idPostsInPublic}`}>
                                                    <div style={{position :"absolute", right :"0",
                                                    left :"0", marginTop :"15px", marginLeft :"5px"}}>{calc.CalcT(parseInt(post.year), parseInt(post.month), parseInt(post.day), parseInt(post.hour), parseInt(post.minute), parseInt(post.second))}</div>
                                                    <div className="dropdownO">
                                                        <i onClick={(e)=>showDropDown(post.idPostsInPublic)} className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                        <div id={`dropdown-${post.idPostsInPublic}`} className="dropdown-content">
                                                            <li id={`savePostBtn-${post.idPostsInPublic}`} onClick={(e)=>savePost(post.idPostsInPublic)}>save post</li>
                                                        </div>
                                                    </div>
                                                    <header>
                                                        <Link to={`profil-${post.email}`}><img src={post.profilImage} className="img-fluid"/></Link>
                                                        <h4>{post.name}</h4>
                                                        <p className="postPio">{post.pio}</p>
                                                        <p className="showMoreBtn" onClick={(e)=>{modifyLengthFunction(e.target, post.idPostsInPublic)}}>show more ..</p>
                                                    </header>
                                                    <section>
                                                        <img src={post.image} className="img-fluid"/>
                                                    </section>
                                                    <GetSharedState post={post}/>
                                                    <ul className="row" id="l-c-s">
                                                        <li onClick={(e)=>addLike(post.email, post.idPostsInPublic, e.currentTarget)} className="col-4 likeBtn">{post.likes}<i className="fa fa-heart ml-2" aria-hidden="true"></i></li>
                                                        <li  data-toggle="collapse" data-target={`#collapseComments-${post.idPostsInPublic}`} className="col-4">{post.comments}<i className="fa fa-comment-o ml-2" aria-hidden="true"></i></li>
                                                        <li onClick={(e)=>{setPostShared(post); openModalShare(post.idPostsInPublic);}} className="col-4 border-0">{post.shares}<i className="fa fa-share ml-2" aria-hidden="true"></i></li>
                                                    </ul>
                                                    <form onSubmit={(e)=>{e.preventDefault();AddComment(post.idPostsInPublic, post.email)}} className="form form-inline w-100 pt-2 pb-2 border-top">
                                                        <div className="container d-flex justify-content-center">
                                                            <input onChange={(e)=>setComment(e.target.value)} required value={comment} placeholder="type the new comment :" className="form-control w-75"/>
                                                            <button className="btn btn-primary ml-2">comment</button>
                                                            </div>
                                                    </form>
                                                    <div className="collapse" style={{maxHeight :"200px", overflowY :"scroll"}} id={`collapseComments-${post.idPostsInPublic}`}>
                                                        {post.commentList.map((data)=>{
                                                            return (
                                                                <div className="container border-top row" key={data.id}>
                                                                    <div className="col-3 col-lg-2 justify-content-center">
                                                                        <MakeProfilEmailNotShownAsLinkInComments data={data}/>
                                                                    </div>
                                                                    <div className="col-6 col-lg-8 d-flex justify-content-start flex-column">
                                                                        <h6 className="mt-2" style={{fontSize :"13px", textTransform :"capitalize"}}>{data.name}</h6>
                                                                        <p style={{fontSize :"13px"}} className="text text-dark">
                                                                        {data.comment}
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-3 col-lg-2 d-flex justify-content-start align-items-end flex-column">
                                                                        <div className="dateTimeAllDiv">
                                                                            {calc.CalcT(parseInt(data.year), parseInt(data.month), parseInt(data.day), parseInt(data.hour), parseInt(data.minute), parseInt(data.second))}
                                                                        </div>
                                                                        <ShowDropDownCommentOptionsReturn data={data}/>
                                                                        <div style={{marginTop :"40px"}} className="dropdown-content" id={`dropdownComment-${(data.id+parseInt(data.second))}`}>
                                                                            <li onClick={(e)=>deleteComment(parseInt(data.year), parseInt(data.month), parseInt(data.day), parseInt(data.hour), parseInt(data.minute), parseInt(data.second), data.postId)}>delete comment</li>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                                <div className="tab-pane" id="tab-4"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    )
}
export default OtherProfilToo;