import React,{useContext,useState,useEffect} from 'react'
import {store} from './App';
import { Link } from "react-router-dom";
import axios from 'axios';
import Moment from "react-moment";

const Myprofile = () => {
    const [token,setToken] = useContext(store);
    const [data,setData] = useState(null);
    const [allMsg,setAllMsg] = useState([]);
    const [newMsg,setNewMsg] = useState("");
    
    useEffect(() =>{
        axios.get('http://localhost:5000/myprofile',{
            headers: {
                'x-token' : token
            } 
        }).then(res => setData(res.data)).catch((err) => console.log(err))
        
        axios.get('http://localhost:5000/getmsg',{
          headers: {
              'x-token' : token
          } 
      }).then(res => setAllMsg(res.data)).catch((err) => console.log(err))
// eslint-disable-next-line
    },[])

    const submitHandler = (e) =>{
        e.preventDefault();
        axios.post('http://localhost:5000/addmsg',{text:newMsg},{
            headers: {
                'x-token' : token
            } 
        }).then(res => setAllMsg(res.data)).catch((err) => console.log(err))
    }
    if(!token){
        return <Link to='/login'/>
    }
    return (
      <div>
          {
              data &&
          <center>
              <br />
              <div class="card" style={{"width": "38rem"}}>
              <div class="card-body">
              {
                allMsg.length >=1 ? 
                allMsg.map(message => <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{message.username} <Moment style={{"fontSize": "11px"}} format="hh:mm:ss" >{message.date}</Moment> </h5>
                  <p>{message.text}</p>
                </div>
              </div>
                )
                  :
                  <h1>Message is Loading.....</h1>
              }

              <form onSubmit={submitHandler} >
                <input type="text" onChange={e => setNewMsg(e.target.value)} />
                <input type="submit" value="Send Message" />
              </form>
              <hr />

                  <button class="btn btn-primary" onClick={() => setToken(null)}>Logout</button>
              </div>
              </div>
          </center>
      }
      </div>
  )
}

export default Myprofile