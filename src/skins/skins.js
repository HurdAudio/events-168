import React, { useState } from 'react';
import Table from './skinsTable';

const table = Table();

function SkinsTable(access) {
    
    const now = new Date();
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    let skins = {};
    
    switch(access) {
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
        default:
            alert('ERROR STATE: Unsupported Skins Action');
    }
    
    return skins;
}

export default SkinsTable;