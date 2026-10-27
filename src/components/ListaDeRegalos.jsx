import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { SOLO_LECTURA, AVISO_SOLO_LECTURA } from '../config';
import backgroundImage from '../assets/Fondo/background.jpg';

const ListaDeRegalos = () => {
  const [regalos, setRegalos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal de confirmación
  const [selectedRegalo, setSelectedRegalo] = useState(null); // Guardar regalo seleccionado

  // Cargar la lista de regalos desde Firestore.
  // 'ListaDeRegalos' es de lectura pública en firestore.rules.
  const loadRegalos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'ListaDeRegalos'));
      setRegalos(querySnapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() })));
    } catch (error) {
      console.error('No se pudo cargar la lista de regalos:', error);
    }
  };

  useEffect(() => {
    loadRegalos();
  }, []);

  // Función para elegir un regalo con confirmación
  const handleElegirRegalo = (id, nombreRegalo) => {
    setSelectedRegalo({ id, nombreRegalo }); // Guardar regalo seleccionado
    setShowConfirmModal(true); // Mostrar modal de confirmación
  };

  // Confirmación para reservar el regalo.
  // Bloqueada por reglas tras la boda; queda por si hay otro evento.
  const confirmElegirRegalo = async () => {
    const { id, nombreRegalo } = selectedRegalo;
    const user = auth.currentUser;
    if (!user) {
      setShowConfirmModal(false);
      return;
    }

    try {
      await updateDoc(doc(db, 'ListaDeRegalos', id), { reservado: true });
      await updateDoc(doc(db, 'invitados', user.uid), {
        regalo: arrayUnion(nombreRegalo), // Acumula los regalos seleccionados
      });

      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      loadRegalos(); // Recargar la lista después de elegir
    } catch (error) {
      console.error('No se pudo reservar el regalo:', error);
    } finally {
      setShowConfirmModal(false); // Cerrar modal de confirmación
    }
  };

  return (
    <div className="min-h-screen bg-ivoryWhite py-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-GreatVibes text-emeraldGreen mb-8 text-center">Lista de Regalos</h2>
        <div className="bg-white bg-opacity-50 shadow-md rounded-lg p-6">
          <p className="text-lg md:text-2xl font-serif text-lightBrown mb-4 text-center">
            {SOLO_LECTURA
              ? `${AVISO_SOLO_LECTURA} Esta era la lista que preparamos.`
              : 'Para nosotros, tu presencia es nuestro mejor regalo, pero si de tu corazón nace regalarnos algo, estaremos infinitamente agradecidos. Puedes seleccionar más de uno si lo deseas.'}
          </p>

          {regalos.length > 0 ? (
            <ul className="list-disc list-inside text-xl md:text-2xl font-serif text-brown space-y-2">
              {regalos.map((regalo) => (
                <li
                  key={regalo.id}
                  className={`p-2 border-b border-lightBrown ${regalo.reservado ? 'text-gray-500' : ''}`}
                >
                  {regalo.nombre}
                  {!regalo.reservado && !SOLO_LECTURA && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => handleElegirRegalo(regalo.id, regalo.nombre)}
                        className="px-4 py-2 bg-emeraldGreen text-ivoryWhite text-sm rounded-full hover:bg-limeGreen transition duration-300"
                      >
                        Elegir
                      </button>
                    </div>
                  )}
                  {regalo.reservado && <span className="ml-4 text-red-700">Reservado</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xl font-serif text-lightBrown text-center">
              La lista de regalos no está disponible en este momento.
            </p>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="px-4 py-2 bg-emeraldGreen font-GreatVibes text-ivoryWhite text-lg rounded-full hover:bg-limeGreen transition duration-300"
            >
              Regresar a Inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de agradecimiento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-GreatVibes text-emeraldGreen">Te lo agradecemos con el alma</h2>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-serif text-brown mb-4">¿Estás seguro de seleccionar este regalo?</h2>
            <p className="mb-4">Recuerda que puedes seleccionar más de un regalo si lo deseas.</p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={confirmElegirRegalo}
                className="px-4 py-2 bg-emeraldGreen text-ivoryWhite rounded-full hover:bg-limeGreen transition duration-300"
              >
                Sí, estoy seguro
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-red-700 text-ivoryWhite rounded-full hover:bg-red-800 transition duration-300"
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

export default ListaDeRegalos;
