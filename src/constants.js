// Enlaces públicos a Google Maps. No necesitan llave de API: son las URL
// que cualquiera puede copiar desde el navegador.
export const GOOGLE_MAPS_IGLESIA_UBICACION = `https://www.google.com.mx/maps/place/Iglesia+de+Santa+Mar%C3%ADa+Tonanitla,+18+de+Noviembre,+Villas+de+Santa+Mar%C3%ADa,+Santa+Mar%C3%ADa+Tonanitla,+55789+Santa+Mar%C3%ADa+Tonanitla,+M%C3%A9x./@19.6876838,-99.0560563,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f2e301052ae1:0x9cb1d57d20d62f50!8m2!3d19.6877097!4d-99.0535672!16s%2Fg%2F11bvtjv2sc?entry=ttu`;
export const GOOGLE_MAPS_ACIENDA_UBICACION = `https://www.google.com/maps/place/Hacienda+Azalaga/@19.7012949,-99.0545434,17z/data=!3m1!4b1!4m6!3m5!1s0x85d1f3383287228b:0xe81b7bb5d5b06c5a!8m2!3d19.7012899!4d-99.0519685!16s%2Fg%2F11pv2lll0h?hl=es-MX&entry=ttu`;

// Se eliminaron GOOGLE_MAPS_LINK_PARROQUIA y GOOGLE_MAPS_LINK_ACIENDA:
// llevaban la llave de la API de Maps escrita en un repositorio público y
// ningún componente las usaba. La carga del SDK vive en
// src/utils/loadGoogleMaps.js y toma la llave del entorno.
