class Vehiculo {
    constructor(id,modelo,anoFab,velMax){
        this.id = id;
        this.modelo = modelo;
        this.anoFab =anoFab;
        this.velMax = velMax;
    }

    toString() {
        return `Nombre: ${this.modelo}, Apellido: ${this.anoFab}, Edad: ${this.velMax}`;
    }

}

class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax);
        this.altMax = altMax;
        this.autonomia = autonomia;
    }

    toString() {
        return `${super.toString()}, Altitud Máxima: ${this.altMax}, Autonomía: ${this.autonomia}`;
    }
}

class Terrestre extends Vehiculo {
    constructor(id, modelo, velMax, altMax, cantPue, cantRue) {
        super(id, modelo, velMax, altMax);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }

    toString() {
        return `${super.toString()}, Cantidad de Puertas: ${this.cantPue}, Cantidad de Ruedas: ${this.cantRue}`;
    }
}

function parsearJson(jsonString) {
    const autoMoviles = JSON.parse(jsonString);

    const objetos = autoMoviles.map(autoMoviles => {
        if (autoMoviles.altMax !== undefined && autoMoviles.autonomia !== undefined) {
            return new Aereo(autoMoviles.id, autoMoviles.modelo, autoMoviles.anoFab, autoMoviles.velMax, autoMoviles.altMax, autoMoviles.autonomia);
        } else if (autoMoviles.cantPue !== undefined && autoMoviles.cantRue !== undefined) {
            return new Terrestre(autoMoviles.id, autoMoviles.modelo, autoMoviles.anoFab, autoMoviles.velMax, autoMoviles.cantPue, autoMoviles.cantRue);
        } else {
            return null;
        }
    });

    return objetos.filter(obj => obj !== null);
}

const json = '[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},\
{"id":51, "modelo":"Dodge Viper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},\
{"id":67, "modelo":"Boeing CH-47 Chinook", "anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},\
{"id":666, "modelo":"Aprilia RSV 1000 R", "anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},\
{"id":872, "modelo":"Boeing 747-400", "anoFab":1989, "velMax":988, "altMax":13, "autonomia":13450},\
{"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953, "velMax":174, "altMax":3, "autonomia":870}]';

const objetosValidos = parsearJson(json);

// FORM ABM 

function mostrarABM() {
    document.getElementById("formDatos").style.display = "none";
    document.getElementById("formABM").style.display = "block";
    document.getElementById("Modificar").style.display = "none";
    document.getElementById("Eliminar").style.display = "none";
    document.getElementById("Aceptar").style.display = "inline";

    // Obtener el nuevo ID autoincrementado
    let nuevoID;

    if (objetosValidos.length > 0) {
        nuevoID = Math.max(...objetosValidos.map(p => p.id)) + 1;
    } else {
        nuevoID = 1;
    }

    // Establecer el nuevo ID en el campo correspondiente
    document.getElementById("id").value = nuevoID;

    actualizarLabels("Aereo");
}

function actualizarLabels(tipo) {
    const labelAtributo5 = document.getElementById("labelAtributo5");
    const inputAtributo5 = document.getElementById("atributo5");

    const labelAtributo6 = document.getElementById("labelAtributo6");
    const inputAtributo6 = document.getElementById("atributo6");

    if (tipo === "Aereo") {
        labelAtributo5.textContent = "Altura Maxima:";
        inputAtributo5.placeholder = "Ingrese Altura Maxima:";

        labelAtributo6.textContent = "Autonomia:";
        inputAtributo6.placeholder = "Ingrese Autonomia";
    } else if (tipo === "Terrestre") {
        labelAtributo5.textContent = "Cantidad Puertas:";
        inputAtributo5.placeholder = "Ingrese Cantidad de Puertas";

        labelAtributo6.textContent = "Cantidad Ruedas:";
        inputAtributo6.placeholder = "Ingrese Cantidad de Ruedas";
    }
}

