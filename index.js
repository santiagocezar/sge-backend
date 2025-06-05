import './db/index.js'
import express from 'express'

import alumnos from './api/alumnos.js'
import materias from './api/materias.js'
import inasistencias from './api/inasistencias.js'
import calificaciones from './api/calificaciones.js'
import docentes from './api/docentes.js'
import inscripciones from './api/inscripciones.js'
import { error } from './api/common.js'

const app = express()

app.use(express.json());
app.use("/api/alumnos", alumnos)
app.use("/api/materias", materias)
app.use("/api/inasistencias", inasistencias)
app.use("/api/calificaciones", calificaciones)
app.use("/api/docentes", docentes)
app.use("/api/inscripciones", inscripciones)

app.use((err, req, res, next) => {
  console.error(err.stack)
  error(res, 500, err.message)
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
