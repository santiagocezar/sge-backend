import { Router } from "express";

const materias = Router()

materias.route("/")
    .get((req, res) => {
        res.send("hola soy materia")
    })
    .post((req, res) => {
        
    })

materias.route("/:id")
    .get((req, res) => {
        
    })
    .put((req, res) => {
        
    })
    .delete((req, res) => {
        
    })

export default materias