function aceptarABM() 
{
    if (!validar()) {
        // Si la validación falla, no continuamos
        return;
    }

    const id = document.getElementById("id").value;
    const modelo = document.getElementById("modeloABM").value; 
    const anoFab = document.getElementById("anoFabABM").value; 
    const velMax = document.getElementById("velMaxABM").value; 
    const tipo = document.getElementById("tipo").value;

    let nuevoObjeto;

    if (tipo === "Aereo") {
        const altMax = parseFloat(document.getElementById("atributo5").value.trim()); 
        const autonomia = parseFloat(document.getElementById("atributo6").value.trim()); 
        nuevoObjeto = new Aereo(id, modelo, anoFab, velMax, altMax, autonomia);
    } else if (tipo === "Terrestre") {
        const cantPue = parseFloat(document.getElementById("atributo5").value.trim()); 
        const cantRue = document.getElementById("atributo6").value.trim(); 
        nuevoObjeto = new Terrestre(id, modelo, anoFab, velMax, cantPue, cantRue);
    }

    objetosValidos.push(nuevoObjeto);
    
    // Llamar a la función para redibujar los datos (si es necesario)
    dibujarDatos(document.getElementById("filtrar").value);

    cancelarABM(); 
}

function validar() {
    const modelo = document.getElementById("modeloABM").value.trim();
    const anoFab = document.getElementById("anoFabABM").value.trim();
    const velMax = document.getElementById("velMaxABM").value.trim(); 

    if (!modelo || !anoFab || !velMax) {
        alert("Todos los campos comunes deben estar completos.");
        return false;
    }

    const velMaxNum = parseInt(velMax, 10);
    const anoFabNum = parseInt(anoFab, 10);

    if (isNaN(anoFabNum) || anoFabNum <= 1885) {
        alert("El año de fabricaion debe ser despues de 1885");
        return false;
    }

    if (isNaN(velMaxNum) || velMaxNum <= 0) {
        alert("La  velocidad maxima debe ser mayor que 0 ");
        return false;
    }

    const tipoSeleccionado = document.getElementById("tipo").value;
    if (!tipoSeleccionado) {
        alert("Por favor, seleccione un tipo (Aereo o Terrestre).");
        return false;
    }

    const atributo5 = document.getElementById("atributo5").value.trim();
    const atributo6 = document.getElementById("atributo6").value.trim();

    if (!atributo5 || !atributo6) {
        alert("Todos los campos específicos del tipo seleccionado deben estar completos.");
        return false;
    }

    if (tipoSeleccionado === "Aereo") {
        const altMax = parseFloat(document.getElementById("atributo5").value.trim());
        const autonomia = parseFloat(document.getElementById("atributo6").value.trim());

        if (isNaN(altMax) || altMax < 0) {
            alert("El sueldo no puede ser negativo.");
            return false;
        }

        if (isNaN(autonomia) || autonomia < 0) {
            alert("La altura maxima no pueden ser negativas.");
            return false;
        }
    }

    if (tipoSeleccionado === "Terrestre") {
        const cantPue = parseFloat(document.getElementById("atributo5").value.trim());
        const cantRue = document.getElementById("atributo6").value.trim();

        if (isNaN(cantPue) || cantPue < 0) {
            alert("La cantidad de puertas tienen que ser mayores a 0");
            return false;
        }

        if (cantRue < 0 || isNaN(cantRue)) {
            alert("La cantidad de puertas tienen que  ser mayores a 0");
            return false;
        }
    }
    
    return true;
}

function cancelarABM() {
    document.getElementById("formABM").style.display = "none";

    document.getElementById("formDatos").style.display = "block";

    // Limpiar los campos del formulario
    document.getElementById("id").value = ""; 
    document.getElementById("modeloABM").value = "";
    document.getElementById("anoFabABM").value = "";
    document.getElementById("velMaxABM").value = "";
    document.getElementById("atributo5").value = "";
    document.getElementById("atributo6").value = ""; 
}

