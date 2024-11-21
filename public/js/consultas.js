
async function consultarEntidad() {
    const selectedTable = document.getElementById('entitySelect').value; // Tabla seleccionada
    const consultaInput = document.getElementById('consulta-input').value; // Valor ingresado o seleccionado

    if (!consultaInput) {
        alert('Por favor, selecciona o ingresa un valor válido.');
        return;
    }

    try {
        // Llama al endpoint del procedimiento almacenado con la PK seleccionada
        const response = await fetch(`http://localhost:3000/api/${selectedTable}/${consultaInput}`);
        if (!response.ok) {
            const error = await response.json();
            alert(error.error || 'No se encontraron registros.');
            return;
        }

        const datosEntidad = await response.json(); // Aquí obtienes el array de datos
        console.log('Datos obtenidos del procedimiento:', datosEntidad);

        if (!Array.isArray(datosEntidad) || datosEntidad.length === 0) {
            alert('No se encontraron datos para la clave proporcionada.');
            return;
        }

        // Toma el primer registro del array
        const entidad = datosEntidad[0];

        // Actualiza los resultados en el frontend
        const camposResultado = document.querySelector('.campos-resultado');
        camposResultado.innerHTML = ''; // Limpia el contenido previo

        // Itera sobre las claves y valores del objeto
        Object.entries(entidad).forEach(([key, value]) => {
            const campo = document.createElement('div');
            campo.className = 'campo';

            const label = document.createElement('label');
            label.textContent = key; // Nombre de la columna

            const input = document.createElement('input');
            input.type = 'text';
            input.value = value !== null ? value : ''; // Maneja valores nulos
            input.disabled = true; // El campo está deshabilitado para edición
    
            campo.appendChild(label);
            campo.appendChild(input);
            camposResultado.appendChild(campo);
        });
    } catch (error) {
        console.error('Error al consultar la entidad:', error);
        alert('Ocurrió un error al realizar la consulta.');
    }
}

function mostrarFormularioConsulta(selectedTable) {
  SelectedTable1 = selectedTable;
  // Actualizar el título de la consulta para que muestre el nombre de la entidad seleccionada
  document.querySelector('.consultar-busqueda h3').textContent = `Consultar ${selectedTable}`;

  // Limpiar y configurar el contenedor de resultados
  document.querySelector('.resultado-consulta h3').textContent = `Datos de ${selectedTable}`;
  const camposResultado = document.querySelector('.campos-resultado');
  camposResultado.innerHTML = ''; // Limpia el contenido previo

  // Crear un campo de entrada para el criterio de búsqueda
  const consultaInput = document.getElementById('consulta-input');
  consultaInput.placeholder = `Ingrese ${selectedTable} (por PK, nombre, etc.)`;

  // Mostrar la sección de consulta y ocultar las otras
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'block';
  document.getElementById('contenedor').style.display = 'none';
  document.getElementById('reporte-detalle-container').style.display = 'none';

  // Configura el autocompletado
  configurarBusquedaConsulta(selectedTable);
}

function configurarBusquedaConsulta(selectedTable) {
    const consultaInput = document.getElementById('consulta-input');
    const sugerenciasConsulta = document.getElementById('sugerencias-consulta');

    consultaInput.addEventListener('input', async () => {
        const query = consultaInput.value.trim();
        if (query.length > 0) {
            // Llama al endpoint de sugerencias
            const resultados = await buscarConsulta(query, selectedTable);
            mostrarSugerenciasConsulta(resultados, sugerenciasConsulta, consultaInput);
        } else {
            sugerenciasConsulta.innerHTML = ''; // Limpia las sugerencias si el input está vacío
        }
    });
}

// Simula una función que busca en la base de datos
async function buscarConsulta(query, table) {
    try {
        const url = `http://localhost:3000/api/${table}/suggestions?query=${query}`;
        console.log('Llamando al endpoint:', url);

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error al buscar sugerencias: ${response.statusText}`);
            return [];
        }

        const resultados = await response.json();
        console.log('Sugerencias obtenidas:', resultados);
        return resultados; // Devuelve las sugerencias
    } catch (error) {
        console.error('Error al buscar sugerencias:', error);
        return [];
    }
}


function mostrarSugerenciasConsulta(resultados, contenedor, input) {
    contenedor.innerHTML = ''; // Limpia el contenedor de sugerencias anteriores

    resultados.forEach(resultado => {
        const item = document.createElement('li');
        item.textContent = resultado.nombre; // Muestra el nombre formateado
        item.addEventListener('click', () => {
            input.value = resultado.pk; // Llena el campo con la PK seleccionada
            contenedor.innerHTML = ''; // Limpia las sugerencias
        });
        contenedor.appendChild(item);
    });
}