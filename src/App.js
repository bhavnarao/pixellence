import React,{useState,useEffect} from 'react'
import './App.css';
import Posts from './Posts.js'
import {auth, db} from './firebase.js'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import ImageUpload from './ImageUpload.js'
import logo from './logo.png'

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] =useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const[openSignIn,setOpenSignIn]=useState(false);
  const[username,setUsername]=useState(['']);
  const[email,setEmail]=useState(['']);
  const[password,setPassword]=useState(['']);
const[open,setOpen]=useState(false);
const[user,setUser]=useState(null);
useEffect(()=>{
const unsubscribe=auth.onAuthStateChanged((authUser)=>{
  if(authUser){
    //user has logged in
    setUser(authUser);
    if(authUser.displayName){
      //dont update username
    }else{
      return authUser.updateProfile({
        displayName:username,

      })
    }
  }else{
    //user has logged out
    setUser(null);
  }
})
return()=>{
  unsubscribe();
}
},[user,username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc => ({
        id:doc.id,
        post:doc.data()
      })));
    })
  }, []);

const signUp=(event)=>{
  event.preventDefault();
auth.createUserWithEmailAndPassword(email,password).then(
  (authUser)=>{
    authUser.user.updateProfile({
      displayName:username
    })
  }
)
.catch((error)=>alert(error.message));
setOpen(false);
}

const signIn=(event)=>{
  event.preventDefault();
  auth.signInWithEmailAndPassword(email,password).catch((error)=>alert(error.message));
  setOpenSignIn(false);
}
  return (
    <div className="app">

    
      
      <Modal
  open={open}
  onClose={()=>setOpen(false)}>
  <div style={modalStyle} className={classes.paper}>
    <form className="app_signup">
      <center>
      <img className="app_headerImage"
    src={logo}
    alt=""></img>  </center>
    <Input
    type="text"
    placeholder="username"
    value={username}
    onChange={(e)=>setUsername(e.target.value)}
    />
     <Input
    type="text"
    placeholder="email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    />
     <Input
    type="text"
    placeholder="password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    />
     <Button type="submit" onClick={signUp}>Sign Up</Button>
     </form>
      </div>
</Modal>
<Modal
  open={openSignIn}
  onClose={()=>setOpenSignIn(false)}>
  <div style={modalStyle} className={classes.paper}>
    <form className="app_signup">
      <center>
      <img className="app_headerImage"
    src={logo}
    alt=""></img>  </center>
   
     <Input
    type="text"
    placeholder="email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    />
     <Input
    type="text"
    placeholder="password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    />
     <Button type="submit" onClick={signIn}>Sign In </Button>
     </form>
      </div>
</Modal>
     <div className="app_header">
    <img className="app_headerImage"
    src={logo}
    alt=""></img>

     {
      user?(<div><Button onClick={()=>auth.signOut()}><b>Logout</b></Button>
       </div>):(
        <div className="app_loginContainer">
          <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
      <Button onClick={()=>setOpen(true)}>Sign Up</Button>
      </div>
      )
    }
    </div>
   
    <div className="app_posts">
     {
       posts.map(({id,post})=>( 
         <Posts key={id} postId={id} user={user} username={post.username} caption={post.caption} imgURL={post.imgUrl} />
       ))
     }
     </div>
     
     
     {user?.displayName ? (<ImageUpload username={user.displayName}/>):(<h3 className='sorry'>Sorry you need to login to upload</h3>)}
    </div>
  );
}

export default App;