import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { FaMusic, FaPause } from 'react-icons/fa';
import song from '../assets/music/loveYouStill.mp3';
import Cover from './Cover';
import CeremonyAndReception from './CeremonyAndReception';
import Retratos from './Retratos';
import Invitacion from './Invitacion';
import Regalos from './Regalos';
import Fiesta from './Fiesta';
import CompartirFotos from './CompartirFotos';
import BuenosDeseos from './firebaseComponents/BuenosDeseos';
import Footer from './Footer';

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { stop }] = useSound(song, { loop: true });

  // La música arranca en pausa a propósito. Los navegadores bloquean el
  // audio automático sin un gesto previo de la persona, y de todas formas
  // abrir con sonido sin avisar es una mala forma de recibir a alguien.
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const toggleMusic = () => {
    if (isPlaying) {
      stop();
      setIsPlaying(false);
    } else {
      play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-lightIvory">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="container mx-auto p-1">
          <Cover />
          <Invitacion />
          <CeremonyAndReception />
          <Retratos />
          <Fiesta />
          <CompartirFotos />
          <Regalos />
          <BuenosDeseos />
          <Footer />
        </div>
        <button
          type="button"
          onClick={toggleMusic}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? 'Pausar la música' : 'Reproducir la música'}
          title={isPlaying ? 'Pausar la música' : 'Reproducir la música'}
          className="fixed bottom-4 right-4 p-3 bg-emeraldGreen text-ivoryWhite text-lg rounded-full hover:bg-limeGreen transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emeraldGreen"
        >
          {isPlaying ? <FaPause aria-hidden="true" /> : <FaMusic aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
};

export default Home;
