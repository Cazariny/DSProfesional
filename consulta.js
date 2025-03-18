async function cargarEmpleados() {
    try {
      const API_URL = "http://localhost:3000";
      const respuesta = await fetch(`${API_URL}/empleados`);
      const empleados = await respuesta.json();
  
      const tabla = document.getElementById('tablaEmpleados');
      empleados.forEach(emp => {
        const fila = `
          <tr>
            <td>${emp.nombre}</td>
            <td>${emp.email}</td>
            <td>${emp.puesto}</td>
            <td>${emp.fechaNacimiento}</td>
            <td>${emp.genero}</td>
            <td>${emp.tipoContrato}</td>
          </tr>`;
        tabla.insertAdjacentHTML('beforeend', fila);
      });
    } catch (error) {
      console.error('Error al cargar empleados:', error);
    }
  }
  
  cargarEmpleados();
  