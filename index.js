import './db/index.js'
import express from 'express'
import cors from 'cors'

import alumnos from './api/alumnos.js'
import materias from './api/materias.js'
import inasistencias from './api/inasistencias.js'
import calificaciones from './api/calificaciones.js'
import docentes from './api/docentes.js'
import inscripciones from './api/inscripciones.js'
import { error } from './api/common.js'
import auth from './api/auth.js'
import { UnauthorizedError } from 'express-jwt'
import { ZodError } from 'zod/v4'

const app = express()

app.use(express.json());
app.use(cors());
app.use("/api/alumnos", alumnos)
app.use("/api/materias", materias)
app.use("/api/inasistencias", inasistencias)
app.use("/api/calificaciones", calificaciones)
app.use("/api/docentes", docentes)
app.use("/api/inscripciones", inscripciones)
app.use("/api/auth", auth)

app.use((err, req, res, next) => {
  let status = 500
  if (err instanceof UnauthorizedError) {
    status = 401
  } else if (err instanceof ZodError) {
    status = 400
  }
  console.error(err.stack)
  error(res, status, err.message)
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
