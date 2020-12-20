import React from 'react';

import { defaultList, volcaFmList } from './eventLists';

function MidiEventsList(deviceId) {
        
    switch(deviceId) {
        case('e3bfacf5-499a-4247-b512-2c4bd15861ad'):
            return volcaFmList;
            break;
        default:
            console.log('ERROR - Unsupported device: no MIDI Events List on record for device');
    }
    
    return defaultList;
}

export default MidiEventsList;