import { Router } from "express";
import { Student } from "../db/index.js";

const alumnos = Router()

const alumnosdb = await Student.findAll()

alumnos.route("/")
    .get(async (req, res) => {
        res.json(await Student.findAll())
    })
    .post(async (req, res) => {
        const data = await Student.create(req.body)
        res.status(201)
        res.json({ ok: true, id: data.id })
    })

alumnos.route("/:id")
    .get((req, res) => {

    })
    .put((req, res) => {

    })
    .delete((req, res) => {
        
    })

export default alumnos