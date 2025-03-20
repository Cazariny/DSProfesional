const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());



// Servir archivos estáticos (JS y CSS desde la raíz)
app.use(express.static(__dirname));

//Configurar CSP ANTES de servir archivos estáticos
app.use((req, res, next) => {
    res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;"
    );
    next();
});



// Conexión a la base de datos
const connection = mysql.createPool({
    host: process.env.DB_HOST ||'localhost',
    port: process.env.DB_PORT ||3306,
    user: process.env.DB_USER ||'root',
    password: process.env.DB_PASSWORD ||'',
    database: process.env.DB_DATABASE ||'dbempleados',
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT, 10) : 10,
    queueLimit: 0
});

console.log(connection.database);

// Verificar conexión a la base de datos
connection.getConnection((err, conn) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a MySQL con ID ' + conn.threadId);
    conn.release();
});

// Ruta inicial que sirve el menú
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));
});

// Ruta para registrar empleados
app.post('/register', (req, res) => {
    const {
        nombre,
        email,
        puesto,
        fechaNacimiento,
        curp,
        rfc,
        nss,
        genero,
        tipoContrato
    } = req.body;

    if (!nombre || !email || !puesto || !fechaNacimiento || !genero || !tipoContrato) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const query = `INSERT INTO datos_empleados(nombre, email, puesto, fechaNacimiento, curp, rfc, nss, genero, tipoContrato) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.execute(query, [nombre, email, puesto, fechaNacimiento, curp, rfc, nss, genero, tipoContrato], (error, results) => {
        if (error) {
            return res.status(500).send('Error al registrar empleado');
        }
        res.status(201).send('Empleado registrado correctamente');
    });
});

app.get('/empleados', (req, res) => {
    const query = 'SELECT nombre, email, puesto, fechaNacimiento, genero, tipoContrato FROM datos_empleados';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al consultar empleados:', error);
            return res.status(500).json({ error: 'Error al obtener empleados' });
        }
        res.json(results);
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

