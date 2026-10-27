import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SOLO_LECTURA } from '../../config';

// Importa la imagen de fondo
import backgroundImage from '../../assets/Fondo/background.jpg';

const BuenosDeseos = () => {
  const [deseos, setDeseos] = useState([]);

  // Cargar los deseos desde Firestore.
  // 'BuenosDeseos' es de lectura pública en firestore.rules; el try/catch
  // está para que un fallo de red no tire la página principal completa.
  useEffect(() => {
    const loadDeseos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'BuenosDeseos'));
        setDeseos(querySnapshot.docs.map((documento) => documento.data()));
      } catch (error) {
        console.error('No se pudieron cargar los buenos deseos:', error);
      }
    };

    loadDeseos();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    cssEase: 'linear',
  };

  return (
    <div className="min-h-screen font-GreatVibes bg-ivoryWhite py-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-emeraldGreen mb-8 text-center">Un Mensaje desde el Corazón</h2>
        {deseos.length > 0 ? (
          <Slider {...settings}>
            {deseos.map((deseo, index) => (
              <div key={index} className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md text-center">
                <p className="text-xl md:text-xl italic font-serif text-lightBrown mb-4">&laquo;{deseo.mensaje}&raquo;</p>
                <p className="text-lg md:text-xl font-semibold text-brown">- {deseo.nombre}</p>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-lg text-center">
            {SOLO_LECTURA
              ? 'Aquí aparecerán los mensajes que nos dejaron.'
              : 'No hay deseos aún. Sé el primero en dejar uno.'}
          </p>
        )}

        {/* El formulario quedó en solo lectura tras la boda, así que no tiene
            sentido invitar a usarlo. Ver src/config.js */}
        {!SOLO_LECTURA && (
          <div className="mt-8 text-center">
            <Link
              to="/brindar-deseos"
              className="px-4 py-2 bg-emeraldGreen text-ivoryWhite text-2xl rounded-full hover:bg-limeGreen transition duration-300"
            >
              Bríndanos tus buenos deseos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuenosDeseos;
