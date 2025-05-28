import { Router } from "express";

const alumnos = Router()

alumnos.route("/")
    .get((req, res) => {
        res.send("hola soy alumno")
    })
    .post((req, res) => {
        
    })

alumnos.route("/:id")
    .get((req, res) => {
        
    })
    .put((req, res) => {
        
    })
    .delete((req, res) => {
        
    })

export default alumnos