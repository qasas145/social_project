import React, { useCallback, useEffect, useState } from "react"
import endpoint from "./EndPoint"
import './Login.css'
import { Link, Redirect } from "react-router-dom";
import AOS from "aos"
import Resizer from "react-image-file-resizer"
import getCroppedImg from './CropImage'
import Modal from "react-awesome-modal"
import Copper from "react-easy-crop"
import Slider from "@material-ui/core/Slider"
AOS.init({
    easing :"swing"
});
const Signup=()=>{
    const[name, setName]=useState('')
    const[email, setEmail]=useState('')
    const[userName, setUserName]=useState('')
    const[pio, setPio]=useState('')
    const[password, setPassword]=useState('')
    const[profilImageUploaded, setProfilImageUploaded]=useState('')
    const[visibleCrop, setVisibleCrop]=useState(false)
    // this the part of intializing the crop status in that app
    const[crop, setCrop]=useState({x :0, y:0})
    const[zoom, setZoom]=useState(1)
    const[croppedAreaPexels, setCroppedAreaPexels]=useState()
    const[croppedImage, setCroppedImage]=useState(null)
    const[state, setState]=useState('')
    let checkLogin=localStorage.getItem('email')
    const openModalCrop=()=>{
        setVisibleCrop(true)
    }
    const closeModalCrop=()=>{
        setVisibleCrop(false)
    }
    const SignupFunction=async(e)=>{
        e.preventDefault();
        if (croppedImage==null) {
            alert('choose profil image to manage signing up in tis app')
        }
        else {
            const response=await fetch(endpoint+'signup/', {
                method :"POST",
                headers :{
                    "Content-Type" :"application/json",
                },
                body :JSON.stringify({
                    name:name,
                    email :email,
                    userName :userName,
                    pio :pio,
                    profilImage :croppedImage,
                    password :password,
                })
            })
            const data=await response.json();
            console.log(data)
            if (data.state) {
                localStorage.setItem('email', email)
                setEmail('')
                setName('')
                setPassword('')
                setUserName('')
                setPio('')
                window.location.href="http://localhost:3000/signup"
            }
            else {
                setState(data.process)
            }
        }
    }
    const uploadProfilImage=(e)=>{
        const [file]=e.target.files;
        const reader=new FileReader();
        Resizer.imageFileResizer(
            file,
            500,
            500,
            "JPEG",
            1000,
            0,
            async(uri)=>{
                setProfilImageUploaded(uri)
                console.log(uri)
            }
        )
        reader.readAsDataURL(file)
        openModalCrop();
    }
    const onCropComplete=useCallback((croppedArea, croppedAreaPexels)=>{
        setCroppedAreaPexels(croppedAreaPexels)
    })
    const uploadCroppedImage=useCallback(async()=>{
        try {
            const croppedImage=await 
            getCroppedImg(
                profilImageUploaded,
                croppedAreaPexels
            )
            setCroppedImage(croppedImage)
        } catch(e) {
            console.log(e)
        }
        console.log(croppedImage)
        closeModalCrop();
    })
    if (checkLogin!=null) return (<Redirect to="/profil"/>)
    return (
        <div className="forms_container">
            <section className="login-sec">
                <div className="desc-sec d-lg-block d-none">
                    <h4>Social App</h4>
                    <p>this a social media app where you can share your best moments on and share other's opinion, speaking with your best friends.</p>
                </div>
                <form data-aos="zoom-out" data-aos-delay="100" onSubmit={SignupFunction}>
                    <input value={name} className="form-control" onChange={(e)=>setName(e.target.value)} placeholder="type your name :" type="text" required maxLength="15"/>
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" type="email" maxLength="20" id="emailInp" placeholder="type your email :"/>
                    <input type="text" className="form-control" placeholder="type your username :" onChange={(e)=>setUserName(e.target.value)} value={userName} maxLength="15" required />
                    <input required className="form-control" placeholder="type your pio :" type="text" onChange={(e)=>setPio(e.target.value)} maxLength="20"/>
                    <input required value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" type="password" id="passwordInp" placeholder="type your password :"/>
                    <div className="uploadProfilImage">
                        <button className="btn border" style={{textTransform :"capitalize"}}>upload profilImage</button>
                        <input type="file" onChange={uploadProfilImage}/>
                    </div>
                    <button className="btn btn-primary">signup</button>
                    <p className="text-danger mt-2">{state}</p>
                    <Link to="/login" className="text text-white bg-dark p-2 rounded">login</Link>
                </form>
            </section>
            <Modal visible={visibleCrop} width="400px" height="600px" effect="fadeInUp" onClickAway={closeModalCrop}>
                <Copper
                    image={profilImageUploaded}
                    crop={crop}
                    aspect={1/1}
                    style={{containerStyle :{width :"400px", height :"500px"}, cropAreaStyle :{width :"100px", height :"100px"}}}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
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
                <button onClick={uploadCroppedImage} className="btn btn-primary position-absolute mb-2 ml-2" style={{bottom :"0",left :"0", zIndex :"2"}}>upload</button>
                <button onClick={closeModalCrop} className="btn btn-danger position-absolute mb-2 mr-2" style={{bottom :"0",right :"0", zIndex :"3"}}>Close</button>
            </Modal>
        </div>
    )
}
export default Signup;