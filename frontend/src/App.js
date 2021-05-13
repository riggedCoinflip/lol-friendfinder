import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Logins from './components/LoginSignup';
import SignUp from './components/Signup';
import Users from './components/Users';
import NavbarT from './components/NavbarT';



export default function App() {
    return (
        <div>
            <Navbar/>
            

            <Switch>
                <Route exact path="/"  component={Home}/>
                <Route path="/login" component={Logins}/>
                <Route path="/signup" component={SignUp}/>
                <Route exact path="/users" component={ () => <Users authorized={true}/>} />
            </Switch>
        </div>
    );
}


