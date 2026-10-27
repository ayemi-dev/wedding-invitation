// Carga del SDK de Google Maps.
//
// La llave venía escrita en el código, en un repositorio público. Ahora sale
// del entorno (ver .env.example). Ojo: una llave de Maps del lado del cliente
// siempre viaja en el paquete que descarga el navegador, eso es inevitable.
// Lo que de verdad la protege es restringirla por referente HTTP en la consola
// de Google Cloud. Sacarla del código evita además que la recojan los robots
// que rastrean repositorios públicos buscando cadenas 'AIzaSy'.

const LLAVE = import.meta.env.VITE_GOOGLE_MAPS_KEY;

// Los componentes de mapa consultan esto para mostrar una alternativa
// razonable cuando no hay llave, en lugar de un recuadro vacío.
export const hayLlaveDeMapas = Boolean(LLAVE);

let cargaEnCurso = null;

const loadGoogleMapsScript = (callback) => {
  if (!LLAVE) {
    console.warn(
      'VITE_GOOGLE_MAPS_KEY no está definida: no se carga el mapa interactivo.'
    );
    return;
  }

  // Una sola promesa compartida. Antes, dos mapas montados a la vez
  // insertaban el script dos veces y la API se quejaba por consola.
  if (!cargaEnCurso) {
    cargaEnCurso = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js' +
        `?key=${encodeURIComponent(LLAVE)}` +
        '&libraries=maps,marker&v=weekly';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  cargaEnCurso
    .then(callback)
    .catch(() => console.error('No se pudo cargar el SDK de Google Maps.'));
};

export default loadGoogleMapsScript;
