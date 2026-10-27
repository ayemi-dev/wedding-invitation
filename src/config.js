export const EVENT_DATE = new Date('2024-12-14T00:00:00');

// La boda ya ocurrió. El sitio queda publicado como recuerdo y como
// demostración, así que todo lo que escribía en Firestore pasa a solo
// lectura: confirmar asistencia, reservar un regalo, sugerir una canción y
// dejar un buen deseo.
//
// Las reglas de firestore.rules ya bloquean esas escrituras del lado del
// servidor, que es donde cuenta. Esta bandera existe para que la interfaz
// lo diga con claridad en lugar de mostrar un botón que falla con
// «permission-denied».
//
// Si algún día hay otro evento: pon esto en false y ajusta firestore.rules.
export const SOLO_LECTURA = true;

// Texto único para las cuatro pantallas que antes capturaban datos.
export const AVISO_SOLO_LECTURA =
  'La boda se celebró el 14 de diciembre de 2024. Dejamos la invitación en línea como recuerdo, así que esta sección ya solo se puede consultar.';
