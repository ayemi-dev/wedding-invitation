import { useEffect, useRef } from 'react';
import loadGoogleMapsScript, { hayLlaveDeMapas } from '../utils/loadGoogleMaps';
import { GOOGLE_MAPS_ACIENDA_UBICACION } from '../constants';

const UBICACION = { lat: 19.701290130615234, lng: -99.05195617675781 };
const TITULO = 'Hacienda Azalaga';

const ReceptionMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!hayLlaveDeMapas) return;

    loadGoogleMapsScript(() => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: UBICACION,
      });

      new window.google.maps.Marker({
        position: UBICACION,
        map,
        title: TITULO,
      });
    });
  }, []);

  // Sin llave de Maps el recuadro quedaría en blanco. Mejor un enlace que
  // sí lleva a la ubicación.
  if (!hayLlaveDeMapas) {
    return (
      <div className="bg-white bg-opacity-70 rounded-lg p-8 text-center">
        <p className="text-2xl text-lightBrown mb-4 font-serif">{TITULO}</p>
        <a
          href={GOOGLE_MAPS_ACIENDA_UBICACION}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-4 py-2 bg-emeraldGreen text-ivoryWhite text-2xl rounded-full hover:bg-limeGreen transition duration-300"
        >
          Abrir en Google Maps
        </a>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      role="img"
      aria-label={`Mapa de ${TITULO}`}
      style={{ width: '100%', height: '500px' }}
    ></div>
  );
};

export default ReceptionMap;
