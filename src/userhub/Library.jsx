import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import './userhub.style.jana.css';
import './userhub.style.janb.css';
import './userhub.style.janc.css';
import midi5pin from '../img/midi5pin.svg';
import book from '../img/book.svg';

const midiDevices = [
    {
        uuid: '18903503-5368-4a42-b52b-bceca81c5262',
        name: 'korg volca fm',
        path: '/volca-fm-editor',
        component: '<volcaFm />'
    },
    {
        uuid: '149c3b5d-74f7-4241-bcb9-b907dea6081f',
        name: 'korg nubass',
        path: '/volca-nubass-editor',
        component: '<volcaNubass />'
    },
    {
        uuid: '9addd793-6101-408f-899c-4ade38a4e730',
        name: 'korg volca drums'
    },
    {
        uuid: 'da3379be-e520-4023-bf62-61739a53cd4f',
        name: 'korg sv-1'
    },
    {
        uuid: '3d89af9b-a1a9-424d-bc82-0c7dd99a0340',
        name: 'tasty chips gr-1'
    },
    {
        uuid: 'cf6ece7f-cd5a-4c52-90ca-7d029da11960',
        name: 'arturia microfreak'
    },
    {
        uuid: 'f91100f1-32fe-433e-88f2-e6c93c7ca31d',
        name: 'bastil thyme'
    },
    {
        uuid: 'bf3eb69e-3548-4f94-916c-eab27158f45b',
        name: 'gamechanger motorsynth'
    },
    {
        uuid: '7bc28c7d-a855-41dc-a555-c472acda7cd5',
        name: 'expressive e osmose'
    },
    {
        uuid: 'e298a827-2cd0-474f-a557-4485639ec2a0',
        name: 'eventide space'
    },
    {
        uuid: '3ea92863-1090-427e-af8c-4a0ce412d27e',
        name: 'korg kaos pad 2'
    },
    {
        uuid: '5d0dd7aa-b5fb-478e-8b3d-f48034727771',
        name: 'm-audio venom'
    },
    {
        uuid: '43af28b4-388f-42a9-a3c7-cc31ac405054',
        name: 'cv output'
    }
]

function Library() {
    
    const [libraryMonth, setLibraryMonth] = useState('_JanuaryC');
    const [patchEditorState, setPatchEditorState] = useState({
        path: midiDevices[0].path,
        component: midiDevices[0].component
    });
    const [patchEditorActive, setPatchEditorActive] = useState(false);
    
    const updateEditorPath = (val) => {
        let path, component;
        
        for (let i = 0; i < midiDevices.length; i++) {
            if (midiDevices[i].uuid === val) {
                path = midiDevices[i].path;
                component = midiDevices[i].component;
            }
        }
        setPatchEditorState({
            path: path,
            component: component
        });
    }
    
    function navigateToEditor() {
        
    }
    
        return(
                <div className={'homeContainer' + libraryMonth}>
                    <img className={'libraryIcon' + libraryMonth}
                        src={book}></img>

                    <div className={'homeBulletList' + libraryMonth}>
                        <img className={'homeMidiBullet' + libraryMonth} 
                            src={midi5pin}></img>
                        <p className={'homeDropdownLabel' + libraryMonth}>patch editor:</p>
                        <select className={'homeDropdown' + libraryMonth}
                            onChange={(e) => updateEditorPath(e.target.value)}>
                            {midiDevices.map(item => 
                                <option key={item.uuid} value={item.uuid}>{item.name}</option>
                            )}
                        </select>
                        <Link to={patchEditorState.path}>
                            <button className={'homeButtons' + libraryMonth}>
                                load editor
                            </button>
                        </Link>
                    </div>
                    <div className={'homeBulletList' + libraryMonth}>
                        <img className={'homeMidiBullet' + libraryMonth} 
                            src={midi5pin}></img>
                        <p className={'homeDropdownLabel' + libraryMonth}>patch manager:</p>
                        <select className={'homeDropdown' + libraryMonth}>
                            {midiDevices.map(item => 
                                <option key={item.uuid} value={item.uuid}>{item.name}</option>
                            )}
                        </select>
                        <button className={'homeButtons' + libraryMonth}>load manager</button>
                    </div>
                    <div className={'homeBulletList' + libraryMonth}>
                        <img className={'homeMidiBullet' + libraryMonth} 
                            src={midi5pin}></img>
                        <p className={'homeDropdownLabel' + libraryMonth}>shared patches:</p>
                        <select className={'homeDropdown' + libraryMonth}>
                            {midiDevices.map(item => 
                                <option key={item.uuid} value={item.uuid}>{item.name}</option>
                            )}
                        </select>
                        <button className={'homeButtons' + libraryMonth}>patch market</button>
                    </div>


                </div>
        );
    
}

export default Library;