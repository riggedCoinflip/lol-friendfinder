import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import { withRouter } from 'react-router';
import { AUTH_TOKEN } from '../constants';
import { useHistory } from 'react-router';

export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-fluid">
                    {/* Left */}
                    <div className="collapse navbar-collapse w-100 order-1 order-md-0 dual-collapse">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link to="/users" className="nav-link">Users</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Middle */}
                    <div className="mx-auto order-0">
                        <Link to="/" className="navbar-brand mx-auto">Hooked {Branch}</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target=".dual-collapse" aria-controls=".dual-collapse"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>
                    </div>

                    {/* Right */}
                    <div className="collapse navbar-collapse w-100 order-3 dual-collapse">
                        <ul className="navbar-nav ms-auto">
                            {/* TODO require not logged in */}
                            <li className=" nav-item">
                                <Link to="/signup" className="nav-link text-warning" >Signup for free!</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link" >Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>      
            </nav>
        );
    }

export default Navbar;