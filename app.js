const API_URL = "http://localhost:3000";
document.getElementById('formEmpleado').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que se recargue la página
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const puesto = document.getElementById('puesto').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const curp = document.getElementById('curp').checked;
    const rfc = document.getElementById('rfc').checked;
    const nss = document.getElementById('nss').checked;
    const genero = document.getElementById('genero').value;
    const tipoContrato = document.querySelector('input[name="tipoContrato"]:checked').value;

    const data = {
        nombre,
        email,
        puesto,
        fechaNacimiento,
        curp,
        rfc,
        nss,
        genero,
        tipoContrato
    };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} - ${response.statusText}`);
        }

        const result = await response.text();
        alert(result);
    } catch (error) {
        console.error('Error al enviar la petición:', error);
        alert('Hubo un problema al registrar el empleado.');
    }
});
