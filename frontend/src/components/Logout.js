import React from "react";
import {useHistory} from "react-router-dom";
import { AUTH_TOKEN } from '../constants';
//import {setProfile} from './Profile';


export default function Logout() {
   
   var clearTokenUndOthers = () => {
        localStorage.clear();
        //AUTH_TOKEN = null;
      //  console.log('L. Storage cleaned from Logout: '+ AUTH_TOKEN);
     //   setProfile('');
        }

return (
    
    <div>
        {clearTokenUndOthers()}
        You just loggout, see you soon.    
</div>

);
}