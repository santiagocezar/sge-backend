import { Router } from "express";
import { Student } from "../db/index.js";

const alumnos = Router()

alumnos.route("/")
    .get(async (req, res) => {
        res.json(await Student.findAll())
    })
    .post([
        body("name").notEmpty().withMessage("Se requiere nombre"),
        body("surname").notEmpty().withMessage("Se requiere apellido"),
        body("email").isEmail().withMessage("Email no es válido"),
        body("phone").isMobilePhone().withMessage("Teléfono no es válido")
    ], async (req, res) => {
        const data = await Student.create(req.body)
        res.status(201).json({ ok: true, id: data.id })
    })

alumnos.route("/:id")
    .get(async (req, res) => {
        const data = await Student.findByPk(req.params.id);
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe el alumno");
        }
    })
    .put(async (req, res) => {
        const [data] = await Student.upsert({ ...req.body, id: req.params.id })
        res.status(200)
        res.json({ ok: true, id: data.id })
    })
    .delete(async (req, res) => {
        const data = await Student.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe el alumno");
        }

        await data.destroy()
        res.status(200)
        res.json({ ok: true })
    })

export default alumnos