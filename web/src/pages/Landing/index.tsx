import React from 'react';
import { Link } from 'react-router-dom';

import './index.scss';

import logoImg from '../../assets/logo.svg';
import { FiArrowRight } from 'react-icons/fi';

const Landing: React.FC = () => {
    return (
        <div id="page-landing">
            <div className="content-wrapper">
                <img src={logoImg} alt="Happy" />

                <main>
                    <h1>Leve felicidade para o mundo</h1>
                    <p>Visite orfanatos e mude o dia de muitas crianças.</p>
                </main>

                <div className="location">
                    <strong>Rio Grande do sul</strong>
                    <span>Porto Alegre</span>
                </div>

                <Link to='/app' className="enter-app">
                    <FiArrowRight size={26} color='rgba(0,0,0,0.6)' />
                </Link>
            </div>
        </div>
    );
}

export default Landing;