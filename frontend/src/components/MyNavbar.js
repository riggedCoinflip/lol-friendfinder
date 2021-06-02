import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AUTH_TOKEN } from '../constants';
import { useHistory } from 'react-router';
import { useState, useEffect } from 'react';
import { Navbar } from 'react-bootstrap';

function MyNavbar() {

    const [TOKEN, setTOKEN] = useState(localStorage.getItem("SECREToken"));



 

    return (
        <div>
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <Link to="/Users" className="nav-link">Users</Link>

                    <Navbar.Brand className="mx-auto order-0 justify-content-md-center">
                        <Link to="/" className="nav-link order-0" type="button">Hooked</Link>
                    </Navbar.Brand>
                    <Link to="/signup" className="nav-link text-warning" >Signup for free!</Link>

                    {TOKEN === null ?
                        <div className="nav-item" value="Login">
                            <Link to="/Login" className="nav-link"
                                onClick={() => setTOKEN(localStorage.getItem("SECREToken"))}
                            >Login</Link>
                        </div>

                        :
                        <div className="nav-item">
                            <Link value="Logout" to="/Logout" className="nav-link"
                                onClick={() => setTOKEN(null)}
                            >Logout</Link>
                        </div>
                    }


                </Navbar.Collapse>

            </Navbar>
        </div>
    );
}
export default MyNavbar;