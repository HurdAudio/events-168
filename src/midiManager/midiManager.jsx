import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Link
} from "react-router-dom";
import midi5pin from '../img/midi5pin.svg';
import './midiManager.style.jana.css';
import './midiManager.style.janb.css';
import midiConnection from '../midiManager/midiConnection';
import UUID from 'uuidjs';

let connections = {
    inputs: [],
    outputs:[]
};

const availableDevices = [
    {
        device: 'no device',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/keyboard-2779734_1280.png',
        uuid: '0'
    },
    {
        device: 'Arturia Microfreak',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/microfreak-image.png',
        uuid: '5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe'
    },
    {
        device: 'Bastil Thyme',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/bastl-instruments-thyme.jpg',
        uuid: 'fc30dcf7-aeba-4a66-8630-0ec44622231d'
    },
    {
        device: 'Eventide Space',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/Space-Right.png',
        uuid: 'afc43874-1311-471c-871d-ac2243d014c9'
    },
    {
        device: 'Expressive E Osmose',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/ek49_001_front_tranche.png',
        uuid: '7d35e14a-9f36-425a-a8c4-be778de841f3'
    },
    {
        device: 'Gamechanger Audio Motor Synth',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/xkkm8romonmuu44oonbd.jpeg',
        uuid: 'd18af509-2452-4055-9ce2-e7a91ea61233'
    },
    {
        device: 'Korg Kaoss Pad 3',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/ccs-14-0-17985500-1442954524.png',
        uuid: '88947b9b-9c2a-45c6-944c-05c4cbff494d'
    },
    {
        device: 'Korg SV-1',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/straight-73_634625749518950000.png',
        uuid: '13cb42f1-451f-4906-95ea-a135885a1133'
    },
    {
        device: 'Korg Volca Drum',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/7d9e95d93948da4072dadc31fd718325_pc.png',
        uuid: '3abd3875-667e-4098-abdb-12910b43ba2f'
    },
    {
        device: 'Korg Volca FM',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/b3773bb133b4062103d9807e45bb300c_sp.png',
        uuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad'
    },
    {
        device: 'Korg Volca Nubass',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/07887ab0a1001f02a115e9c90af92da6_sp.png',
        uuid: 'bda73d0e-c18c-472e-add6-1e1a4f123949'
    },
    {
        device: 'M-Audio Venom',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/venom.jpeg',
        uuid: 'c725bfdd-8829-477d-a0dc-d9b95ddc2189'
    },
    {
        device: 'Tasty Chips GR-1',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/tastychipselectronics_gr-1_01.jpg',
        uuid: '2ce7d861-1f69-4294-9e0b-cf537b950e04'
    },
    {
        device: 'Tubbutec µTune',
        imagePath: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/PanelFrontFinalSmaller-withwhiteboarder.jpg',
        uuid: '72e96c46-809c-408d-8c5d-d44e450f3421'
    }

];

const januaryASpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/spinners/dynamic-scifi-hud-element.gif';
const januaryBSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/spinners/2316bf07d0598a9892debf49f09b4f03.gif';

