import React, {
    Component
} from 'react';
import axios from 'axios';

import Landing from './landing/landing';
import UserHub from './userhub/userhub';
import Login from './login/login';
import logo from './img/midi5pin.svg';
import './css/reset.css';

let userLoggedIn = false;
let localStorage = window.localStorage;

if (localStorage.getItem('userLoggedIn') === 'true') {
    userLoggedIn = true;
}


function App() {
    
    if (!userLoggedIn) {
        return (
          <Landing />

      );
    } else {
        return (
            <UserHub />
        )
            }
  
}

export default App;

//
//import React, {
//    Component
//} from 'react';
//import axios from 'axios';
//
//import Landing from './landing/landing';
//import UserHub from './userhub/userhub';
//import logo from './img/midi5pin.svg';
//import './css/reset.css';
//
//let userLoggedIn = false;
//let localStorage = window.localStorage;
//
//    if (localStorage.getItem('userLoggedIn') === 'true') {
//        userLoggedIn = true;
//    }
//
//class App extends Component {
//    
//    render() {
//        if (userLoggedIn) {
//            return (
//                <div>
//                    <UserHub />
//                </div>
//            )
//        } else {
//            return ( 
//                <div>
//                    <Landing / >
//                </div>
//            );
//        }
//
//    }
//}
//
//export default App;
