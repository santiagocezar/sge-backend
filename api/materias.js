import { Router } from "express";
import { Subject } from "../db/index.js";
import { body, validationResult } from "express-validator";

const materias = Router()

materias.route("/")
    .get(async (req, res) => {
        res.json(await Subject.findAll())
    })
    .post([
        body("name").notEmpty().withMessage("Se requiere nombre"),
        body("career").isString().withMessage("Carrera debe ser string").isIn(["K", "V", "X"]).withMessage("Carrera no encontrada"),
        body("duration").isInt().withMessage("Duración debe ser entero").isIn([0, 1, 2]).withMessage("Duración debe ser 0, 1 o 2")
    ],
        async (req, res) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const data = await Subject.create(req.body)
            res.status(201).json({ ok: true, id: data.id })
        })

materias.route("/:id")
    .get(async (req, res) => {
        const data = await Subject.findByPk(req.params.id);
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe la materia");
        }
    })
    .put([
        body("name").notEmpty().withMessage("Se requiere nombre"),
        body("career").isString().withMessage("Carrera debe ser string").isIn(["K", "V", "X"]).withMessage("Carrera no encontrada"),
        body("duration").isInt().withMessage("Duración debe ser entero").isIn([0, 1, 2]).withMessage("Duración debe ser 0, 1 o 2")
    ], async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const [data] = await Subject.upsert({ ...req.body, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete(async(req, res) => {
        const data = await Subject.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe la materia");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default materias