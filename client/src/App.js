import React,{useState,createContext} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Nav from './Nav';
import Register from './Register';
import Login from './Login';
import Myprofile from './Myprofile';

export const store = createContext();

const App = () => {
 const [token,setToken] = useState(null);

  return (
    <div>
    <store.Provider value={[token,setToken]}>
        <Nav />
        <Router>
          <Switch>
             <Route path='/register' component={Register} />
             <Route path='/login' component={Login} />
             <Route path='/myprofile' component={Myprofile}></Route>
          </Switch>
        </Router>
    </store.Provider>


    </div>
  )
}

export default App