function MidiManager(user, config) {
    
    const [midiConnections, setMidiConnections] = useState(connections);
    const [midiManagerContainerState, setMidiManagerContainerState] = useState('_Active');
    const [midiManagerMonth, setMidiManagerMonth] = useState('_JanuaryB');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [configAltered, setConfigAltered] = useState(false);
    const [userPresets, setUserPresets] = useState([
        {
            inputs: [
                {
                    channel: 0,
                    controller: true,
                    device: 'Korg SV-1',
                    deviceUuid: '13cb42f1-451f-4906-95ea-a135885a1133',
                    hardwareIn: 'Alyseum U3-88c A Port 1',
                    label: 'SV-1'
                },
                {
                    channel: 0,
                    controller: true,
                    device: 'Expressive E Osmose',
                    deviceUuid: '7d35e14a-9f36-425a-a8c4-be778de841f3',
                    hardwareIn: 'Alyseum U3-88c A Port 2',
                    label: 'Osmose'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'Arturia Microfreak',
                    deviceUuid: '5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe',
                    hardwareIn: 'Alyseum U3-88c A Port 3',
                    label: 'Microfreak'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'Tubbutec µTune',
                    deviceUuid: '72e96c46-809c-408d-8c5d-d44e450f3421',
                    hardwareIn: 'Alyseum U3-88c A Port 4',
                    label: 'µTune'
                },
                {
                    channel: 0,
                    controller: true,
                    device: 'Korg Kaoss Pad 3',
                    deviceUuid: '88947b9b-9c2a-45c6-944c-05c4cbff494d',
                    hardwareIn: 'Alyseum U3-88c A Port 5',
                    label: 'Kaoss Pad 3'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 6',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 7',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 8',
                    label: '<--empty-->'
                }
            ],
            name: 'default',
            outputs: [
                {
                    activeReciever: true,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 1',
                    label: 'Volca FM 1'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 2',
                    label: 'Volca FM 2'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 3',
                    label: 'Volca FM 3'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 4',
                    label: 'Volca FM 4'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca Nubass',
                    deviceUuid: 'bda73d0e-c18c-472e-add6-1e1a4f123949',
                    hardwareIn: 'Alyseum U3-88c A Port 5',
                    label: 'Volca Nubass'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca Drum',
                    deviceUuid: '3abd3875-667e-4098-abdb-12910b43ba2f',
                    hardwareIn: 'Alyseum U3-88c A Port 6',
                    label: 'Volca Drum'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Tasty Chips GR-1',
                    deviceUuid: '2ce7d861-1f69-4294-9e0b-cf537b950e04',
                    hardwareIn: 'Alyseum U3-88c A Port 7',
                    label: 'GR-1'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Arturia Microfreak',
                    deviceUuid: '5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe',
                    hardwareIn: 'Alyseum U3-88c A Port 8',
                    label: 'Microfreak'
                }
            ],
            uuid: '08f89162-6bdf-47e1-b128-df6d8f1d2d26'
        },
        {
            inputs: [
                {
                    channel: 0,
                    controller: true,
                    device: 'Korg SV-1',
                    deviceUuid: '13cb42f1-451f-4906-95ea-a135885a1133',
                    hardwareIn: 'Alyseum U3-88c A Port 1',
                    label: 'SV-1'
                },
                {
                    channel: 0,
                    controller: true,
                    device: 'Expressive E Osmose',
                    deviceUuid: '7d35e14a-9f36-425a-a8c4-be778de841f3',
                    hardwareIn: 'Alyseum U3-88c A Port 2',
                    label: 'Osmose'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'Arturia Microfreak',
                    deviceUuid: '5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe',
                    hardwareIn: 'Alyseum U3-88c A Port 3',
                    label: 'Microfreak'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'Tubbutec µTune',
                    deviceUuid: '72e96c46-809c-408d-8c5d-d44e450f3421',
                    hardwareIn: 'Alyseum U3-88c A Port 4',
                    label: 'µTune'
                },
                {
                    channel: 0,
                    controller: true,
                    device: 'Korg Kaoss Pad 3',
                    deviceUuid: '88947b9b-9c2a-45c6-944c-05c4cbff494d',
                    hardwareIn: 'Alyseum U3-88c A Port 5',
                    label: 'Kaoss Pad 3'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 6',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 7',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 8',
                    label: '<--empty-->'
                }
            ],
            name: 'volca setup',
            outputs: [
                {
                    activeReciever: true,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 1',
                    label: 'Volca FM 1'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 2',
                    label: 'Volca FM 2'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 3',
                    label: 'Volca FM 3'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 4',
                    label: 'Volca FM 4'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca Nubass',
                    deviceUuid: 'bda73d0e-c18c-472e-add6-1e1a4f123949',
                    hardwareIn: 'Alyseum U3-88c A Port 5',
                    label: 'Volca Nubass'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca Drum',
                    deviceUuid: '3abd3875-667e-4098-abdb-12910b43ba2f',
                    hardwareIn: 'Alyseum U3-88c A Port 6',
                    label: 'Volca Drum'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Bastil Thyme',
                    deviceUuid: 'fc30dcf7-aeba-4a66-8630-0ec44622231d',
                    hardwareIn: 'Alyseum U3-88c A Port 7',
                    label: 'Thyme'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Eventide Space',
                    deviceUuid: 'afc43874-1311-471c-871d-ac2243d014c9',
                    hardwareIn: 'Alyseum U3-88c A Port 8',
                    label: 'Space'
                }
            ],
            uuid: '47ea7b8f-9601-442c-9a4c-58bec571f2c3'
        },
        {
            inputs: [
                {
                    channel: 0,
                    controller: true,
                    device: 'Korg SV-1',
                    deviceUuid: '13cb42f1-451f-4906-95ea-a135885a1133',
                    hardwareIn: 'Alyseum U3-88c A Port 1',
                    label: 'SV-1'
                },
                {
                    channel: 0,
                    controller: true,
                    device: 'Expressive E Osmose',
                    deviceUuid: '7d35e14a-9f36-425a-a8c4-be778de841f3',
                    hardwareIn: 'Alyseum U3-88c A Port 2',
                    label: 'Osmose'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 3',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 4',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: true,
                    device: 'Korg Kaoss Pad 3',
                    deviceUuid: '88947b9b-9c2a-45c6-944c-05c4cbff494d',
                    hardwareIn: 'Alyseum U3-88c A Port 5',
                    label: 'Kaoss Pad 3'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 6',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 7',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 8',
                    label: '<--empty-->'
                }
            ],
            name: 'live rig',
            outputs: [
                {
                    activeReciever: true,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 1',
                    label: 'Volca FM 1'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca FM',
                    deviceUuid: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                    hardwareIn: 'Alyseum U3-88c A Port 2',
                    label: 'Volca FM 2'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'M-Audio Venom',
                    deviceUuid: 'c725bfdd-8829-477d-a0dc-d9b95ddc2189',
                    hardwareIn: 'Alyseum U3-88c A Port 3',
                    label: 'Venom'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Tubbutec µTune',
                    deviceUuid: '72e96c46-809c-408d-8c5d-d44e450f3421',
                    deviceUuid: '72e96c46-809c-408d-8c5d-d44e450f3421',
                    hardwareIn: 'Alyseum U3-88c A Port 4',
                    label: 'µTune'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca Nubass',
                    deviceUuid: 'bda73d0e-c18c-472e-add6-1e1a4f123949',
                    hardwareIn: 'Alyseum U3-88c A Port 5',
                    label: 'Volca Nubass'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca Drum',
                    deviceUuid: '3abd3875-667e-4098-abdb-12910b43ba2f',
                    hardwareIn: 'Alyseum U3-88c A Port 6',
                    label: 'Volca Drum'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Bastil Thyme',
                    deviceUuid: 'fc30dcf7-aeba-4a66-8630-0ec44622231d',
                    hardwareIn: 'Alyseum U3-88c A Port 7',
                    label: 'Thyme'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Eventide Space',
                    deviceUuid: 'afc43874-1311-471c-871d-ac2243d014c9',
                    hardwareIn: 'Alyseum U3-88c A Port 8',
                    label: 'Space'
                }
            ],
            uuid: 'ca90f090-60fb-4cac-9cfe-bf822cac99dd'
        },
        {
            inputs: [
                {
                    channel: 0,
                    controller: true,
                    device: 'Korg SV-1',
                    deviceUuid: '13cb42f1-451f-4906-95ea-a135885a1133',
                    hardwareIn: 'Alyseum U3-88c A Port 1',
                    label: 'SV-1'
                },
                {
                    channel: 0,
                    controller: true,
                    device: 'Expressive E Osmose',
                    deviceUuid: '7d35e14a-9f36-425a-a8c4-be778de841f3',
                    hardwareIn: 'Alyseum U3-88c A Port 2',
                    label: 'Osmose'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'Arturia Microfreak',
                    deviceUuid: '5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe',
                    hardwareIn: 'Alyseum U3-88c A Port 3',
                    label: 'Microfreak'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'Tubbutec µTune',
                    deviceUuid: '72e96c46-809c-408d-8c5d-d44e450f3421',
                    hardwareIn: 'Alyseum U3-88c A Port 4',
                    label: 'µTune'
                },
                {
                    channel: 0,
                    controller: true,
                    device: 'Korg Kaoss Pad 3',
                    deviceUuid: '88947b9b-9c2a-45c6-944c-05c4cbff494d',
                    hardwareIn: 'Alyseum U3-88c A Port 5',
                    label: 'Kaoss Pad 3'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 6',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 7',
                    label: '<--empty-->'
                },
                {
                    channel: 0,
                    controller: false,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 8',
                    label: '<--empty-->'
                }
            ],
            name: 'tasty chips gr-1 centric',
            outputs: [
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Tasty Chips GR-1',
                    deviceUuid: '2ce7d861-1f69-4294-9e0b-cf537b950e04',
                    hardwareIn: 'Alyseum U3-88c A Port 1',
                    label: 'GR-1'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Bastil Thyme',
                    deviceUuid: 'fc30dcf7-aeba-4a66-8630-0ec44622231d',
                    hardwareIn: 'Alyseum U3-88c A Port 2',
                    label: 'Thyme'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Eventide Space',
                    deviceUuid: 'afc43874-1311-471c-871d-ac2243d014c9',
                    hardwareIn: 'Alyseum U3-88c A Port 3',
                    label: 'Space'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Arturia Microfreak',
                    deviceUuid: '5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe',
                    hardwareIn: 'Alyseum U3-88c A Port 4',
                    label: 'Microfreak'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg SV-1',
                    deviceUuid: '13cb42f1-451f-4906-95ea-a135885a1133',
                    hardwareIn: 'Alyseum U3-88c A Port 5',
                    label: 'SV-1'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'Korg Volca Drum',
                    deviceUuid: '3abd3875-667e-4098-abdb-12910b43ba2f',
                    hardwareIn: 'Alyseum U3-88c A Port 6',
                    label: 'Volca Drum'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 7',
                    label: '<--empty-->'
                },
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Alyseum U3-88c A Port 8',
                    label: '<--empty-->'
                }
            ],
            uuid: '9ee880c2-3a38-4647-8424-96ebf555ac33'
        }
    ]);
    const [currentPreset, setCurrentPreset] = useState(userPresets[0]);
    const [currentPresetUuid, setCurrentPresetUuid] = useState(userPresets[0].uuid);
    const [currentInputDetail, setCurrentInputDetail] = useState(null);
    const [currentOutputDetail, setCurrentOutputDetail] = useState(null);
    const [currentDeviceImage, setCurrentDeviceImage] = useState(null);
    const [newPatchModalState, setNewPatchModalState] = useState('_Inactive');
    const [deleteGuardrailState, setDeleteGuardrailState] = useState('_Inactive');
    const [saveAsModalState, setSaveAsModalState] = useState('_Inactive');
    const [currentSpinner, setCurrentSpinner] = useState(januaryBSpinner);
    const [panicState, setPanicState] = useState('midiManagerPanicOff');
    
    const changePreset = (uuid) => {
        let index = 0;
        for (let i = 0; i < userPresets.length; i++) {
            if (userPresets[i].uuid === uuid) {
                index = i;
            }
        }
        setCurrentPreset(userPresets[index]);
        setCurrentPresetUuid(userPresets[index].uuid);
        setConfigAltered(false);
        setCurrentInputDetail(null);
        setCurrentOutputDetail(null);
        setCurrentDeviceImage(null);
    }
    
    const onMIDIMessage = (message) => {
        if (message.data[0] !== 255) { console.log(message); }
        for (let i = 0; i < currentPreset.outputs.length; i++) {
            if (currentPreset.outputs[i].activeReciever && message.data[0] !== 255) {
                midiConnections.outputs[i].send(message.data);
            }
        }
    }
    
    const setMIDIListeners = () => {
        for (let mInput = 0; mInput < midiConnections.inputs.length; mInput++) {
            if (currentPreset.inputs[mInput].controller) {
                midiConnections.inputs[mInput].onmidimessage = onMIDIMessage;
            } else {
                midiConnections.inputs[mInput].onmidimessage = null;
            }
            
        }
    }
    
    const checkMidiConnections = () => {
        navigator.requestMIDIAccess({ sysex: true })
            .then((midiAccess) => {               
                connections = midiConnection(midiAccess);
                setMidiConnections(connections);
                console.log(midiConnections);
                setMIDIListeners();
            }, () => {
                alert('No MIDI ports accessible');
            });
    }
    
    const toggleController = (inputDevice) => {
        let setting;
        let deepCopy = {...currentPreset};
        let deepCopy2 = [...userPresets];
        for (let i = 0; i < deepCopy.inputs.length; i++) {
            if (deepCopy.inputs[i].hardwareIn === inputDevice.hardwareIn) {
                deepCopy.inputs[i].controller = !deepCopy.inputs[i].controller;
                setting = deepCopy.inputs[i].controller;
            }       
        }
        
        for (let j = 0; j < deepCopy2.length; j++) {
            if (deepCopy2[j].uuid === currentPresetUuid) {
                for (let k = 0; k < deepCopy2[j].inputs.length; k++) {
                    if (deepCopy2[j].inputs[k].hardwareIn === inputDevice.hardwareIn) {
                        deepCopy2[j].inputs[k].controller = setting;
                    }
                }
            }
        }
        setUserPresets(deepCopy2);
        setCurrentPreset(deepCopy);
        setConfigAltered(true);
        setMIDIListeners();
    }
    
    const toggleReceiver = (inputDevice) => {
        let setting;
        let deepCopy = {...currentPreset};
        let deepCopy2 = [...userPresets];
        for (let i = 0; i < deepCopy.outputs.length; i++) {
            if (deepCopy.outputs[i].hardwareIn === inputDevice.hardwareIn) {
                deepCopy.outputs[i].activeReciever = !deepCopy.outputs[i].activeReciever;
                setting = deepCopy.outputs[i].activeReciever;
            }       
        }
        for (let j = 0; j < deepCopy2.length; j++) {
            if (deepCopy2[j].uuid === currentPresetUuid) {
               for (let k = 0; k < deepCopy2[j].outputs.length; k++) {
                   if (deepCopy2[j].outputs[k].hardwareIn === inputDevice.hardwareIn) {
                      deepCopy2[j].outputs[k].activeReciever = setting; 
                   }
                } 
            }
            
        }
        console.log(deepCopy);
        setUserPresets(deepCopy2);
        setCurrentPreset(deepCopy);
        setConfigAltered(true);
    }
    
    const inputDetailAssign = (inputter) => {
        setCurrentInputDetail(inputter);
        setImage(inputter.deviceUuid);
    }
    
    const outputDetailAssign = (outputter) => {
        setCurrentOutputDetail(outputter);
        setImage(outputter.deviceUuid);
    }
    
    const updateOutputLabel = (val) => {
        let deepCopy = {...currentOutputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        deepCopy.label = val;
        
        for (let i = 0; i < deepPatch.outputs.length; i++) {
            if (deepPatch.outputs[i].hardwareIn === currentOutputDetail.hardwareIn) {
                deepPatch.outputs[i].label = val;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].outputs.length; k++) {
                    if (masterDepth[j].outputs[k].hardwareIn === currentOutputDetail.hardwareIn) {
                        masterDepth[j].outputs[k].label = val;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentOutputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const updateLabel = (val) => {
        let deepCopy = {...currentInputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        deepCopy.label = val;
        
        for (let i = 0; i < deepPatch.inputs.length; i++) {
            if (deepPatch.inputs[i].hardwareIn === currentInputDetail.hardwareIn) {
                deepPatch.inputs[i].label = val;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].inputs.length; k++) {
                    if (masterDepth[j].inputs[k].hardwareIn === currentInputDetail.hardwareIn) {
                        masterDepth[j].inputs[k].label = val;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentInputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const changeOutDevice = (val) => {
        let deepCopy = {...currentOutputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        let device = availableDevices.filter(vice => {
            return(vice.uuid === val);
        })[0];
        
        deepCopy.deviceUuid = val;
        deepCopy.device = device.device;
        
        for (let i = 0; i < deepPatch.outputs.length; i++) {
            if (deepPatch.outputs[i].hardwareIn === currentOutputDetail.hardwareIn) {
                deepPatch.outputs[i].deviceUuid = val;
                deepPatch.outputs[i].device = device.device;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].outputs.length; k++) {
                    if (masterDepth[j].outputs[k].hardwareIn === currentOutputDetail.hardwareIn) {
                        masterDepth[j].outputs[k].deviceUuid = val;
                        masterDepth[j].outputs[k].device = device.device;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentOutputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const changeDevice = (val) => {
        let deepCopy = {...currentInputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        let device = availableDevices.filter(vice => {
            return(vice.uuid === val);
        })[0];
        
        deepCopy.deviceUuid = val;
        deepCopy.device = device.device;
        
        for (let i = 0; i < deepPatch.inputs.length; i++) {
            if (deepPatch.inputs[i].hardwareIn === currentInputDetail.hardwareIn) {
                deepPatch.inputs[i].deviceUuid = val;
                deepPatch.inputs[i].device = device.device;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].inputs.length; k++) {
                    if (masterDepth[j].inputs[k].hardwareIn === currentInputDetail.hardwareIn) {
                        masterDepth[j].inputs[k].deviceUuid = val;
                        masterDepth[j].inputs[k].device = device.device;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentInputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const changeOutMidiChannel = (val) => {
        let deepCopy = {...currentOutputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        
        deepCopy.channel = val;
        
        for (let i = 0; i < deepPatch.outputs.length; i++) {
            if (deepPatch.outputs[i].hardwareIn === currentOutputDetail.hardwareIn) {
                deepPatch.outputs[i].channel = val;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].outputs.length; k++) {
                    if (masterDepth[j].outputs[k].hardwareIn === currentOutputDetail.hardwareIn) {
                        masterDepth[j].outputs[k].channel = val;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentOutputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const changeMidiChannel = (val) => {
        let deepCopy = {...currentInputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        
        deepCopy.channel = val;
        
        for (let i = 0; i < deepPatch.inputs.length; i++) {
            if (deepPatch.inputs[i].hardwareIn === currentInputDetail.hardwareIn) {
                deepPatch.inputs[i].channel = val;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].inputs.length; k++) {
                    if (masterDepth[j].inputs[k].hardwareIn === currentInputDetail.hardwareIn) {
                        masterDepth[j].inputs[k].channel = val;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentInputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const setImage = (uuid) => {
        let device = availableDevices.filter(vice => {
            return(vice.uuid === uuid);
        })[0];
        
        setCurrentDeviceImage(device.imagePath);
    }
    
    const newPatchModalOpen = () => {
        setNewPatchModalState('_Active');
        document.getElementById('midiManagerNewPresetNameInput').focus();
        setMidiManagerContainerState('_Inactive');
    }
    
    const closeNewPatchModal = () => {
        setNewPatchModalState('_Inactive');
        document.getElementById('midiManagerNewPresetNameInput').value = '';
        setMidiManagerContainerState('_Active');
    }
    
    const submitNewPatchName = () => {
        if (document.getElementById('midiManagerNewPresetNameInput').value !== '') {
            createNewPatch(document.getElementById('midiManagerNewPresetNameInput').value);
        }
    }
    
    const createNewPatch = (name) => {
        let deepCopy = [...userPresets];
        const uuid = UUID.generate();
        const inputs = [];
        const outputs = [];
        
        for (let i = 0; i < midiConnections.inputs.length; i++) {
            inputs[i] = {
                channel: 0,
                controller: false,
                device: 'no device',
                deviceUuid: '0',
                hardwareIn: midiConnections.inputs[i].name,
                label: '<--empty-->'
            };
        }
        
        for (let o = 0; o < midiConnections.outputs.length; o++) {
            outputs[o] = {
                activeReciever: false,
                channel: 0,
                device: 'no device',
                deviceUuid: '0',
                hardwareIn: midiConnections.outputs[o].name,
                label: '<--empty-->'
            }
        }
        
        deepCopy.push(
            {
                inputs: inputs,
                name: name,
                outputs: outputs,
                uuid: uuid
            }
        );
        
        setUserPresets(deepCopy);
        setCurrentPreset(deepCopy[deepCopy.length - 1]);
        setCurrentPresetUuid(uuid);
        setConfigAltered(false);
        setCurrentInputDetail(null);
        setCurrentOutputDetail(null);
        setCurrentDeviceImage(null);
        setNewPatchModalState('_Inactive');
        document.getElementById('midiManagerNewPresetNameInput').value = '';
        setMidiManagerContainerState('_Active');
    }
    
    const deletePatchGuardrail = () => {
        setDeleteGuardrailState('_Active');
        setMidiManagerContainerState('_Inactive');
    }
    
    const closeDeleteGuardrail = () => {
        setDeleteGuardrailState('_Inactive');
        setMidiManagerContainerState('_Active');
    }
    
    const deletePatch = () => {
        let index = null;
        let newCurrent = null;
        let newCurrentUUID = null;
        let deepCopy = [...userPresets];
        for (let i = 0; i < deepCopy.length; i++) {
            if (deepCopy[i].uuid === currentPreset.uuid) {
                index = i;
            }
        }
        deepCopy.splice(index, 1);
        setUserPresets(deepCopy);
        if (deepCopy.length !== 0) {
            newCurrent = deepCopy[0];
            newCurrentUUID = deepCopy[0].uuid;
        }
        setCurrentPreset(newCurrent);
        setCurrentPresetUuid(newCurrentUUID);
    }
    
    const deleteGuardrailCleared = () => {
        deletePatch();
        closeDeleteGuardrail();
    }
    
    const revertToSavedCopy = () => {
        setConfigAltered(false);
    }
    
    const openSaveAsModal = () => {
        setSaveAsModalState('_Active');
        setMidiManagerContainerState('_Inactive');
        document.getElementById('midiManagerSaveAsNameInput').focus();
    }
    
    const closeSaveAsModal = () => {
        setSaveAsModalState('_Inactive');
        setMidiManagerContainerState('_Active');
        document.getElementById('midiManagerSaveAsNameInput').value = '';
    }
    
    const saveAsSubmit = () => {
        if (document.getElementById('midiManagerSaveAsNameInput').value !== '') {
            const deepCopy = {...currentPreset};
            const deepPatch = [...userPresets];
            deepCopy.name = document.getElementById('midiManagerSaveAsNameInput').value;
            deepCopy.uuid = UUID.generate();
            deepPatch.push(deepCopy);
            setUserPresets(deepPatch);
            setCurrentPreset(deepCopy);
            closeSaveAsModal();
        }
    }
    
    const saveCurrentPreset = () => {
        setConfigAltered(false);
    }
    
    const panic = () => {
        setPanicState('midiManagerPanicOn');
        setMidiManagerContainerState('_Inactive');
        for (let i = 0; i < midiConnections.outputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    midiConnections.outputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('midiManagerPanicOff');
            setMidiManagerContainerState('_Active');
        }, midiConnections.outputs.length * 2000);
    }
    
    return(
        <div>
            <div className={'midiManagerContainer' + midiManagerContainerState + midiManagerMonth}>
                <div className={'midiManagerImageDiv' + midiManagerMonth}>
                    <div className={'midiManagerTopBar' + midiManagerMonth}>
                        <NavLink to="/">
                            <img className={'midiManagerNavImage' + midiManagerMonth}
                            src={midiImage}>
                            </img>
                        </NavLink>  
                    </div>
                    <h3 className={'midiManagerTitle' + midiManagerMonth}>MIDI Manager</h3>
                    <button className={'midiManagerPanicButton' + midiManagerMonth}
                        onClick={() => panic()}>Panic!
                    </button>
                    <div className={'midiManagerSidebarManager' + midiManagerMonth}>
                        <div className={'midiManagerSidebarContainer' + midiManagerMonth}>
                            <button className={'midiManagerCheckConnections' + midiManagerMonth}
                                onClick={() => checkMidiConnections()}>
                                check</button>
                            <button className={'midiManagerSaveConfiguration' + configAltered + midiManagerMonth}
                                onClick={() => saveCurrentPreset()}>
                                save</button>
                            <button className={'midiManagerSaveAsConfiguration' + midiManagerMonth}
                                onClick={() => openSaveAsModal()}>
                                save as...</button>
                            <button className={'midiManagerRevertConfiguration' + configAltered + midiManagerMonth}
                                onClick={() => revertToSavedCopy()}>
                                revert</button>
                            <p className={'midiManagerPresetsLabel' + midiManagerMonth}>presets:</p>
                            <div className={'midiManagerPresetsList' + midiManagerMonth}>
                                {userPresets.map(config => (
                                    <div className={'midiManagerPresetNameContainer' + (config.uuid === currentPreset.uuid) + midiManagerMonth}
                                        key={config.uuid}
                                        onClick={() => changePreset(config.uuid)}>
                                        <p className={'midiManagerPresetName' + (config.uuid === currentPreset.uuid) + midiManagerMonth} 
                                        value={config.id}>
                                            {config.name}
                                        </p>
                                    </div>
                                ))}        
                            </div>
                            <button className={'midiManagerLoadConfiguration' + midiManagerMonth}
                                onClick={() => newPatchModalOpen()}>
                                new</button>
                            <button className={'midiManagerDeleteConfiguration' + midiManagerMonth}
                                onClick={() => deletePatchGuardrail()}>delete</button>
                        </div>
                    </div>
                    <div className={'midiManagerInputsPane' + midiManagerMonth}>
                        <div className={'midiManagerInputsContainer' + midiManagerMonth}>
                            <h3 className={'midiManagerInputsPaneLabel' + midiManagerMonth}>Inputs</h3>
                            {(midiConnections.inputs.length === currentPreset.inputs.length) && (
                                <div className={'midiManagerInputsTable' + midiManagerMonth}>
                                    {currentPreset.inputs.map(p => (
                                        <div key={p.hardwareIn}
                                                onClick={() => inputDetailAssign(p)}>
                                            <p className={'midiManagerHardwareInputLabel' + midiManagerMonth}>{p.hardwareIn}</p>
                                            <div className={'midiManagerInputEntryDiv' + midiManagerMonth}
                                                    >
                                                <div className={'midiManagerInputControlSwitchDiv' + midiManagerMonth}
                                                    onClick={() => toggleController(p)}>
                                                    <div className={'midiManagerInputControlSwitch' + p.controller + midiManagerMonth}></div>
                                                </div>
                                                    <p className={'midiManagerInputLabel' + midiManagerMonth}>{p.label}</p>
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'midiManagerOutputsPane' + midiManagerMonth}>
                        <div className={'midiManagerInputsContainer' + midiManagerMonth}>
                            <h3 className={'midiManagerInputsPaneLabel' + midiManagerMonth}>Outputs</h3>
                            {(midiConnections.outputs.length === currentPreset.outputs.length) && (
                                <div className={'midiManagerInputsTable' + midiManagerMonth}>
                                    {currentPreset.outputs.map(p => (
                                        <div key={p.hardwareIn}
                                            onClick={() => outputDetailAssign(p)}>
                                            <p className={'midiManagerHardwareInputLabel' + midiManagerMonth}>{p.hardwareIn}</p>
                                            <div className={'midiManagerInputEntryDiv' + midiManagerMonth}>
                                                <div className={'midiManagerInputControlSwitchDiv' + midiManagerMonth}
                                                    onClick={() => toggleReceiver(p)}>
                                                    <div className={'midiManagerInputControlSwitch' + p.activeReciever + midiManagerMonth}></div>
                                                </div>
                                                    <p className={'midiManagerInputLabel' + midiManagerMonth}>{p.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'midiManagerInputDetailsPane' + midiManagerMonth}>
                        <div className={'midiManagerInputDetailContainer' + midiManagerMonth}>
                            <p className={'midiManagerInputDetailLabel' + midiManagerMonth}>input details</p>
                            {(currentInputDetail !== null) && (
                                <div className={'midiManagerInputDetailBox' + midiManagerMonth}>
                                    <p className={'midiManagerMidiInLabelAndPort' + midiManagerMonth}>midi in: {currentInputDetail.hardwareIn}</p>
                                    <p className={'midiManagerMidiInLabelLabel' + midiManagerMonth}>label:</p>
                                    <input
                                        className={'midiManagerInInputForLabel' + midiManagerMonth}
                                        onChange={(e) => updateLabel(e.target.value)}
                                        type="text"
                                        value={currentInputDetail.label}/>
                                    <div className={'midiManagerSelectMidiChannelDiv' + midiManagerMonth}>
                                        <div className={'midiManagerSubDivSelect' + midiManagerMonth}>
                                            <p className={'midiManagerMidiInDeviceLabel' + midiManagerMonth}>device:</p>
                                            <select 
                                                className={'midiManagerDeviceSelect' + midiManagerMonth}
                                                onChange={(e) => changeDevice(e.target.value)}
                                                value={currentInputDetail.deviceUuid}>
                                                {availableDevices.map(device => (
                                                    <option 
                                                        key={device.uuid}
                                                        value={device.uuid}>{device.device}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={'midiManagerMidiChannelOnlyDiv' + midiManagerMonth}>
                                            <p className={'midiManagerInputMidiChannelLabel' + midiManagerMonth}>midi channel:</p>
                                            <input 
                                                className={'midiManagerMidiChannelInputInput' + midiManagerMonth}
                                                max="15"
                                                min="0"
                                                onChange={(e) => changeMidiChannel(e.target.value)}
                                                type="number"
                                                value={currentInputDetail.channel}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'midiManagerOutputDetailsPane' + midiManagerMonth}>
                        <div className={'midiManagerInputDetailContainer' + midiManagerMonth}>
                            <p className={'midiManagerOutputDetailLabel' + midiManagerMonth}>output details</p>
                            {(currentOutputDetail !== null) && (
                                <div className={'midiManagerInputDetailBox' + midiManagerMonth}>
                                    <p className={'midiManagerMidiOutLabelAndPort' + midiManagerMonth}>midi out: {currentOutputDetail.hardwareIn}</p>
                                    <p className={'midiManagerMidiOutLabelLabel' + midiManagerMonth}>label:</p>
                                    <input
                                        className={'midiManagerInInputForLabel' + midiManagerMonth}
                                        onChange={(e) => updateOutputLabel(e.target.value)}
                                        type="text"
                                        value={currentOutputDetail.label}/>
                                    <div className={'midiManagerSelectMidiChannelDiv' + midiManagerMonth}>
                                        <div className={'midiManagerSubDivSelect' + midiManagerMonth}>
                                            <p className={'midiManagerMidiOutDeviceLabel' + midiManagerMonth}>device:</p>
                                            <select 
                                                className={'midiManagerDeviceSelect' + midiManagerMonth}
                                                onChange={(e) => changeOutDevice(e.target.value)}
                                                value={currentOutputDetail.deviceUuid}>
                                                {availableDevices.map(device => (
                                                    <option 
                                                        key={device.uuid}
                                                        value={device.uuid}>{device.device}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={'midiManagerMidiChannelOnlyDiv' + midiManagerMonth}>
                                            <p className={'midiManagerOutputMidiChannelLabel' + midiManagerMonth}>midi channel:</p>
                                            <input 
                                                className={'midiManagerMidiChannelInputInput' + midiManagerMonth}
                                                max="15"
                                                min="0"
                                                onChange={(e) => changeOutMidiChannel(e.target.value)}
                                                type="number"
                                                value={currentOutputDetail.channel}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'midiManagerDeviceDetailsPane' + midiManagerMonth}>
                        {(currentDeviceImage !== null) && (
                            <div>
                                <img className={'midiManagerDeviceImage' + midiManagerMonth}
                                    src={currentDeviceImage}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={'midiManagerNameNewPatchModal' + newPatchModalState + midiManagerMonth}>
                <p className={'midiManagerNewPresetNameLabel' + midiManagerMonth}>new preset name:</p>
                <input className={'midiManagerNewPresetNameInput' + midiManagerMonth}
                    id="midiManagerNewPresetNameInput"
                    placeholder="new preset"
                    type="text"/>
                <div className={'midiManagerNewPresetNameModalButtons' + midiManagerMonth}>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => submitNewPatchName()}>submit</button>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => closeNewPatchModal()}>cancel</button>
                </div>
            </div>
            <div className={'midiManagerNameNewPatchModal' + deleteGuardrailState + midiManagerMonth}>
                <p className={'midiManagerNewPresetNameLabel' + midiManagerMonth}>Are you sure you wish to delete this preset?</p>
                <div className={'midiManagerGuardrailModalButtons' + midiManagerMonth}>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => deleteGuardrailCleared()}>yes</button>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => closeDeleteGuardrail()}>no</button>
                </div>
            </div>
            <div className={'midiManagerNameNewPatchModal' + saveAsModalState + midiManagerMonth}>
                <p className={'midiManagerNewPresetNameLabel' + midiManagerMonth}>Save copy of preset as:</p>
                <input className={'midiManagerNewPresetNameInput' + midiManagerMonth}
                    id="midiManagerSaveAsNameInput"
                    placeholder="copy of preset"
                    type="text"/>
                <div className={'midiManagerNewPresetNameModalButtons' + midiManagerMonth}>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => saveAsSubmit()}>submit</button>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => closeSaveAsModal()}>cancel</button>
                </div>
            </div>
            <div className={panicState + midiManagerMonth}>
                <img src={currentSpinner} />
            </div>
        </div>
    )
    
}

export default MidiManager;