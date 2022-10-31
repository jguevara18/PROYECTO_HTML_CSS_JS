
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#form');
const resultado = document.querySelector('#result');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});


document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});


function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then( respuesta => respuesta.json()) 
        .then( resultado => obtenerCriptomonedas(resultado.Data))  
        .then( criptomonedas  =>  selectCriptomonedas(criptomonedas) )
        .catch( error => console.log(error));

}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
    
}


function leerValor(f)  {
    objBusqueda[f.target.name] = f.target.value;
}

function submitFormulario(f) {
    f.preventDefault();

    
    const { moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    consultarAPI();
}


function mostrarAlerta(mensaje) {
        
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
}


function consultarAPI() {
    const { moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)  
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
        verCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
}

function verCotizacionHTML(cotizacion) {

    limpiarHTML();

    console.log(cotizacion);
    const  { PRICE, HIGHDAY, LOWDAY, CHANGE24HOUR , LASTUPDATE } = cotizacion;


    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es:${PRICE}`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Cotizacion maxima del dia: ${HIGHDAY} </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Cotizacion minima del día: ${LOWDAY} </p>`;

    const cambioDia = document.createElement('p');
    cambioDia.innerHTML = `<p>Cambios en 24 horas:${CHANGE24HOUR}</p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización: ${LASTUPDATE}</p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(cambioDia);
    resultado.appendChild(ultimaActualizacion);
    formulario.appendChild(resultado);
}


function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}