// Antes esta sección saludaba a cada invitado por su nombre, leyéndolo de la
// colección 'invitados' de Firestore con la sesión activa. Al abrir la
// invitación al público se quitó el inicio de sesión, y 'invitados' quedó
// cerrada en firestore.rules porque guarda datos personales de terceros.
// Sin sesión no había nombre que mostrar: el saludo quedaba como un renglón
// vacío. Ahora la invitación es directa.

// Importa la imagen de fondo
import backgroundImage from '../assets/Fondo/background.jpg';

const Invitacion = () => {
  return (
    <div className="bg-cover bg-center p-8 rounded-xl text-center mb-8 mt-4 bg-gradient-to-r from-white via-transparent to-white bg-ivoryWhite"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <p className="flex-1 flex flex-col items-center bg-white bg-opacity-60 p-8 rounded-lg text-4xl md:text-6xl italic font-GreatVibes text-black">
        <span>Tenemos el honor de invitarte a nuestra boda</span>
      </p>
      <blockquote className=" bg-white bg-opacity-50 p-8 rounded-lg text-3xl md:text-2xl italic font-GreatVibes text-lightBrown mb-4 text-justify">
        «El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.
        No se comporta con rudeza, no es egoísta, no se enoja fácilmente, no guarda rencor.
        El amor no se deleita en la maldad sino que se regocija con la verdad. Todo lo disculpa,
        todo lo cree, todo lo espera, todo lo soporta.»
      </blockquote>
      <cite className=" bg-white bg-opacity-85 p-8 rounded-lg text-2xl md:text-xl font-GreatVibes text-lightBrown mb-8 block">Corintios 13:4-7</cite>

    </div>
  );
};

export default Invitacion;
