import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Calculator = () => {

    const { auth } = useSelector(state => state);

    const navigate = useNavigate();

    let count = 1;

    const clickCount = () => {
        console.log(count);
        return count < 5 ? count ++ : navigate('/login')
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
                            <td><button id='ac' className='btn special'>AC</button></td>

                            <td><button id='sign' className='btn special'>+/-</button></td>

                            <td><button id='percentage' className='btn special'>%</button></td>

                            <td><button id='division' className='btn operator'><i class="fa-solid fa-divide"></i></button></td>
                        </tr>

                        {/* ROW #2 */}
                        <tr>
                            <td><button id='seven' className='btn number'>7</button></td>

                            <td><button id='eight' className='btn number'>8</button></td>

                            <td><button id='nine' className='btn number'>9</button></td>

                            <td><button id='multiplication' className='btn operator' style={{fontSize: '1.25rem'}}><i class="fa-solid fa-xmark"></i></button></td>
                        </tr>

                        {/* ROW #3 */}
                        <tr>
                            <td><button id='four' className='btn number'>4</button></td>

                            <td><button id='five' className='btn number'>5</button></td>

                            <td><button id='six' className='btn number'>6</button></td>

                            <td><button id='subtraction' className='btn operator'><i class="fa-solid fa-minus"></i></button></td>
                        </tr>

                        {/* ROW #4 */}
                        <tr>
                            <td><button id='one' className='btn number'>1</button></td>

                            <td><button id='two' className='btn number'>2</button></td>

                            <td><button id='three' className='btn number'>3</button></td>

                            <td><button id='addition' className='btn operator' onClick={clickCount}><i class="fa-solid fa-plus"></i></button></td>
                        </tr>

                        {/* ROW #5 */}
                        <tr>
                            <td colSpan='2'><button id='zero' className='btn number'><p id='zero'>0</p></button></td>

                            <td><button id='point' className='btn decimal'>.</button></td>

                            <td><button id='equal' className='btn operator'><i class="fa-solid fa-equals"></i></button></td>
                        </tr>
                        </tbody>
                    </table>



                </div>
            </section>
        </div>        
    )
}

export default Calculator;