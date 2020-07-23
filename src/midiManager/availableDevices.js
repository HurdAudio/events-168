import React, { useState } from 'react';

function AvailableDevices() {
    
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
    
    return availableDevices;
}

export default AvailableDevices;
