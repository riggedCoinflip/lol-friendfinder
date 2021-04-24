import React from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom';

import Navbar from './components/Navbar.component';
import Home from './components/Home.component';
import Login from './components/login.component';
import SignUp from './components/signup.component';
import Users from './components/Users.component';



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


