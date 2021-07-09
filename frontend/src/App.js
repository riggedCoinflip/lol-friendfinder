import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';

import MyNavbar from './components/MyNavbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/Signup';
import Users from './components/Users/Users';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import Friends from './components/Friends';


export default function App() {
    return (
        <div >
            <MyNavbar/>
            
            <Switch>
                <Route exact path="/"  component={Home}/>
                <Route path="/login" component={Login}/>
                <Route path="/signup" component={SignUp}/>
         
                <Route exact path="/users" component={ () => <Users/>} />
                <Route exact path="/profile" component={ () => <Profile authorized={true}/>} />

                <Route component={NotFound}/>

            </Switch>
        </div>
    );
}


