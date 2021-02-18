import { Button } from '@material-ui/core'
import React ,{useState} from 'react'
import {db,storage} from './firebase.js'
import firebase from"firebase"
import './ImageUpload.css'
function ImageUpload(props) {
    const[caption,setCaption]=useState('');
    const[image,setImage]= useState('');
    const[progress,setProgress]= useState(0);
    const handleChange=(e)=>{
        if(e.target.value[0]){
            setImage(e.target.files[0]);
        }
    }
    const handleUpload=()=>{
        const uploadTask= storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state changed",
            (snapshot)=>{
                const progress=Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
setProgress(progress);
            },
            (error)=>{
                console.log(error);
                alert(error.message);
            },
            ()=>{
                storage.ref('images').child(image.name).getDownloadURL().then(url=>{
                    db.collection('posts').add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imgUrl:url,
                        username:props.username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        )
    }
    return (
        <div className="iupload">
        <div className="imageupload">
            <progress className="imageupload_progress" value={progress} max="100"></progress>
            <input type="text" placeholder='Enter a Caption' onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" accept="image/*" onChange={handleChange}/>
            <Button color="primary" className="btn" onClick={handleUpload}>Upload</Button>
        </div>
        </div>
    )
}

export default ImageUpload