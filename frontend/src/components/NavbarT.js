import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import { withRouter } from 'react-router';
import { AUTH_TOKEN } from '../constants';
import { useHistory } from 'react-router';


//class Navbar extends Component {
    const NavbarT = () => {

    //render() {
        const history = useHistory();
        const authToken = localStorage.getItem(AUTH_TOKEN);
        return (
            <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        
     
       
        
       
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link to="/create"
              className="ml1 no-underline black"
            >
              submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              history.push(`/`);
            }}
          >
            logout
          </div>
        ) : (
          <Link
            to="/login"
            className="ml1 no-underline black"
          >
            login
          </Link>
        )}
      </div>
    </div>
        );
    }

export default NavbarT;