function modificarABM(){
    const id = document.getElementById("id").value;

    // Encontrar el objeto a modificar
    const objetoIndex = objetosValidos.findIndex(obj => obj.id == id);

    if (objetoIndex !== -1 && validar()) {
        // Actualizar el objeto con los nuevos valores
        const modelo = document.getElementById("modeloABM").value;
        const anoFab = document.getElementById("anoFabABM").value;
        const velMax = document.getElementById("velMaxABM").value;
        const tipo = document.getElementById("tipo").value;

        if (tipo === "Aereo") {
            const altMax = parseFloat(document.getElementById("atributo5").value);
            const autonomia = parseFloat(document.getElementById("atributo6").value);
            objetosValidos[objetoIndex] = new Aereo(id, modelo, anoFab, velMax, altMax, autonomia);
        } else if (tipo === "Terrestre") {
            const cantPue = parseFloat(document.getElementById("atributo5").value);
            const cantRue = document.getElementById("atributo6").value;
            objetosValidos[objetoIndex] = new Terrestre(id, modelo, anoFab, velMax, cantPue, cantRue);
        }

        dibujarDatos(document.getElementById("filtrar").value);
        cancelarABM();
    }
}

function eliminarABM() {
    const id = document.getElementById("id").value;

    // Encontrar el índice del objeto a eliminar
    const objetoIndex = objetosValidos.findIndex(obj => obj.id == id);

    if (objetoIndex !== -1) {
        // Eliminar el objeto de la lista
        objetosValidos.splice(objetoIndex, 1);

        // Redibujar los datos y ocultar el formulario
        dibujarDatos(document.getElementById("filtrar").value);
        cancelarABM();
    }
}

// FORM DATOS 

function filtrar(tipo){
    if (tipo == "terrestre") {
        return objetosValidos.filter(item=> item instanceof Terrestre);
    }
    else if (tipo == "aereo") {
        return objetosValidos.filter(item=> item instanceof Aereo);
    }else if(tipo == "todos"){
        return objetosValidos;
    }
}

function cargarDatosABM(objeto) {
    // Mostrar el formulario ABM
    document.getElementById("formABM").style.display = "block";
    document.getElementById("formDatos").style.display = "none";

    // Llenar el formulario con los datos del objeto
    document.getElementById("id").value = objeto.id; // ID
    document.getElementById("modeloABM").value = objeto.modelo; 
    document.getElementById("anoFabABM").value = objeto.anoFab; 
    document.getElementById("velMaxABM").value = objeto.velMax; 

    if (objeto instanceof Aereo) {
        document.getElementById("tipo").value = "Aereo"; 
        document.getElementById("atributo5").value = objeto.altMax; 
        document.getElementById("atributo6").value = objeto.autonomia; 
    } else if (objeto instanceof Terrestre) {
        document.getElementById("tipo").value = "Terrestre"; 
        document.getElementById("atributo5").value = objeto.cantPue; 
        document.getElementById("atributo6").value = objeto.cantRue; 
    }

    document.getElementById("Modificar").style.display = "inline";
    document.getElementById("Eliminar").style.display = "inline";
    document.getElementById("Aceptar").style.display = "none";
}

