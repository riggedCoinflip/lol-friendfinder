import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {AUTH_TOKEN} from '../constants';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-fluid">
                    {/* Left */}
                    <div className="collapse navbar-collapse w-100 order-1 order-md-0 dual-collapse">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/Users" className="nav-link">Users</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Middle */}
                    <div className="mx-auto order-0">
                        <Link to="/" className="navbar-brand mx-auto">Hooked </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target=".dual-collapse" aria-controls=".dual-collapse"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>
                    </div>

                    {/* Right */}
                    <div className="collapse navbar-collapse w-100 order-3 dual-collapse">
                        <ul className="navbar-nav ms-auto">
                            {AUTH_TOKEN ?
                                <li className="nav-item dropdown">
                                    <Link to="/profile" className="nav-link dropdown-toggle" role="button"
                                          data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src="TODO ADD PROFILE PIC" className="rounded-circle"
                                             alt="USERNAME" width="30px"/>
                                    </Link>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li><Link className="dropdown-item">
                                            Signed in as <strong>USERNAME</strong>
                                        </Link></li>
                                        <li>
                                            <hr className="dropdown-divider"/>
                                        </li>

                                        <li><Link
                                            to="/logout"
                                            className="dropdown-item"
                                            onClick={() => {
                                                // localStorage.removeItem(AUTH_TOKEN);
                                                // {//TODO we do not need this Link}
                                                localStorage.clear();
                                                console.log('L. Storage cleaned');
                                                // document.getElementById("user-info").reset();
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt}/>
                                            Logout
                                        </Link></li>
                                    </ul>
                                </li>
                                :
                                <>
                                    <li className=" nav-item">
                                        <Link to="/signup" className="nav-link text-warning">Signup for free!</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/login" className="nav-link">Login</Link>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}