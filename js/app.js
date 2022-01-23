// Constructores
function Seguro( marca, year, tipo ) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

function UI() {}

// Prototype
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');
    for( let i = max; i >= min; i-- ){
        let opcion = document.createElement('option');
        opcion.value = i;
        opcion.textContent = i;
        selectYear.appendChild(opcion);
    }
}

UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const btn = document.querySelector('#btn-submit');
    const div = document.createElement('div');
    const spinner = document.querySelector('#spinner');

    btn.disabled = true;
    btn.classList.add('button-opacity');

    if( tipo === 'error' ){
        div.classList.add('mensajeError');
    } else {
        div.classList.add('mensajeExito');
    }

    div.classList.add('mensaje');
    div.textContent = mensaje;

    const formulario = document.querySelector('#formulario');
    formulario.insertBefore( div, document.querySelector('#resultado'));

    if(tipo === 'exito') {
        spinner.classList.remove('hidden');
    }

    setTimeout(() => {
        div.remove();
        btn.disabled = false;
        btn.classList.remove('button-opacity');
        spinner.classList.add('hidden');
    }, 3000);

}

UI.prototype.mostrarResultado = (total, seguro) => {
    limpiarHTML();
    const { marca, year, tipo } = seguro;
    const resultado = document.querySelector('#resultado');
    const div = document.createElement('div');
    const formulario =document.querySelector('#formulario');
    let textoMarca;
    switch (marca) {
        case '1':
            textoMarca = 'Americano'
            break;
        case '2':
            textoMarca = 'Asiatico'
            break;
        case '3':
            textoMarca = 'Europeo'
            break;
        default:
            break;
    }

    div.innerHTML= `
        <p class='resultado-header'>Resultado</p>
        <div class='resultado-content-container'>
            <p class='resultado-content'>Marca: <span>${textoMarca}</span></p>
            <p class='resultado-content'>Año: <span>${year}</span></p>
            <p class='resultado-content'>Tipo: <span>${tipo}</span></p>
            <hr>
            <p class='resultado-content'>TOTAL: <span>$usd ${total}</span></p>
        </div>
    `;
    setTimeout(() => {
        resultado.appendChild(div);
    }, 3000);
    setTimeout(() => {
        limpiarHTML();
        formulario.reset();
    }, 10000);
}

Seguro.prototype.cotizarSeguro = function() {
    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
    
        default:
            break;
    }

    // Cada año que la diferencia de año es mayor el costo se reduce un 3%
    const diferencia = new Date().getFullYear() - this.year;
    cantidad -= (diferencia*0.03*cantidad);

    // Si el seguro es básico, el precio aumenta un 30%
    // Si el seguro es completo, el precio aumenta un 50%
    if(this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }
    
    return cantidad;
}

// Instanciar
const ui = new UI();


// Eventos
document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();
})

cargarEventListeners();
function cargarEventListeners() {
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarSeguro);
}

function validarSeguro(e) {
    e.preventDefault();

    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if( marca === '' || year === '' || tipo === '' ){
        ui.mostrarMensaje('Todos los campos son obligatorios!', 'error');
    } else {
        ui.mostrarMensaje('Cotizando!', 'exito');
        const seguro = new Seguro(marca, year, tipo);
        const total = seguro.cotizarSeguro();
        ui.mostrarResultado(total, seguro);
    }
}

// Funciones
function limpiarHTML() {
    const resultado = document.querySelector('#resultado');
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}