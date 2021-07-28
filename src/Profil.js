import React, { useEffect, useState, useRef, useCallback } from "react"
import './Profil.css'
import Calc from './Calc.js'
import Resizer from "react-image-file-resizer"
import getCroppedImg from './CropImage'
import Copper from "react-easy-crop"
import Slider from "@material-ui/core/Slider"
import CircularProgress from "@material-ui/core/CircularProgress"
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import endpoint from "./EndPoint";
import Modal from "react-awesome-modal"
const Profil=()=>{
    // the date and the time in that app
    let dateTime=new Date();
    // part other related to the defination in that app for the time and the date in that app
    let calc=new Calc(dateTime.getFullYear(), (dateTime.getMonth()+1), dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds())
    // end of this date and the time
    const[visible, setVisible]=useState(false)
    const[visibleProgress, setVisibleProgress]=useState(false)
    const[visibleData, setVisibleData]=useState(false)
    const[visibleCrop, setVisibleCrop]=useState(false)
    const[visibleCropPost, setVisibleCropPost]=useState(false)
    const[visibleShare, setVisibleShare]=useState(false)
    const[visibleFollowers, setVisibleFollowers]=useState(false)
    const[visibleFollowing, setVisibleFollowing]=useState(false)
    const[data, setData]=useState([])
    const[ImagePostCrop, setImagePostCrop]=useState('')
    const[image_src, setImage_src]=useState()
    const[content, setContent]=useState('')
    const[posts, setPosts]=useState([])
    const[savedPosts, setSavedPosts]=useState([])
    const[pio, setPio]=useState('')
    const[email, setEmail]=useState('')
    const[name, setName]=useState('')
    const[userName, setUserName]=useState('')
    const[password, setPassword]=useState('')
    const[oldPassword, setOldPassword]=useState('')
    const[crop, setCrop]=useState({x:0, y:0})
    const[zoom, setZoom]=useState(1)
    const[croppedAreaPexels, setCroppedAreaPexels]=useState()
    const[croppedImage, setCroppedImage]=useState()
    const[profilImageUploadedNew, setProfilImageUploadedNew]=useState('')
    const[alertData, setAlertData]=useState([])
    const[comment, setComment]=useState('')
    const[postShared, setPostShared]=useState({})
    const[searchList, setSearchList]=useState([])
    const[followers, setFollowers]=useState([])
    const[following, setFollowing]=useState([])
    // const[search, setSearch]=useState('')
    let checkLogin=localStorage.getItem('email')
    const openModalFollowers=()=>{
        setVisibleFollowers(true)
    }
    const closeModalFollowers=()=>{
        setVisibleFollowers(false)
    }
    const openModalFollowing=()=>{
        setVisibleFollowing(true)
    }
    const closeModalFollowing=()=>{
        setVisibleFollowing(false)
    }
    const openModalShare=()=>{
        setVisibleShare(true)
    }
    const closeModalShare=()=>{
        setVisibleShare(false)
    }
    const openModalCropPost=()=>{
        setVisibleCropPost(true)
    }
    const closeModalCropPost=()=>{
        setVisibleCropPost(false)
    }
    const openModalCrop=()=>{
        setVisibleCrop(true)
    }
    const closeModalCropUploadBtn=()=>{
        setVisibleCrop(false)
    }
    const closeModalCropCloseBtn=()=>{
        setVisibleCrop(false)
        // let profilImage=document.getElementsByClassName('profilImageUploaded')
        // profilImage[0].src=img1
    }
    const openModalData=()=>{
        setVisibleData(true)
    }
    const closeModalData=()=>{
        setVisibleData(false)
        setAlertData([])
    }
    const openModalProgress=()=>{
        setVisibleProgress(true)
    }
    const closeModalProgess=()=>{
        setVisibleProgress(false)
    }
    const openModal=()=>{
        setVisible(true)
    }
    const closeModal=()=>{
        setVisible(false)
        setImagePostCrop('')
        setContent('')
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
    const getSavedPosts=async()=>{
        const response=await fetch('getsavedposts/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
            })
        })
        const data=await response.json();
        setSavedPosts(data)
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
                if (data.email==checkLogin){
                    likeBtn.className="col-4 likeBtn text-primary"
                }
                else {
                    likeBtn.className="col-4 likeBtn text-danger"
                }
            })
        })
        savedPosts.map((post)=>{
            const likeBtn=document.querySelector(`#postSaved-${post.idPostsInPublic} ul .likeBtn`)
            likeBtn.className="col-4 likeBtn text-danger"
            post.likesList.map((data)=>{
                if (data.email==checkLogin){
                    likeBtn.className="col-4 likeBtn text-primary"
                }
                else {
                    likeBtn.className="col-4 likeBtn text-danger"
                }
            })
        })
    }
    const onCropComplete=useCallback((croppedArea, croppedAreaPexels)=>{
        console.log(croppedAreaPexels.width)
        setCroppedAreaPexels(croppedAreaPexels)
        console.log(croppedAreaPexels)
        console.log(crop)
    })
    const changeProfilImage=(e)=>{
        const [file]=e.target.files;
        const reader=new FileReader();
        Resizer.imageFileResizer(
            file,
            500,
            500,
            "JPEG",
            10000,
            0,
            async(uri)=>{
                setProfilImageUploadedNew(uri)
            },
            "base64"
        )
        reader.readAsDataURL(file)
        openModalCrop();
    }
    const uploadImagePost=(e)=>{
        const [file]=e.target.files;
        Resizer.imageFileResizer(
            file,
            1000,
            1000,
            "JPEG",
            1000,
            0,
            async(uri)=>{
                setImage_src(uri)
            },
            "base64"
        )
        openModalCropPost();
    }
    const uploadCroppedImagePost=useCallback(async ()=>{
        try {
            const croppedImage=await 
            getCroppedImg(
                image_src,
                croppedAreaPexels
            )
            setImagePostCrop(croppedImage)
        } catch(e) {
            console.error(e)
        }
        closeModalCropPost();
    })
    const uploadCroppedImage=useCallback(async ()=>{
        try {
            const croppedImage=await 
            getCroppedImg(
                profilImageUploadedNew,
                croppedAreaPexels
            )
            setCroppedImage(croppedImage)
            const response=await fetch('editprofilimage/', {
                method :"POST",
                headers :{
                    "Content-Type" :"application/json"
                },
                body :JSON.stringify({
                    email :checkLogin,
                    newprofilimage :croppedImage,
                })
            })
            const data=await response.json();
            setAlertData(data)
        } catch(e) {
            console.error(e)
        }
        closeModalCropUploadBtn();
    })
    const addPost=async(e)=>{
        openModalProgress();
        closeModal();
        const response=await fetch('addpost/', {
            method :"POST",
            headers :{
                "Content-Type" :"appliaction/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                content :content,
                image_src :ImagePostCrop
            })
        })
        const data=await response.json();
        console.log(data)
        setContent('')
        setImage_src('')
        closeModalProgess();
        setAlertData([])
    }
    const editName=async(e)=>{
        e.preventDefault();
        const response=await fetch('editname/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                newname :name,
                password :oldPassword
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData(data)
        setName('')
        setOldPassword('')
    }
    const editEmail=async(e)=>{
        e.preventDefault();
        const response=await fetch('editemail/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                newemail :email,
                password :oldPassword
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData(data)
        setEmail('')
        setOldPassword('')
    }
    const editUserName=async(e)=>{
        e.preventDefault();
        const response=await fetch('editusername/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                newusername :userName,
                password :oldPassword
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData(data)
        setUserName('')
        setOldPassword('')
    }
    const editPio=async(e)=>{
        e.preventDefault();
        const response=await fetch('editpio/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                newpio :pio,
                password :oldPassword
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData(data)
        setPio('')
        setOldPassword('')
    }
    const editPassword=async(e)=>{
        e.preventDefault();
        const response=await fetch('editpassword/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                oldpassword :oldPassword,
                newpassword :password
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData(data)
        setOldPassword('')
        setPassword('')
    }
    // this the part related to the posts processing in that app while the commenting and the liking and the sharing 
    const AddComment=async(postId, emailOwnerPost)=>{
        const response=await fetch('addcomment/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
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
                email :checkLogin,
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
    const showDropDownSavedPosts=(postId)=>{
        const dropDownEl=document.getElementById('dropdownSavedPosts-'+postId)
        const activeDropDown=document.getElementsByClassName("activeDropDown")
        if (activeDropDown[0]==undefined) {
            dropDownEl.classList.add('activeDropDown')
        }
        else {
            activeDropDown[0].classList.remove('activeDropDown')
        }
    }
    const deletPost=async(postId)=>{
        const response=await fetch('deletepost/', {
            method :"POST",
            headers :{
                "Content-Type" :"applicaction/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                post_id :postId
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData([])
    }
    // here is a problem with the id and the pio in that app the is is any time and in any post is the third
        // this the part related to the show the input that is used to edit the post in that app
    const closeFormEditPostSavedWidthId=(post_id)=>{
        const formEditPost=document.getElementById(`formEditPostSaved-${post_id}`)
        formEditPost.classList.remove('activeFormEditPostSaved')
    }
    const closeFormEditPostWidthId=(post_id)=>{
        const formEditPost=document.getElementById(`formEditPost-${post_id}`)
        formEditPost.classList.remove('activeFormEditPost')
    }
    const editPostInputShowSaved=(post_id)=>{
        const formEditPost=document.getElementById(`formEditPostSaved-${post_id}`)
        const activeFormEditPost=document.getElementsByClassName('activeFormEditPostSaved')
        if (activeFormEditPost[0]==undefined) {
            formEditPost.classList.add('activeFormEditPostSaved')
        }
        else {
            formEditPost.classList.remove('activeFormEditPostSaved')
            formEditPost.classList.add('activeFormEditPostSaved')
        }
    }
    const editPostInputShow=(post_id)=>{
        const formEditPost=document.getElementById(`formEditPost-${post_id}`)
        const activeFormEditPost=document.getElementsByClassName('activeFormEditPost')
        if (activeFormEditPost[0]==undefined) {
            formEditPost.classList.add('activeFormEditPost')
        }
        else {
            formEditPost.classList.remove('activeFormEditPost')
            formEditPost.classList.add('activeFormEditPost')
        }
    }
    const editPost=async(postId)=>{
        const response=await fetch('editpost/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                post_id :postId,
                newpio :content,
            })
        })
        const data=await response.json();
        console.log(data)
        setContent('')
        closeFormEditPostWidthId(postId)
        setAlertData([])
    }
    // end of that problem 
    const savePost=async(postId)=>{
        const response=await fetch('savepost/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                post_id :postId
            })
        })
        const data=await response.json();
        console.log(data)
        setAlertData([])
    }
    const unSavePostSavePosts=async(postId)=>{
        const response=await fetch('savepost/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
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
                if (data.emailSaving==checkLogin) {
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
                email :checkLogin,
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
    const modifyLengthFunctionSaved=(el, postId)=>{
        const activeShowMoreBtn=document.getElementsByClassName('activeShowMoreBtnSaved')
        const postText=document.querySelector(`#postSaved-${postId} header .postPio`)
        if (activeShowMoreBtn[0]==undefined) {
            savedPosts.map((post)=>{
                if (post.idPostsInPublic==postId) {
                    postText.innerHTML=post.pio;
                }
            })
            el.classList.add('activeShowMoreBtnSaved')
            el.innerHTML="show less .."
        }
        else {
            if (el==activeShowMoreBtn[0]) {
                savedPosts.map((post)=>{
                    if (post.idPostsInPublic==postId) {
                        postText.innerHTML=post.pio;
                    }
                })
                let Mlength=postText.innerHTML.substring(0, 150)
                postText.innerHTML=Mlength;
                // postText.innerHTML.substr(0, 150)
                activeShowMoreBtn[0].innerHTML="show more .."
                activeShowMoreBtn[0].classList.remove('activeShowMoreBtnSaved')
            }
            else {
                savedPosts.map((post)=>{
                    if (post.idPostsInPublic==postId) {
                        postText.innerHTML=post.pio;
                    }
                })
                el.classList.add('activeShowMoreBtnSaved')
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
        let maxLength=150;
        // a next part 
        try {
            const postPio=document.querySelector(`#postScrollY-${postShared.idPostsInPublic} header .postPio`)
            if (postPio.innerHTML.length <= 70) {
            }
            else {
                let Mlength=postPio.innerHTML.substr(0, 70)
                postPio.innerHTML=Mlength;
            }
        } catch(e) {
        }
        // end of this part
        posts.map((post)=>{
            const postText=document.querySelector(`#post-${post.idPostsInPublic} header .postPio`)
            if (post.pio.length <= 150){
                const showMoreBtn=document.querySelector(`#post-${post.idPostsInPublic} header .showMoreBtn`)
                showMoreBtn.style.display="none"
            }
            else {
                const showMoreBtn=document.querySelector(`#post-${post.idPostsInPublic} header .showMoreBtn`)
                showMoreBtn.style.display="block"
                let Mlength=postText.innerHTML.substr(0, 150)
                postText.innerHTML=Mlength;
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
        // this the part of modifying the length of the saved posts in that app
        savedPosts.map((post)=>{
            const postText=document.querySelector(`#postSaved-${post.idPostsInPublic} header .postPio`)
            if (post.pio.length <= 150){
                const showMoreBtn=document.querySelector(`#postSaved-${post.idPostsInPublic} header .showMoreBtn`)
                showMoreBtn.style.display="none"
            }
            else {
                const showMoreBtn=document.querySelector(`#postSaved-${post.idPostsInPublic} header .showMoreBtn`)
                showMoreBtn.style.display="block"
                let Mlength=postText.innerHTML.substr(0, 150)
                postText.innerHTML=Mlength;
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
        // end of that part
    }
    const GetSharedState=({post})=>{
        if (post.sharedState=="true") {
            return (
                    <div className="shared_post container border-top" id={`shared_post-${post.idPostsInPublic}`} style={{}}>
                        <div className="calc-date-time position-absolute mr-2 mt-2" style={{right :"0"}}>
                            {calc.CalcT(post.postSharedYear, post.postSharedMonth, post.postSharedDay, post.postSharedHour, post.postSharedMinute , post.postSharedSecond)}
                        </div>
                        <header className="d-flex flex-row align-items-center w-100 justify-content-start pb-2">
                            <img src={post.postSharedProfilImage}/>
                            <h5 className="ml-2" style={{fontSize :"18px"}}>{post.postSharedName}</h5>
                        </header>
                        <Link to={`/post-${post.postSharedId}`}><i className="fa fa-paper-plane-o" aria-hidden="true"></i></Link>
                        <section>
                            <p className="text text-dark text-center ml-5">{post.postSharedPio}...........</p>
                            <img  className="img-fluid imageHover" src={post.postSharedImage}/>
                        </section>
                    </div>
                
            )
        }
        else {
            return <div style={{display :"none"}}></div>
        }
    }
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
                        <li key={data.id} className="nav-item border" style={{zIndex :"2"}}><Link to={`profil-${data.email}`} className="nav-link d-flex flex-row"><img className="img-fluid"  style={{width :"50px",}} src={data.profilimage}/><p className="text-dark text-center">{data.name}</p></Link></li>
                    )
                })
            )
        }
        else {
            return ""
        }
    },[searchList])
    const MakeProfilEmailNotShownAsLink=({post})=>{
        if (post.email!=checkLogin) return (
            <Link to={`profil-${post.email}`}>
                <img src={post.profilImage} className="img-fluid"/>
            </Link>
        )
        else {
            return <img src={post.profilImage} className="img-fluid"/>
        }
    }
    const showDropDownCommentSavedOptions=(postId)=>{
        const dropDownEl=document.getElementById('dropdownComment-saved-'+postId)
        const activeDropDown=document.getElementsByClassName("activeDropDownSavedComment")
        if (activeDropDown[0]==undefined) {
            dropDownEl.classList.add('activeDropDownSavedComment')
        }
        else {
            activeDropDown[0].classList.remove('activeDropDownSavedComment')
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
    const MakeProfilEmailNotShownAsLinkInComments=({data})=>{
        if (data.email==checkLogin) return <img style={{ borderRadius :"50%"}} className="img-fluid mt-2" src={data.profilImage}/>
        else {
            return <Link to={`profil-${data.email}`}>
                <img style={{ borderRadius :"50%"}} className="img-fluid mt-2" src={data.profilImage}/>
            </Link>
        }
    }
    const ShowDropDownCommentOptionsSavedReturn=({data})=>{
        if (data.email==checkLogin) return( 
            <i style={{cursor :"pointer"}} onClick={(e)=>showDropDownCommentSavedOptions((data.id+parseInt(data.second)))} className="fa fa-ellipsis-v" aria-hidden="true"></i>
        )
        else return ""
    }
    const ShowDropDownCommentOptionsReturn=({data})=>{
        if (data.email==checkLogin) return( 
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
                email :checkLogin,
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
        setAlertData([])
    }
    // this the part of getting the followers of the perosn in that app
    const getFollowersPersons=async()=>{
        const response=await fetch('getfollowers/', {
            method :"POST",
            headers :{
                "Content-TYpe" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin
            })
        })
        const data=await response.json();
        console.log(data)
        setFollowers(data)
        openModalFollowers();
    }
    const getFollowngPersons=async()=>{
        const response=await fetch('getfollowing/', {
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
        setFollowing(data)
        openModalFollowing();
    }
    const getFollowingEmails=async(id, email)=>{
        console.log(id, email)
        const response=await fetch('getfollowingemails/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :email,
                email_following :checkLogin
            })
        })
        const data=await response.json();
        console.log(data)
        if (data.state) {
            try {
                const followBtn=document.querySelector(`#follower-${id} .followBtn`)
                followBtn.innerHTML="unFollow"
                followBtn.className="btn btn-white border followBtn"
            } catch(e) {}
            // part of the following not followers
            try {
                const followBtn=document.querySelector(`#following-${id} .followBtn`)
                followBtn.innerHTML="unFollow"
                followBtn.className="btn btn-white border followBtn"
            } catch(e) {}
            // end of this part of the app
        }
        else {
            try {
                const followBtn=document.querySelector(`#follower-${id} .followBtn`)
                followBtn.innerHTML="Follow"
                followBtn.className="btn btn-primary followBtn"
            } catch(e) {}
            // part of the following not followers
            try {
                const followBtn=document.querySelector(`#following-${id} .followBtn`)
                followBtn.innerHTML="Follow"
                followBtn.className="btn btn-primary followBtn"
            } catch(e) {}
            // end of this part of the app
        }
    }
    const followFunction=async(email, id)=>{
        const response=await fetch('follow/', {
            method :"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body :JSON.stringify({
                email :checkLogin,
                email_wanted_to_follow :email,
            })
        })
        const data=await response.json();
        console.log(data)
        getFollowingEmails(id, email)
    }
    const GetComponentFollowing=()=>{
        return (
            <div className="ulScrollY">
                {following.map((data)=>{
                    getFollowingEmails(data.id, data.email);
                    return (
                        <ul key={data.id} className="w-100 container ulScrollYContainerSmall">
                            <li className="w-100 list-unstyled border-bottom d-flex justify-content-between flex-row align-items-center" id={`following-${data.id}`}>
                                <Link className="d-flex flex-row align-items-center pt-1 pb-1" to={`profil-${data.email}`}>
                                    <img className="img-fluid" style={{width:"70px", borderRadius :"50%"}} src={data.profilimage}/>
                                    <p style={{textTransform :"capitalize"}} className="ml-2 text-dark">{data.name}</p>
                                </Link>
                                <button className="btn btn-primary h-50 followBtn" onClick={(e)=>{followFunction(data.email, data.id)}}>Follow</button>
                            </li>
                        </ul>
                    )
                })}
            </div>
        )
    }
    const GetComponentFollowersTop=()=>{
        return (
            <div className="ulScrollY">
                {followers.map((data)=>{
                    getFollowingEmails(data.id, data.email);
                    return (
                        <ul key={data.id} className="w-100 container ulScrollYContainerSmall">
                            <li className="w-100 list-unstyled border-bottom d-flex justify-content-between flex-row align-items-center" id={`follower-${data.id}`}>
                                <Link className="d-flex flex-row align-items-center pt-1 pb-1" to={`profil-${data.email}`}>
                                    <img className="img-fluid" style={{width:"70px", borderRadius :"50%"}} src={data.profilimage}/>
                                    <p style={{textTransform :"capitalize"}} className="ml-2 text-dark">{data.name}</p>
                                </Link>
                                <button className="btn btn-primary h-50 followBtn" onClick={(e)=>{followFunction(data.email, data.id)}}>Follow</button>
                            </li>
                        </ul>
                    )
                })}
            </div>
            
        )
    }
    useEffect(()=>{
        getData();
        getPosts();
        getSavedPosts();
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
    },[posts, savedPosts, postShared])
    if (checkLogin==null) return (<Redirect to="login"/>)
    return (
        <div>
            <nav className="navbar navbar-expand-lg header-website  bg-white">
                <Link to="/profil" className="navbar-brand text-dark">Social App</Link>
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
                            <div className="profil-section-header mr-lg-5 row d-lg-flex flex-lg-row justify-content-lg-center" key={res.id}>
                                <div className="col-lg-4 profil-image d-flex justify-content-center justify-content-lg-end">
                                    <img className="mr-lg-5" src={res.profilimage}/>
                                </div>
                                <div className="col-lg-4 profil-data d-flex flex-column justify-content-center">
                                    <section className="mt-lg-3 order-lg-1 order-1 ">
                                        <h2>{res.username}</h2>
                                        <i style={{cursor :"pointer"}} className="fa fa-plus mr-lg-3 ml-lg-1 border rounded p-1" aria-hidden="true" onClick={openModal}></i>
                                        <Link className="btn border" onClick={openModalData} to="/profil">Edit Profil</Link>
                                    </section>
                                    {/* this the modal of the post_shared in that app  */}
                                    <Modal visible={visibleShare} width="400px" height="auto" effect="fadeInUp" onClickAway={closeModalShare}>
                                        <div className="post container postScrollYClass" id={`postScrollY-${postShared.idPostsInPublic}`}>
                                            <div className="d-flex justify-content-start align-items-center flex-row">
                                                <img style={{width :"50px", borderRadius :"50%"}} src={res.profilimage}/>
                                                <h5 style={{textTransform :"capitalize", fontSize :"17px"}} className="ml-2">{res.name}</h5>
                                            </div>
                                            <textarea className="form-control border-0 mt-1" placeholder="post content ...." rows="1" onChange={(e)=>setPio(e.target.value)} value={pio}/>
                                            <hr />
                                            <header>
                                                <img style={{width :"50px"}} src={postShared.profilImage} className="img-fluid"/>
                                                <h4>mohamed sayed</h4>
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
                                    <Modal visible={visibleData} width="500px" onClickAway={closeModalData}>
                                        <div className="container">
                                            <i style={{cursor :"pointer", fontSize :"14px"}} onClick={closeModalData} className="fa fa-times text-muted" aria-hidden="true"></i>
                                            <section className="border-top pt-2 border-bottom pb-2">
                                                <img className='profilImageUploaded'  src={res.profilimage} style={{width :"200px"}}/>
                                                <div className="btn btn-primary upload-image-div">
                                                    <span>change image</span>
                                                    <input className="upload-image-inp" type="file" onChange={changeProfilImage}/>
                                                </div>
                                            </section>
                                            <div className="tabs row" id="tabs">
                                                <div className="col-4">
                                                    <ul className="nav nav-tabs d-flex flex-column border-right">
                                                        <li className="nav-item border-bottom"><Link to="/profil" className="nav-link active show" data-toggle="tab" data-target="#tab-name">Name</Link></li>
                                                        <li className="nav-item border-bottom"><Link to="/profil" className="nav-link" data-toggle="tab" data-target="#tab-username">UserName</Link></li>
                                                        <li className="nav-item border-bottom"><Link to="/profil" className="nav-link" data-toggle="tab" data-target="#tab-pio">Pio</Link></li>
                                                        <li className="nav-item border-bottom"><Link to="/profil" className="nav-link" data-toggle="tab" data-target="#tab-email">Email</Link></li>
                                                        <li className="nav-item border-bottom"><Link to="/profil" className="nav-link" data-toggle="tab" data-target="#tab-password">password</Link></li>
                                                    </ul>
                                                </div>
                                                <div className="tab-content d-flex justify-content-center align-items-center col-8 flex-column">
                                                <h2 className="mb-4"><i className="fa fa-cogs text-primary" aria-hidden="true"></i></h2>
                                                    <form onSubmit={editName} className="tab-pane active" id="tab-name">
                                                        <input required className="form-control" placeholder="new name :" onChange={(e)=>{setName(e.target.value)}} value={name}/>
                                                        <input maxLength="15" required className="form-control mt-1" type="password" placeholder="type your password :" onChange={(e)=>{setOldPassword(e.target.value)}}/>
                                                        <center><button className="btn btn-primary mt-1">save</button></center>
                                                    </form>
                                                    <form onSubmit={editUserName} className="tab-pane" id="tab-username">
                                                        <input maxLength="15" required className="form-control" placeholder="new username :" value={userName} onChange={(e)=>{setUserName(e.target.value)}}/>
                                                        <input required className="form-control mt-1" type="password" placeholder="type your password :" onChange={(e)=>{setOldPassword(e.target.value)}}/>
                                                        <center><button className="btn btn-primary mt-1">save</button></center>
                                                    </form>
                                                    <form onSubmit={editPio} className="tab-pane" id="tab-pio">
                                                        <input maxLength="20" required className="form-control" placeholder="new pio :" value={pio} onChange={(e)=>{setPio(e.target.value)}}/>
                                                        <input required className="form-control mt-1" type="password" placeholder="type your password :" onChange={(e)=>{setOldPassword(e.target.value)}}/>
                                                        <center><button className="btn btn-primary mt-1">save</button></center>
                                                    </form>
                                                    <form onSubmit={editEmail} className="tab-pane" id="tab-email">
                                                        <input maxLength="15" required className="form-control" placeholder="new email :" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                                                        <input required className="form-control mt-1" type="password" placeholder="type your password :" onChange={(e)=>{setOldPassword(e.target.value)}}/>
                                                        <center><button className="btn btn-primary mt-1">save</button></center>
                                                    </form>
                                                    <form onSubmit={editPassword} className="tab-pane" id="tab-password">
                                                        <input required className="form-control" placeholder="old password :" value={oldPassword}onChange={(e)=>{setOldPassword(e.target.value)}}/>
                                                        <input required className="form-control mt-1" placeholder="new password :" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                                                        <center><button className="btn btn-primary mt-1">save</button></center>
                                                    </form>
                                                </div>
                                            </div>
                                            {alertData.map((data)=>{
                                                if (data.state) return (
                                                    <div key="0" className="alert alert-success alertt-dismissible fade show" role="alert">
                                                        <p className="text-success w-75 position-relative">{data.proccess}</p>
                                                        <button className="close position-absolute" type="button" style={{right :"2%", bottom :"45%"}} data-dismiss="alert"aria-label="Close">
                                                            <span onClick={(e)=>setAlertData([])} aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                )
                                                else return(
                                                    <div key="1" className="alert alert-danger alertt-dismissible fade show" role="alert">
                                                        <p className="text text-dark">{data.proccess}</p>
                                                        <button style={{right :"2%", bottom :"45%"}} className="close position-absolute" type="button" data-dismiss="alert"aria-label="Close">
                                                            <span onClick={(e)=>setAlertData([])} aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </Modal>
                                    {/* end of this part of the app */}
                                    {/* part related to the crop image in that app */}
                                    <Modal visible={visibleCrop} width="500px" height="600px" onClickAway={closeModalCropCloseBtn} effect="fadeInUp">
                                        <Copper
                                            image={profilImageUploadedNew}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1/1}
                                            style ={{cropAreaStyle: {width :"100px", height :"100px"} }}
                                            onCropComplete={onCropComplete}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                        />
                                        <div className="zoom-sec">
                                            <span className="position-absolute ml-2">Zoom</span>
                                            <Slider 
                                                value={zoom}
                                                min={1}
                                                max={3}
                                                step={.1}
                                                className="ml-5 position-absolute w-75"
                                                onChange={(e, zoom)=>setZoom(zoom)}
                                            />
                                        </div>
                                        <button onClick={uploadCroppedImage} className="btn btn-primary order-2 position-absolute mb-2 ml-2" style={{bottom :"0"}}>upload</button>
                                        <button className="btn btn-danger position-absolute mr-2 mb-2" style={{bottom :"0",right :"0"}} onClick={closeModalCropCloseBtn}>close</button>
                                    </Modal>
                                    {/* end of this part of that app  */}
                                    <section className="mt-lg-3 order-lg-3 order-4">
                                        <p>{posts.length} posts </p>
                                        <p style={{cursor :"pointer"}} onClick={getFollowersPersons}>{res.followers} followers</p>
                                        <p style={{cursor :"pointer"}} onClick={getFollowngPersons}>{res.following} following</p>
                                    </section>
                                    {/* part of opening the followers part in that app of the followers modal in that app */}
                                    <Modal visible={visibleFollowers} width="400px" height="auto" onClickAway={closeModalFollowers} effect="fadeInUp">
                                        <GetComponentFollowersTop />
                                    </Modal>
                                    {/* end of this part of that app */}
                                    {/* part of opening the modal of the followers part in that app */}
                                    <Modal visible={visibleFollowing} width="400px" height="auto" onClickAway={closeModalFollowing} effect="fadeInUp">
                                        <GetComponentFollowing />
                                    </Modal>
                                    {/* end of that part in that app */}
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
                    <Modal className="modal-one"  visible={visible} effect="fadeInUp" width="500px" height="auto"   onClickAway={closeModal}>
                        <div id="editModal">
                            <div className="container">
                                <div className='row border-bottom pb-2'>
                                    <div className="col-lg-12 d-flex justify-content-end align-items-center">
                                        <i style={{cursor :"pointer", fontSize :"14px"}} onClick={closeModal} className="fa fa-times text-muted" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <textarea onChange={(e)=>{setContent(e.target.value)}} id="content" className="form-control" placeholder="what do you think .."  id="form-content" value={content}></textarea>
                            <div className="formUpload btn">
                                <i className="fa fa-picture-o text-primary" style={{fontSize:"18px"}} aria-hidden="true"></i>
                                <input className="upload" type="file" onChange={uploadImagePost}/>
                            </div>
                            <img className="imageShow" src={ImagePostCrop}/>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12 d-flex justify-content-end mt-1">
                                        <button className="btn btn-primary" onClick={addPost}>POST</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <Modal visible={visibleCropPost} width="500px" height="600px" effect="fadeInUp" onClickAway={closeModalCropPost}>
                        <Copper
                            image={image_src}
                            crop={crop}
                            zoom={zoom}
                            aspect={4/3}
                            style ={{cropAreaStyle: {width :"200px", height :"200px"} }}
                            onCropComplete={onCropComplete}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                        />
                        <div className="zoom-sec">
                            <span className="position-absolute ml-2">Zoom</span>
                            <Slider 
                                value={zoom}
                                min={1}
                                max={3}
                                step={.1}
                                className="ml-5 position-absolute w-75"
                                onChange={(e, zoom)=>setZoom(zoom)}
                            />
                        </div>
                        <button onClick={uploadCroppedImagePost} className="btn btn-primary order-2 position-absolute mb-2 ml-2" style={{bottom :"0"}}>upload</button>
                        <button className="btn btn-danger position-absolute mr-2 mb-2" style={{bottom :"0",right :"0"}} onClick={closeModalCropPost}>close</button>
                    </Modal>
                    {/* end of the modal in that app the modal related to the post add */}
                    {/* this the section of the progress in that app */}
                    <Modal visible={visibleProgress} width="400px" height="200px" effect="fadeInUp" onClickAway={closeModalProgess}>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 d-flex justify-content-center align-items-center p-5" style={{fontSize:"20px"}}>
                                    Loading.....<CircularProgress className="ml-3" />
                                </div>
                            </div>
                        </div>
                    </Modal>
                    {/* end of that try of the modal */}
                    {/* this the style of the tabs section  */}
                    <section className="tabs">
                        <div className="container justify-content-center align-items-center flex-column d-flex">
                            <ul className="nav nav-tabs justify-content-center align-items-center" id="tabs-list">
                                <li className="nav-item"><Link to="/profil" className="nav-link active show" data-toggle="tab" data-target="#tab-posts"><span className="fi-grid-three-up"></span>POSTS</Link></li>
                                <li className="nav-item"><Link to="/profil" className="nav-link" data-toggle="tab" data-target="#tab-2"><span className="fi-bookmark"></span>SAVED</Link></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="tab-posts">
                                    {posts.map((post)=>{
                                            return (
                                                <div style={{minWidth :"200px", maxWidth :"540px"}} key={post.idPostsInPublic} className="post" id={`post-${post.idPostsInPublic}`}>
                                                    <div style={{position :"absolute", right :"0",
                                                    left :"0", marginTop :"15px", marginLeft :"5px"}}>{calc.CalcT(parseInt(post.year), parseInt(post.month), parseInt(post.day), parseInt(post.hour), parseInt(post.minute), parseInt(post.second))}</div>
                                                    <div className="dropdownO">
                                                        <i onClick={(e)=>showDropDown(post.idPostsInPublic)} className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                        <div id={`dropdown-${post.idPostsInPublic}`} className="dropdown-content">
                                                            <li onClick={(e)=>deletPost(post.idPostsInPublic)}>delete post</li>
                                                            <li onClick={(e)=>editPostInputShow(post.idPostsInPublic)}>edit post</li>
                                                            <li id={`savePostBtn-${post.idPostsInPublic}`} onClick={(e)=>savePost(post.idPostsInPublic)}>save post</li>
                                                        </div>
                                                    </div>
                                                    <header>
                                                        <MakeProfilEmailNotShownAsLink post={post}/>
                                                        <h4>{post.name}</h4>
                                                        <p className="postPio">{post.pio}</p>
                                                        <p className="showMoreBtn" onClick={(e)=>{modifyLengthFunction(e.target, post.idPostsInPublic)}}>show more ..</p>
                                                        <form className="form-group w-100 justify-content-center form-inline border pt-2 pb-2 formEditPost" id={`formEditPost-${post.idPostsInPublic}`}  onSubmit={(e)=>{e.preventDefault();editPost(post.idPostsInPublic)}}>
                                                            <i onClick={(e)=>closeFormEditPostWidthId(post.idPostsInPublic)} id="closeBtnFormEditPost" className="fa fa-close position-absolute ml-1 mb-5" style={{left :"0", cursor :"pointer", fontSize :"18px"}} aria-hidden="true"></i>
                                                            <textarea required onChange={(e)=>{setContent(e.target.value)}} className="form-control border w-75" placeholder={post.pio} value={content}></textarea>
                                                            <button className="btn btn-primary ml-1">save </button>
                                                        </form>
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
                                                            <input onChange={(e)=>{setComment(e.target.value)}} required value={comment} placeholder="type the new comment :" className="form-control w-75"/>
                                                            <button className="btn btn-primary ml-2">comment</button>
                                                            </div>
                                                    </form>
                                                    <div className="collapse" style={{maxHeight :"200px", overflowY :"scroll"}} id={`collapseComments-${post.idPostsInPublic}`}>
                                                        {post.commentList.map((data)=>{
                                                            return (
                                                                <div className="container border-top row" key={data.id}>
                                                                    <div className="col-3 justify-content-center">
                                                                        <MakeProfilEmailNotShownAsLinkInComments data={data}/>
                                                                    </div>
                                                                    <div className="col-6 d-flex justify-content-start flex-column">
                                                                        <h6 className="mt-2" style={{fontSize :"13px", textTransform :"capitalize"}}>{data.name}</h6>
                                                                        <p style={{fontSize :"13px"}} className="text text-dark">
                                                                        {data.comment}
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-3 d-flex justify-content-start align-items-end flex-column">
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
                                <div className="tab-pane" id="tab-2">
                                    {savedPosts.map((post)=>{
                                            return (
                                                <div style={{minWidth :"200px", maxWidth :"540px"}} key={post.idPostsInPublic} className="post border rounded" id={`postSaved-${post.idPostsInPublic}`}>
                                                    <div style={{position :"absolute", right :"0",
                                                    left :"0", marginTop :"15px", marginLeft :"5px"}}>{calc.CalcT(parseInt(post.year), parseInt(post.month), parseInt(post.day), parseInt(post.hour), parseInt(post.minute), parseInt(post.second))}</div>
                                                    <div className="dropdownO">
                                                        <i onClick={(e)=>showDropDownSavedPosts(post.idPostsInPublic)} className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                        <div id={`dropdownSavedPosts-${post.idPostsInPublic}`} className="dropdown-content">
                                                            <li onClick={(e)=>deletPost(post.idPostsInPublic)}>delete post</li>
                                                            <li onClick={(e)=>editPostInputShowSaved(post.idPostsInPublic)}>edit post</li>
                                                            <li id={`savePostBtn-${post.idPostsInPublic}`} onClick={(e)=>unSavePostSavePosts(post.idPostsInPublic)}>unsave</li>
                                                        </div>
                                                    </div>
                                                    <header>
                                                        <MakeProfilEmailNotShownAsLink post={post}/>
                                                        <h4>{post.name}</h4>
                                                        <p className="postPio">{post.pio}</p>
                                                        <p className="showMoreBtn" onClick={(e)=>{modifyLengthFunctionSaved(e.target, post.idPostsInPublic)}}>show more ..</p>
                                                        <form className="form-group w-100 justify-content-center form-inline border pt-2 pb-2 formEditPost" id={`formEditPostSaved-${post.idPostsInPublic}`}  onSubmit={(e)=>{e.preventDefault();editPost(post.idPostsInPublic)}}>
                                                            <i onClick={(e)=>closeFormEditPostSavedWidthId(post.idPostsInPublic)} id="closeBtnFormEditPost" className="fa fa-close position-absolute ml-1 mb-5" style={{left :"0", cursor :"pointer", fontSize :"18px"}} aria-hidden="true"></i>
                                                            <textarea onChange={(e)=>setContent(e.target.value)} className="form-control border w-75" placeholder={post.pio}  value={content}></textarea>
                                                            <button className="btn btn-primary ml-1">save </button>
                                                        </form>
                                                    </header>
                                                    <section>
                                                        <img src={post.image} className="img-fluid"/>
                                                    </section>
                                                    <GetSharedState post={post}/>
                                                    <ul className="row" id="l-c-s">
                                                        <li onClick={(e)=>addLike(post.email, post.idPostsInPublic, e.currentTarget)} className="col-4 likeBtn">{post.likes}<i className="fa fa-heart" aria-hidden="true"></i></li>
                                                        <li  data-toggle="collapse" data-target={`#collapseComments-${post.idPostsInPublic}`} className="col-4">{post.comments}<i className="fa fa-comment-o" aria-hidden="true"></i></li>
                                                        <li onClick={(e)=>{setPostShared(post); openModalShare(post.idPostsInPublic);}} className="col-4 border-0">{post.shares}<i className="fa fa-share" aria-hidden="true"></i></li>
                                                    </ul>
                                                    <form onSubmit={(e)=>{e.preventDefault();AddComment(post.idPostsInPublic, post.email)}} className="form form-inline w-100 pt-2 pb-2 border-top">
                                                        <div className="container  d-flex justify-content-center">
                                                            <input onChange={(e)=>{setComment(e.target.value)}} required value={comment} placeholder="type the new comment :" className="form-control w-75"/>
                                                            <button className="btn btn-primary ml-2">comment</button>
                                                            </div>
                                                    </form>
                                                    <div className="collapse" style={{maxHeight :"200px", overflowY :"scroll"}} id={`collapseComments-${post.idPostsInPublic}`}>
                                                        {post.commentList.map((data)=>{
                                                            return (
                                                                <div className="container border-top row" key={data.id}>
                                                                    <div className="col-2 justify-content-center">
                                                                        <MakeProfilEmailNotShownAsLinkInComments data={data}/>
                                                                    </div>
                                                                    <div className="col-8 d-flex justify-content-start flex-column">
                                                                        <h6 className="mt-2">{data.name}</h6>
                                                                        <p className="text text-dark">
                                                                        {data.comment}
                                                                        </p>
                                                                    </div>
                                                                    <div className="col-2 d-flex justify-content-start align-items-end flex-column">
                                                                        <div className="dateTimeAllDiv">
                                                                            {calc.CalcT(parseInt(data.year), parseInt(data.month), parseInt(data.day), parseInt(data.hour), parseInt(data.minute), parseInt(data.second))}
                                                                        </div>
                                                                        <ShowDropDownCommentOptionsSavedReturn data={data}/>
                                                                        <div style={{marginTop :"40px"}} className="dropdown-content" id={`dropdownComment-saved-${(data.id+parseInt(data.second))}`}>
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
                                <div className="tab-pane" id="tab-3"></div>
                                <div className="tab-pane" id="tab-4"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </div>
    )
}
export default Profil;