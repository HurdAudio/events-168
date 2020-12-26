import React from 'react';

import { defaultList, volcaFmList, volcaNubassList } from './eventLists';

function MidiEventsList(deviceId) {
        
    switch(deviceId) {
        case('e3bfacf5-499a-4247-b512-2c4bd15861ad'):
            return volcaFmList;
            break;
        case('bda73d0e-c18c-472e-add6-1e1a4f123949'):
            return volcaNubassList;
            break;
        default:
            console.log('ERROR - Unsupported device: no MIDI Events List on record for device');
    }
    
    return defaultList;
}

export default MidiEventsList;