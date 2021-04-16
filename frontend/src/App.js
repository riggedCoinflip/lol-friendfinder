import React from 'react';
import {
    Switch,
    Route,
} from 'react-router-dom';

import Home from "./components/Home.component";
import Users from './components/Users.component';
import Navbar from './components/Navbar.component';


export default function App() {
    return (
            <div>
                <Navbar/>

                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="/users" component>
                        <Users/>
                    </Route>
                </Switch>
            </div>
    );
}


