import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { db, auth } from '../../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { SOLO_LECTURA, AVISO_SOLO_LECTURA } from '../config';
import backgroundImage from '../assets/Fondo/background.jpg';

// El aviso por WhatsApp salía con el teléfono y la apikey de CallMeBot
// escritos en el código, en un repositorio público. Ahora vienen del
// entorno; si no están definidos, simplemente no se envía nada.
// Ver .env.example
const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE;
const CALLMEBOT_APIKEY = import.meta.env.VITE_CALLMEBOT_APIKEY;

const ConfirmarAsistencia = () => {
  const [asistencia, setAsistencia] = useState('Asistiré :)');
  const [pasesConfirmados, setPasesConfirmados] = useState(1);
  const [numeroPases, setNumeroPases] = useState(1);
  const [invitado, setInvitado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [confirmacionRealizada, setConfirmacionRealizada] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  const location = useLocation();

  // La aplicación usa HashRouter: se puede entrar directo a
  // #/confirmar-asistencia sin pasar por el enlace que trae el state.
  // Antes eso reventaba al desestructurar location.state (null).
  const { eventTitle, isCeremony } = location.state ?? {};
  const tituloPantalla = eventTitle ?? 'Confirmar asistencia';

  useEffect(() => {
    if (SOLO_LECTURA) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const invitadoDoc = await getDoc(doc(db, 'invitados', user.uid));
        if (!invitadoDoc.exists()) return;

        const invitadoData = invitadoDoc.data();
        setInvitado(invitadoData);
        setNombre(invitadoData.nombre);
        setNumeroPases(invitadoData.numeroPases);
        setConfirmacionRealizada(
          isCeremony
            ? invitadoData.confirmacionRealizadaCeremonia
            : invitadoData.confirmacionRealizadaRecepcion
        );
        setPasesConfirmados(invitadoData.numeroPasesConfirmados || 1);
        setAsistencia(
          (isCeremony ? invitadoData.confirmacionCeremonia : invitadoData.confirmacionRecepcion)
            ? 'Asistiré :)'
            : 'No me es posible :('
        );
      } catch (error) {
        console.error('No se pudo leer la ficha del invitado:', error);
      }
    });

    return () => unsubscribe();
  }, [isCeremony]);

  const handleConfirm = async () => {
    if (!auth.currentUser || !invitado) return;

    try {
      await updateDoc(doc(db, 'invitados', auth.currentUser.uid), {
        [isCeremony ? 'confirmacionCeremonia' : 'confirmacionRecepcion']: asistencia === 'Asistiré :)',
        [isCeremony ? 'confirmacionRealizadaCeremonia' : 'confirmacionRealizadaRecepcion']: true,
        [isCeremony ? 'pasesConfirmadosCeremonia' : 'pasesConfirmadosRecepcion']: pasesConfirmados,
      });
      setConfirmacionRealizada(true);
    } catch (error) {
      console.error('No se pudo guardar la confirmación:', error);
      return;
    }

    if (!WHATSAPP_PHONE || !CALLMEBOT_APIKEY) return;

    const eventType = isCeremony ? 'Ceremonia' : 'Recepción';
    const message = `${nombre} ha confirmado para ${eventType}. Número de pases: ${pasesConfirmados}. Asistencia: ${asistencia}`;
    const apiUrl =
      'https://api.callmebot.com/whatsapp.php' +
      `?phone=${encodeURIComponent(WHATSAPP_PHONE)}` +
      `&text=${encodeURIComponent(message)}` +
      `&apikey=${encodeURIComponent(CALLMEBOT_APIKEY)}`;

    try {
      await fetch(apiUrl);
    } catch (error) {
      console.error('Error al enviar la confirmación a través de WhatsApp:', error);
    }
  };

  const handleModalConfirm = () => {
    handleConfirm();
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-lightIvory py-12 flex flex-col items-center justify-center font-GreatVibes bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md p-8 bg-lightIvory bg-opacity-50 rounded-lg shadow-md">
        <h2 className="text-4xl text-emeraldGreen mb-8 text-center">{tituloPantalla}</h2>

        {SOLO_LECTURA ? (
          <p className="text-2xl text-center text-lightBrown mb-8 font-serif">
            {AVISO_SOLO_LECTURA} Gracias a quienes nos acompañaron.
          </p>
        ) : confirmacionRealizada ? (
          <div className="text-center text-emeraldGreen text-2xl mb-8">
            {asistencia === 'Asistiré :)' ? (
              <p>¡Gracias por confirmar! Nos encantará verte el 14 de diciembre.</p>
            ) : (
              <p>
                Lo sentimos mucho que no puedas asistir, pero entendemos. Nos envías tus mejores
                deseos y eso es lo que cuenta.
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-center text-2xl mb-4">{nombre}, nos encantaría que nos acompañaras.</p>
            <div className="mb-4 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setAsistencia('Asistiré :)')}
                aria-pressed={asistencia === 'Asistiré :)'}
                className={`flex items-center px-4 py-2 space-x-2 ${asistencia === 'Asistiré :)' ? 'bg-emeraldGreen text-ivoryWhite' : 'bg-gray-600 text-white'} rounded-full transition duration-300`}
              >
                <FaCheckCircle aria-hidden="true" />
                <span>Asistiré :)</span>
              </button>
              <button
                type="button"
                onClick={() => setAsistencia('No me es posible :(')}
                aria-pressed={asistencia === 'No me es posible :('}
                className={`flex items-center px-4 py-2 space-x-2 ${asistencia === 'No me es posible :(' ? 'bg-emeraldGreen text-ivoryWhite' : 'bg-gray-600 text-white'} rounded-full transition duration-300`}
              >
                <FaTimesCircle aria-hidden="true" />
                <span>No me es posible :(</span>
              </button>
            </div>
            {asistencia === 'Asistiré :)' && (
              <div className="mb-4">
                <label htmlFor="numero-pases" className="block text-lg mb-2">Número de Pases:</label>
                <select
                  id="numero-pases"
                  value={pasesConfirmados}
                  onChange={(e) => setPasesConfirmados(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {Array.from({ length: numeroPases }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowModal(true)} // Abrir el modal en lugar de confirmar directamente
              className="w-full px-4 py-2 bg-emeraldGreen text-ivoryWhite text-lg rounded-full hover:bg-limeGreen transition duration-300 mb-4"
            >
              Confirmar Asistencia
            </button>
          </>
        )}

        <div className="text-center">
          <Link
            to="/"
            className="px-4 py-2 bg-emeraldGreen text-ivoryWhite text-lg rounded-full hover:bg-limeGreen transition duration-300"
          >
            Volver
          </Link>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl text-emeraldGreen mb-4">¿Estás seguro de tu selección?</h2>
            <p className="mb-4">Has elegido: {asistencia}</p>
            {asistencia === 'Asistiré :)' && (
              <p>Número de pases confirmados: {pasesConfirmados}</p>
            )}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleModalConfirm}
                className="px-4 py-2 bg-emeraldGreen text-ivoryWhite rounded-full"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-700 text-ivoryWhite rounded-full"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmarAsistencia;
