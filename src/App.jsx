import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CeremonyLocation from './components/CeremonyLocation';
import ReceptionLocation from './components/ReceptionLocation';
import Regalos from './components/Regalos';
import ListaDeRegalos from './components/ListaDeRegalos';
import Musica from './components/Musica';
import DressCode from './components/DressCode';
import TipsNotas from './components/TipsNotas';
import ConfirmarAsistencia from './components/ConfirmarAsistencia';
import BrindarDeseos from './components/BrindarDeseos';

// RegisterGuest y GenerateGiftList eran utilidades de administración para
// sembrar las colecciones 'invitados' y 'ListaDeRegalos'. Nunca tuvieron
// ruta y ahora firestore.rules bloquea esas escrituras. Los archivos siguen
// en el repositorio como referencia, pero ya no se importan aquí.


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ceremony-location" element={<CeremonyLocation />} />
        <Route path="/reception-location" element={<ReceptionLocation />} />
        <Route path="/regalos" element={<Regalos/>} />
        <Route path="/lista-de-regalos" element={<ListaDeRegalos/>} />
        <Route path="/musica" element={<Musica/>} />
        <Route path="/dress-code" element={<DressCode/>} />
        <Route path="/tips-notas" element={<TipsNotas/>} />
        <Route path="/confirmar-asistencia" element={<ConfirmarAsistencia/>} />
        <Route path="/brindar-deseos" element={<BrindarDeseos/>} />
      </Routes>
    </Router>

    //<RegisterGuest/>
  );
}

export default App
