import React, { useState } from 'react';
import midi5pin from '../img/midi5pin.svg';
import './landing.style.jana.css';

function Landing() {
    
    const [landingMonth, setLandingMonth] = useState('_JanuaryA');
    const [midiImageClass, setMidiImageClass] = useState('midiImage');
    
    const adjustImage = (colString, rowString) => {
        setMidiImageClass('midiImage' + colString + rowString);
    }
    
    
        return(
            <div class={'container' + landingMonth}>
                <div class={'imageDiv' + landingMonth}>
                    <div class={'col1row1' + landingMonth} onMouseOver={() => adjustImage('col1', 'row1')}></div>
                    <div class={'col2row1' + landingMonth} onMouseOver={() => adjustImage('col2', 'row1')}></div>
                    <div class={'col3row1' + landingMonth} onMouseOver={() => adjustImage('col3', 'row1')}></div>
                    <div class={'col4row1' + landingMonth} onMouseOver={() => adjustImage('col4', 'row1')}></div>
                    <div class={'col5row1' + landingMonth} onMouseOver={() => adjustImage('col5', 'row1')}></div>
                    <div class={'col6row1' + landingMonth} onMouseOver={() => adjustImage('col6', 'row1')}></div>
                    <div class={'col7row1' + landingMonth} onMouseOver={() => adjustImage('col7', 'row1')}></div>
                    <div class={'col8row1' + landingMonth} onMouseOver={() => adjustImage('col8', 'row1')}></div>
                    <div class={'col1row2' + landingMonth} onMouseOver={() => adjustImage('col1', 'row2')}></div>
                    <div class={'col2row2' + landingMonth} onMouseOver={() => adjustImage('col2', 'row2')}></div>
                    <div class={'col3row2' + landingMonth} onMouseOver={() => adjustImage('col3', 'row2')}></div>
                    <div class={'col4row2' + landingMonth} onMouseOver={() => adjustImage('col4', 'row2')}></div>
                    <div class={'col5row2' + landingMonth} onMouseOver={() => adjustImage('col5', 'row2')}></div>
                    <div class={'col6row2' + landingMonth} onMouseOver={() => adjustImage('col6', 'row2')}></div>
                    <div class={'col7row2' + landingMonth} onMouseOver={() => adjustImage('col7', 'row2')}></div>
                    <div class={'col8row2' + landingMonth} onMouseOver={() => adjustImage('col8', 'row2')}></div>
                    <div class={'col1row3' + landingMonth} onMouseOver={() => adjustImage('col1', 'row3')}></div>
                    <div class={'col2row3' + landingMonth} onMouseOver={() => adjustImage('col2', 'row3')}></div>
                    <div class={'col3row3' + landingMonth} onMouseOver={() => adjustImage('col3', 'row3')}></div>
                    <div class={'col4row3' + landingMonth} onMouseOver={() => adjustImage('col4', 'row3')}></div>
                    <div class={'col5row3' + landingMonth} onMouseOver={() => adjustImage('col5', 'row3')}></div>
                    <div class={'col6row3' + landingMonth} onMouseOver={() => adjustImage('col6', 'row3')}></div>
                    <div class={'col7row3' + landingMonth} onMouseOver={() => adjustImage('col7', 'row3')}></div>
                    <div class={'col8row3' + landingMonth} onMouseOver={() => adjustImage('col8', 'row3')}></div>
                    <div class={'col1row4' + landingMonth} onMouseOver={() => adjustImage('col1', 'row4')}></div>
                    <div class={'col2row4' + landingMonth} onMouseOver={() => adjustImage('col2', 'row4')}></div>
                    <div class={'col3row4' + landingMonth} onMouseOver={() => adjustImage('col3', 'row4')}></div>
                    <div class={'col4row4' + landingMonth} onMouseOver={() => adjustImage('col4', 'row4')}></div>
                    <div class={'col5row4' + landingMonth} onMouseOver={() => adjustImage('col5', 'row4')}></div>
                    <div class={'col6row4' + landingMonth} onMouseOver={() => adjustImage('col6', 'row4')}></div>
                    <div class={'col7row4' + landingMonth} onMouseOver={() => adjustImage('col7', 'row4')}></div>
                    <div class={'col8row4' + landingMonth} onMouseOver={() => adjustImage('col8', 'row4')}></div>
                    <div class={'col1row5' + landingMonth} onMouseOver={() => adjustImage('col1', 'row5')}></div>
                    <div class={'col2row5' + landingMonth} onMouseOver={() => adjustImage('col2', 'row5')}></div>
                    <div class={'col3row5' + landingMonth} onMouseOver={() => adjustImage('col3', 'row5')}></div>
                    <div class={'col4row5' + landingMonth} onMouseOver={() => adjustImage('col4', 'row5')}></div>
                    <div class={'col5row5' + landingMonth} onMouseOver={() => adjustImage('col5', 'row5')}></div>
                    <div class={'col6row5' + landingMonth} onMouseOver={() => adjustImage('col6', 'row5')}></div>
                    <div class={'col7row5' + landingMonth} onMouseOver={() => adjustImage('col7', 'row5')}></div>
                    <div class={'col8row5' + landingMonth} onMouseOver={() => adjustImage('col8', 'row5')}></div>
                    <div class={'col1row6' + landingMonth} onMouseOver={() => adjustImage('col1', 'row6')}></div>
                    <div class={'col2row6' + landingMonth} onMouseOver={() => adjustImage('col2', 'row6')}></div>
                    <div class={'col3row6' + landingMonth} onMouseOver={() => adjustImage('col3', 'row6')}></div>
                    <div class={'col4row6' + landingMonth} onMouseOver={() => adjustImage('col4', 'row6')}></div>
                    <div class={'col5row6' + landingMonth} onMouseOver={() => adjustImage('col5', 'row6')}></div>
                    <div class={'col6row6' + landingMonth} onMouseOver={() => adjustImage('col6', 'row6')}></div>
                    <div class={'col7row6' + landingMonth} onMouseOver={() => adjustImage('col7', 'row6')}></div>
                    <div class={'col8row6' + landingMonth} onMouseOver={() => adjustImage('col8', 'row6')}></div>
                    <div class={'col1row7' + landingMonth} onMouseOver={() => adjustImage('col1', 'row7')}></div>
                    <div class={'col2row7' + landingMonth} onMouseOver={() => adjustImage('col2', 'row7')}></div>
                    <div class={'col3row7' + landingMonth} onMouseOver={() => adjustImage('col3', 'row7')}></div>
                    <div class={'col4row7' + landingMonth} onMouseOver={() => adjustImage('col4', 'row7')}></div>
                    <div class={'col5row7' + landingMonth} onMouseOver={() => adjustImage('col5', 'row7')}></div>
                    <div class={'col6row7' + landingMonth} onMouseOver={() => adjustImage('col6', 'row7')}></div>
                    <div class={'col7row7' + landingMonth} onMouseOver={() => adjustImage('col7', 'row7')}></div>
                    <div class={'col8row7' + landingMonth} onMouseOver={() => adjustImage('col8', 'row7')}></div>
                    <div class={'col1row8' + landingMonth} onMouseOver={() => adjustImage('col1', 'row8')}></div>
                    <div class={'col2row8' + landingMonth} onMouseOver={() => adjustImage('col2', 'row8')}></div>
                    <div class={'col3row8' + landingMonth} onMouseOver={() => adjustImage('col3', 'row8')}></div>
                    <div class={'col4row8' + landingMonth} onMouseOver={() => adjustImage('col4', 'row8')}></div>
                    <div class={'col5row8' + landingMonth} onMouseOver={() => adjustImage('col5', 'row8')}></div>
                    <div class={'col6row8' + landingMonth} onMouseOver={() => adjustImage('col6', 'row8')}></div>
                    <div class={'col7row8' + landingMonth} onMouseOver={() => adjustImage('col7', 'row8')}></div>
                    <div class={'col8row8' + landingMonth} onMouseOver={() => adjustImage('col8', 'row8')}></div>
                </div>
                <img className={midiImageClass + landingMonth} src={midi5pin}></img>
            </div>
        
        );
    
}

export default Landing;