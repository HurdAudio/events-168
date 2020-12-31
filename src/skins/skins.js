import React, { useState } from 'react';
import Table from './skinsTable';

const table = Table();

function SkinsTable(access) {
    
    const now = new Date();
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    let skins = {};
    
    switch(access) {
        case('fmVolcaEditor'):
            if (table.fmVolcaEditor[months[now.getMonth()]].length === 1) {
                skins.fmVolcaEditor = table.fmVolcaEditor.available[Math.floor(Math.random() * (table.fmVolcaEditor.available.length))];
            } else {
                skins.fmVolcaEditor = table.fmVolcaEditor[months[now.getMonth()]][now.getDate()];
            }
            break;
        case('landing'):
            if (table.landing[months[now.getMonth()]].length === 1) {
                skins.landing = table.landing.available[Math.floor(Math.random() * (table.landing.available.length))];
            } else {
                skins.landing = table.landing[months[now.getMonth()]][now.getDate()];
            }
            break;
        case('login'):
            if (table.login[months[now.getMonth()]].length === 1) {
                skins.login = table.login.available[Math.floor(Math.random() * (table.login.available.length))];
            } else {
                skins.login = table.login[months[now.getMonth()]][now.getDate()];
            }
            break;
        case('midiManager'):
            if (table.midiManager[months[now.getMonth()]].length === 1) {
                skins.midiManager = table.midiManager.available[Math.floor(Math.random() * (table.midiManager.available.length))];
            } else {
                skins.midiManager = table.midiManager[months[now.getMonth()]][now.getDate()];
            }
            break;
        case('nubassEditor'):
            if (table.nubassEditor[months[now.getMonth()]].length === 1) {
                skins.nubassEditor = table.nubassEditor.available[Math.floor(Math.random() * (table.nubassEditor.available.length))];
            } else {
                skins.nubassEditor = table.nubassEditor[months[now.getMonth()]][now.getDate()];
            }
            break;
        case('volcaDrumEditor'):
            if (table.volcaDrumEditor[months[now.getMonth()]].length === 1) {
                skins.volcaDrumEditor = table.volcaDrumEditor.available[Math.floor(Math.random() * (table.volcaDrumEditor.available.length))];
            } else {
                skins.volcaDrumEditor = table.volcaDrumEditor[months[now.getMonth()]][now.getDate()];
            }
            break;
        case('userHub'):
            if (table.userHub[months[now.getMonth()]].length === 1) {
                skins.userHub = table.userHub.available[Math.floor(Math.random() * (table.userHub.available.length))];
            } else {
                skins.userHub = table.userHub[months[now.getMonth()]][now.getDate()];
            }
            break;
        default:
            alert('ERROR STATE: Unsupported Skins Action');
    }
    
    return skins;
}

export default SkinsTable;