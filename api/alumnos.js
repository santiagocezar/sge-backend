import { Router } from "express";
import { Student, Enrollment, Subject } from "../db/index.js";
import { body, query, validationResult } from "express-validator";

const alumnos = Router()

alumnos.route("/")
    .get([
        query("materia").isInt().withMessage("El ID de la materia debe ser un número")
    ], async (req, res) => {
        res.status(200).json(await Student.findAll({
            include: req.query.materia ? [{
                model: Subject,
                where: { id: parseInt(req.query.materia) },
                as: "enrollments"
            }] : []
        }))
    })
    .post([
        body("name").notEmpty().withMessage("Se requiere nombre"),
        body("surname").notEmpty().withMessage("Se requiere apellido"),
        body("email").isEmail().withMessage("Email no es válido"),
        body("phone").isMobilePhone().withMessage("Teléfono no es válido")
    ], async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    .put([
        body("name").notEmpty().withMessage("Se requiere nombre"),
        body("surname").notEmpty().withMessage("Se requiere apellido"),
        body("email").isEmail().withMessage("Email no es válido"),
        body("phone").isMobilePhone().withMessage("Teléfono no es válido")
    ], async (req, res) => {
        const [data] = await Student.upsert({ ...req.body, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete(async (req, res) => {
        const data = await Student.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe el alumno");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default alumnos