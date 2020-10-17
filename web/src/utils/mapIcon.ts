import { icon } from 'leaflet';
import mapMarkerImg from '../assets/map-marker.svg';

const mapIcon = icon({
   iconUrl: mapMarkerImg,
   iconSize: [58, 68],
   iconAnchor: [29, 68],
   popupAnchor: [170, 2]
});

export default mapIcon;