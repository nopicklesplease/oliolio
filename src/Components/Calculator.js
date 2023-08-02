import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const SaveButtonStyled = styled(Button)({
    '&:hover': {
        color: 'black',
        backgroundColor: '#999999',
    },
})

const Calculator = () => {

    const { auth } = useSelector(state => state);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [clicked, setClicked] = useState(false);

    console.log('isClicked?', clicked);

    // useEffect(() => {
    //     let alert = localStorage.getItem('alert')
    //     if(!alert){
    //         setPopupVisible(true);
    //         localStorage.setItem('alert', 1);
    //     }
    // }, []);

    const navigate = useNavigate();

    const checkClicked = () => {
        if(!clicked){
            setPopupVisible(true);
            setClicked(true);
        }
    }

    const popupWindow = useRef(null);

    const closePopupWindow = (e) => {
        if(popupWindow.current && !popupWindow.current.contains(e.target)){
            setPopupVisible(false);
        }
    }

    document.addEventListener('mousedown', closePopupWindow)

    let count = 1;

    const clickCount = () => {
        console.log(count);
        return count < 5 ? count ++ : navigate('/login')
    }

    const closeOut = () => {
        setPopupVisible(false);
    }

    return(
        <div id='body'>
            <section>
                <div className='container'>

                    {/* PANEL */}
                    <div className='panel'>
                        <p className='result'>0</p>
                    </div>

                    {/* BUTTONS */}
                    <table>
                        <tbody>
                        {/* ROW #1 */}
                        <tr>
                            <td><button id='ac' onClick={() => checkClicked() } className='btn special'>AC</button></td>

                            <td><button onClick={() => checkClicked() } id='sign' className='btn special'>+/-</button></td>

                            <td><button onClick={() => checkClicked() } id='percentage' className='btn special'>%</button></td>

                            <td><button onClick={() => checkClicked() } id='division' className='btn operator'><i className="fa-solid fa-divide"></i></button></td>
                        </tr>

                        {/* ROW #2 */}
                        <tr>
                            <td><button onClick={() => checkClicked() } id='seven' className='btn number'>7</button></td>

                            <td><button onClick={() => checkClicked() } id='eight' className='btn number'>8</button></td>

                            <td><button onClick={() => checkClicked() } id='nine' className='btn number'>9</button></td>

                            <td><button onClick={() => checkClicked() } id='multiplication' className='btn operator' style={{fontSize: '1.25rem'}}><i className="fa-solid fa-xmark"></i></button></td>
                        </tr>

                        {/* ROW #3 */}
                        <tr>
                            <td><button onClick={() => checkClicked() } id='four' className='btn number'>4</button></td>

                            <td><button onClick={() => checkClicked() } id='five' className='btn number'>5</button></td>

                            <td><button onClick={() => checkClicked() } id='six' className='btn number'>6</button></td>

                            <td><button onClick={() => checkClicked() } id='subtraction' className='btn operator'><i className="fa-solid fa-minus"></i></button></td>
                        </tr>

                        {/* ROW #4 */}
                        <tr>
                            <td><button onClick={() => checkClicked() } id='one' className='btn number'>1</button></td>

                            <td><button onClick={() => checkClicked() } id='two' className='btn number'>2</button></td>

                            <td><button onClick={() => checkClicked() } id='three' className='btn number'>3</button></td>

                            <td><button id='addition' className='btn operator' onClick={clickCount}><i className="fa-solid fa-plus"></i></button></td>
                        </tr>

                        {/* ROW #5 */}
                        <tr>
                            <td colSpan='2'><button onClick={() => checkClicked() } id='zero' className='btn number'><p id='zero'>0</p></button></td>

                            <td><button onClick={() => checkClicked() } id='point' className='btn decimal'>.</button></td>

                            <td><button onClick={() => checkClicked() } id='equal' className='btn operator'><i className="fa-solid fa-equals"></i></button></td>
                        </tr>
                        </tbody>
                    </table>



                </div>
            </section>
            {isPopupVisible && (
                <div className='modalBackground-dark'>
                    <h1>WELCOME</h1>
                    <div ref={ popupWindow } className='modalContainer-dark'>
                        <div className='modal-p'>Just-A-Calculator is a Bitcoin portfolio tracker camouflaged as an iOS calculator.</div>

                        <div className='modal-p'>It is currently in beta testing mode. Please excuse any imperfections.</div>

                        <div className='modal-p'>Click the <span className='modal-plus'>+</span> button five times to access the hidden log in.</div>

                        <div className='popup-buttons'>

                        <SaveButtonStyled 
                            sx={{
                                color: 'white',
                                backgroundColor: '#fc8d0c',
                            }}
                            onClick={() => closeOut()}>
                                close
                        </SaveButtonStyled>
                        </div>
                    </div>
                </div>
            )}
        </div>        
    )
}

export default Calculator;