import React from 'react';
import '../css/Home.css';
import { Link } from 'react-router-dom';
import bg from '../utils/img/bg.png';
import text from '../utils/img/textpart.png'

export const Home = () => {
    return (
        <div className='container'>
            <nav className='navbar'>
                <h1>LearnSign</h1>
                <Link to='/' className='link' id='home'>HOME</Link>
                <Link to='/signtotext' className='link' id='signtotext'>SIGN TO TEXT CONVERTER</Link>
                <Link to='/learnsign' className='link' id='learnsign'>LEARN SIGN</Link>
            </nav>
            <div className="bg-img">
                <img src={bg} alt="bg" id='signs' />
            </div>
            <div className="text-part">
                <img src={text} alt="text" id='text' />
            </div>
        </div>
    )
}
