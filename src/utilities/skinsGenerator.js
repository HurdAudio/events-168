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
//let arr = [{ skin: '_JanuaryA', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif'}];
//
//for (let i = 0; i < 10; i++) {
//    arr.push({ skin: '_JanuaryC', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' });
//    arr.push({ skin: '_JanuaryB', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' });
//    arr.push({ skin: '_JanuaryA', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' });
//}

//const days = 29
//
//let arr = [];
//
//for (let i = 0; i < 9; i++) {
//    arr.push({ skin: '_FebruaryA', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' });
//}
//for (let i = 0; i < 10; i++) {
//    arr.push({ skin: '_FebruaryB', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' });
//    arr.push({ skin: '_FebruaryC', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' });
//}

const days = 31;

let arr = [ { logo: 'midiPortCropped1', skin: '_MarchA' } ];

for (let i = 0; i < 10; i++) {
    arr.push({ logo: 'midiPortCropped1', skin: '_MarchA' });
    arr.push({ logo: 'keyboard2779734960720', skin: '_MarchB' });
    arr.push({ logo: 'akaiProIcon', skin: '_MarchC' });
}



console.log(randomizeArray(arr, days));