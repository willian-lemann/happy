import React, { useState, useEffect } from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../config/AxiosConfig';

import mapMarkerImg from '../../assets/map-marker.svg';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import './index.scss';
import mapIcon from '../../utils/mapIcon';

import { Orphanage } from '../../interfaces';

const OrphanagesMap: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useEffect(() => {
        const LoadOrphanages = async () => {
            const response = await api.get('/orphanages');

            setOrphanages(response.data);
        };

        LoadOrphanages();
    }, []);

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Rio grande do sul</strong>
                    <span>Porto Alegre</span>
                </footer>
            </aside>

            <Map
                center={[
                    -29.9935808, -51.0645078
                ]}
                zoom={15}
                style={{
                    width: '100%',
                    height: '100%'
                }}>
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/mapbox/${darkMode ? 'dark' : 'light'}-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
 
                {orphanages.map(({ latitude, longitude, id, name }) => (
                    <Marker
                        key={id}
                        icon={mapIcon}
                        position={[latitude, longitude]}>
                        <Popup
                            closeButton={false}
                            minWidth={240}
                            maxWidth={240}
                            className='map-popup'>
                            {name}
                            <Link to={`/orphanages/${id}`}>
                                <FiArrowRight size={20} color='#fff' />
                            </Link>
                        </Popup>
                    </Marker>
                ))}
            </Map>

            <Link to='/orphanages/create' className='create-orphanage'>
                <FiPlus size={32} color='#fff' />
            </Link>


            <div className='dark-mode-select'>
                <label htmlFor="ChangeTheme">
                    <input type="checkbox" id="ChangeTheme" onClick={() => setDarkMode(!darkMode)} /> <span className="slide"></span>
                </label>
            </div>
        </div>
    );
}

export default OrphanagesMap;