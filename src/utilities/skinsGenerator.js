'use strict';

function randomizeArray(arr, days) {
    const randomShuffle = Math.floor(Math.random() * 10000) + 4500;
    let index1, index2;
    
    for (let i = 0; i < randomShuffle; i++) {
        index1 = Math.floor(Math.random() * arr.length);
        index2 = Math.floor(Math.random() * arr.length);
        if (index1 !== index2) {
            [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
        }
    }
    if (arr.length !== days) {
        return 'error';
    } else {
        arr.unshift(days);
        return arr;
    }
}


//const days = 31;
//
//let arr = [{ skin: '_JanuaryA', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/spinners/dynamic-scifi-hud-element.gif'}];
//
//for (let i = 0; i < 10; i++) {
//    arr.push({ skin: '_JanuaryC', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/spinners/gear_plant2.gif' });
//    arr.push({ skin: '_JanuaryB', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/spinners/2316bf07d0598a9892debf49f09b4f03.gif' });
//    arr.push({ skin: '_JanuaryA', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/spinners/dynamic-scifi-hud-element.gif' });
//}

const days = 29

let arr = [];

for (let i = 0; i < 9; i++) {
    arr.push({ skin: '_FebruaryA', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/spinners/59097644ada257296db3d19882f84ed6.gif' });
}
for (let i = 0; i < 10; i++) {
    arr.push({ skin: '_FebruaryB', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/spinners/inn-anim-560.gif' });
    arr.push({ skin: '_FebruaryC', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/spinners/21sl_thriftsmells-jumbo-v2.gif' });
}

//const days = 31;
//
//let arr = [ { logo: 'midiPortCropped1', skin: '_MarchA' } ];
//
//for (let i = 0; i < 10; i++) {
//    arr.push({ logo: 'midiPortCropped1', skin: '_MarchA' });
//    arr.push({ logo: 'keyboard2779734960720', skin: '_MarchB' });
//    arr.push({ logo: 'akaiProIcon', skin: '_MarchC' });
//}



console.log(randomizeArray(arr, days));