function dibujarDatos(tipo) {
    const array = filtrar(tipo);

    let tabla = document.getElementById("tablaDatos");
    tabla.innerHTML = ''; // Limpiar la tabla antes de redibujarla

    array.forEach(element => {
        var f = document.createElement("tr");

        f.onclick = () => cargarDatosABM(element);

        const headers = document.querySelectorAll("thead tr th");

        // Controlar la visibilidad de los encabezados (th)
        headers[0].style.display = document.getElementById("checkid").checked ? "" : "none"; // ID
        headers[1].style.display = document.getElementById("checkmodelo").checked ? "" : "none"; 
        headers[2].style.display = document.getElementById("checkanoFab").checked ? "" : "none"; 
        headers[3].style.display = document.getElementById("checkvelMax").checked ? "" : "none"; 
        headers[4].style.display = document.getElementById("checkaltMax").checked ? "" : "none"; 
        headers[5].style.display = document.getElementById("checkautonomia").checked ? "" : "none"; 
        headers[6].style.display = document.getElementById("checkcantPue").checked ? "" : "none"; 
        headers[7].style.display = document.getElementById("checkcantRue").checked ? "" : "none"; 

        if (document.getElementById("checkid").checked) {
            let celda = document.createElement("td");
            celda.appendChild(document.createTextNode(element.id.toString()));
            f.appendChild(celda);
        }

        if (document.getElementById("checkmodelo").checked) {
            let celda = document.createElement("td");
            celda.appendChild(document.createTextNode(element.modelo.toString()));
            f.appendChild(celda);
        }

        if (document.getElementById("checkanoFab").checked) {
            let celda = document.createElement("td");
            celda.appendChild(document.createTextNode(element.anoFab.toString()));
            f.appendChild(celda);
        }

        if (document.getElementById("checkvelMax").checked) {
            let celda = document.createElement("td");
            celda.appendChild(document.createTextNode(element.velMax.toString()));
            f.appendChild(celda);
        }

        if (document.getElementById("checkaltMax").checked) {
            
            let celda = document.createElement("td");
            if (element instanceof Aereo) {
                celda.appendChild(document.createTextNode(element.altMax.toString()));
            } else {
                celda.appendChild(document.createTextNode("N/A"));
            }
            f.appendChild(celda);
        }

        if (document.getElementById("checkautonomia").checked) {
            let celda = document.createElement("td");
            if (element instanceof Aereo) {
                celda.appendChild(document.createTextNode(element.autonomia.toString()));
            } else {
                celda.appendChild(document.createTextNode("N/A"));
            }
            f.appendChild(celda);
        }

        if (document.getElementById("checkcantPue").checked) {
            let celda = document.createElement("td");
            if (element instanceof Terrestre) {
                celda.appendChild(document.createTextNode(element.cantPue.toString()));
            } else {
                celda.appendChild(document.createTextNode("N/A"));
            }
            f.appendChild(celda);
        }

        if (document.getElementById("checkcantRue").checked) {
            let celda = document.createElement("td");
            if (element instanceof Terrestre) {
                celda.appendChild(document.createTextNode(element.cantRue.toString()));
            } else {
                celda.appendChild(document.createTextNode("N/A"));
            }
            f.appendChild(celda);
        }

        tabla.appendChild(f); // Añadir la fila a la tabla
    });
}

document.addEventListener("DOMContentLoaded", function() {
    dibujarDatos("todos"); // Cargar todos los datos al inicio
});

function dibujarDatosSegunSeleccion() {
    // Obtener el valor seleccionado en el select
    const tipoSeleccionado = document.getElementById("filtrar").value;

    dibujarDatos(tipoSeleccionado);
}

const checkboxes = document.querySelectorAll("input[type='checkbox']");
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => dibujarDatos(document.getElementById("filtrar").value));
});

function calcularVelocidad() {
    const tipoSeleccionado = document.getElementById("filtrar").value;
    const objetosFiltrados = filtrar(tipoSeleccionado);

    const velocidadFiltrada = objetosFiltrados.map(item => item.velMax);
    const total = velocidadFiltrada.reduce((acumulador, velMax) => acumulador + velMax, 0);

    // Verificar si hay elementos filtrados para evitar dividir por cero
    if (velocidadFiltrada.length > 0) {
        document.getElementById("velocidadPromedio").value = (total / velocidadFiltrada.length).toFixed(2);
    } else {
        document.getElementById("velocidadPromedio").value = "0"; 
    }
}

function ordenamiento(ordenador){
    objetosValidos.sort((a,b) =>{
        if (a[ordenador]> b[ordenador]) {
            return 1;
        }
        if (a[ordenador]< b[ordenador]) {
            return -1;
        }
        else{
            return 0;
        }});

        dibujarDatos(document.getElementById("filtrar").value);

}

const headers = document.querySelectorAll("th[data-ordenar]");

headers.forEach(header => {
    header.addEventListener('click', function () {
        // Obtener el atributo de ordenamiento
        const ordenador = header.getAttribute("data-ordenar");
        ordenamiento(ordenador);
    });
});