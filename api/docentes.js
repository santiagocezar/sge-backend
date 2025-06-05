import { Router } from "express";
import { Teacher } from "../db/index.js";
import { error } from "./common.js";
import { body, validationResult } from "express-validator";


const docentes = Router()

docentes.route("/")
    .get(async (req, res) => {
        res.status(200).json(await Teacher.findAll())
    })
    .post([
        body("name").notEmpty().withMessage("Se requiere nombre"),
        body("surname").notEmpty().withMessage("Se requiere apellido"),
        body("email").isEmail().withMessage("Email no es válido"),
        body("phone").isMobilePhone().withMessage("Teléfono no es válido")
    ],
        async (req, res) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const data = await Teacher.create(req.body)
            res.status(201).json({ ok: true, id: data.id })
        })

docentes.route("/:id")
    .get(async (req, res) => {
        const data = await Teacher.findByPk(req.params.id);
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe el docente");
        }
    })
    .put([
        body("name").notEmpty().withMessage("Se requiere nombre"),
        body("surname").notEmpty().withMessage("Se requiere apellido"),
        body("email").isEmail().withMessage("Email no es válido"),
        body("phone").isMobilePhone().withMessage("Teléfono no es válido")
    ], async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const [data] = await Teacher.upsert({ ...req.body, id: req.params.id })
        res.status(200)
        res.json({ ok: true, id: data.id })
    })
    .delete(async (req, res) => {
        const data = await Teacher.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe el docente");
        }

        await data.destroy()
        res.status(200)
        res.json({ ok: true })
    })

export default docentes