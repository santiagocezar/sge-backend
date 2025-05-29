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
    .put(async (req, res) => {
        const [data] = await Teacher.upsert({...req.body, id: req.params.id})
        res.status(200)
        res.json({ ok: true, id: data.id })
    })
    .delete(async (req, res) => {
        const data = await Teacher.findByPk(req.params.id)
        await data.destroy()
        res.status(200)
        res.json({ ok: true })
    })

export default docentes