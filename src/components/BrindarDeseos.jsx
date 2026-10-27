import { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { SOLO_LECTURA, AVISO_SOLO_LECTURA } from '../config';
// Importa la imagen de fondo
import backgroundImage from '../assets/Fondo/background.jpg';

const BrindarDeseos = () => {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('Anónimo');
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el pop-up
  const navigate = useNavigate();

  useEffect(() => {
    if (SOLO_LECTURA) return;

    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // La colección 'invitados' está cerrada en firestore.rules, así que
      // esto falla salvo que se vuelvan a abrir las reglas. Si falla, el
      // deseo se firma como anónimo en lugar de romper la pantalla.
      try {
        const docRef = doc(db, 'invitados', user.uid);
        const docSnap = await getDoc(docRef);
        setNombre(docSnap.exists() ? docSnap.data().nombre : 'Anónimo');
      } catch {
        setNombre('Anónimo');
      }
    };

    fetchUserName();
  }, []);

  const handleEnviarDeseo = async () => {
    if (mensaje.trim() === '') {
      setError('El mensaje no puede estar vacío.');
      return;
    }

    try {
      await addDoc(collection(db, 'BuenosDeseos'), {
        nombre,
        mensaje,
      });

      setShowPopup(true); // Mostrar el pop-up

      setTimeout(() => {
        setShowPopup(false); // Ocultar el pop-up
        navigate('/'); // Redirigir al inicio después de 2 segundos
      }, 2000);
    } catch {
      setError('Hubo un error al enviar tus deseos. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-lightIvory py-12 flex flex-col items-center justify-center font-GreatVibes bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md p-8 bg-white bg-opacity-50 rounded-lg shadow-md">
        <h2 className="text-4xl text-emeraldGreen mb-8 text-center">Bríndanos tus buenos deseos</h2>

        {SOLO_LECTURA ? (
          <p className="text-xl text-center text-lightBrown mb-6 font-serif">
            {AVISO_SOLO_LECTURA} Los mensajes que nos dejaron siguen en la
            página principal.
          </p>
        ) : (
          <>
            <label htmlFor="mensaje-deseo" className="sr-only">
              Tus buenos deseos
            </label>
            <textarea
              id="mensaje-deseo"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe aquí tus buenos deseos..."
              rows="5"
              className="w-full px-4 py-2 border rounded-lg mb-4 text-xl"
            ></textarea>
            {error && <p className="text-red-600 mb-4" role="alert">{error}</p>}
            <button
              type="button"
              onClick={handleEnviarDeseo}
              className="w-full px-4 py-2 bg-emeraldGreen text-ivoryWhite text-2xl rounded-full hover:bg-limeGreen transition duration-300 mb-4"
            >
              Enviar Deseo
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full px-4 py-2 bg-emeraldGreen text-white text-2xl rounded-full hover:bg-brownLight transition duration-300"
        >
          Volver
        </button>
      </div>

      {/* Pop-up que aparece después de enviar un deseo */}
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl text-emeraldGreen mb-4">¡Gracias por tus buenos deseos!</h3>
            <p>Serás redirigido en breve...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrindarDeseos;
