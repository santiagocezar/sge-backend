import './db/index.js'
import express from 'express'

import alumnos from './api/alumnos.js'
import materias from './api/materias.js'
import inasistencias from './api/inasistencias.js'
import calificaciones from './api/calificaciones.js'
import docentes from './api/docentes.js'

const app = express()

app.use("/api/alumnos", alumnos)
app.use("/api/materias", materias)
app.use("/api/inasistencias", inasistencias)
app.use("/api/calificaciones", calificaciones)
app.use("/api/docentes", docentes)

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
