import { Router } from "express";
import { Student, Teacher } from "../db/index.js";
import { error } from "./common.js";

const docentes = Router()

docentes.route("/")
    .get(async (req, res) => {
        res.json(await Teacher.findAll())
    })
    .post(async (req, res) => {
        const data = await Teacher.create(req.body)
        res.status(201)
        res.json({ ok: true, id: data.id })
    })

docentes.route("/:id")
    .get(async (req, res) => {
        const data = await Teacher.findByPk(req.params.id);
        if (data) {
            res.json(data)
        } else {
            error(res, 404, "no existe el docente");
        }
    })
    .put((req, res) => {
        
    })
    .delete((req, res) => {
        
    })

export default docentes