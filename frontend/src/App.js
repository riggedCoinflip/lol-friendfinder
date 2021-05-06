import React from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/Signup';
import Users from './components/Users';



export default function App() {
    return (
        <div>
            <Navbar/>

            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/login" component={Login}/>
                <Route path="/signup" component={SignUp}/>
                <Route path="/users" component={Users}/>
            </Switch>
        </div>
    );
}


