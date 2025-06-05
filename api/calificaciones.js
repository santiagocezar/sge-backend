import { Router } from "express";
import { Grade, Student, Subject } from "../db/index.js";
import { error } from "./common.js";
import { body, validationResult } from "express-validator";

const calificaciones = Router()

calificaciones.route("/")
    .get(async (req, res) => {
        res.json(await Grade.findAll())
    })
    .post([
        body("instance").isString().withMessage("Instancia debe ser string"),
        body("grade").isInt().withMessage("Calificación debe ser entero").isIn[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].withMessage("Calificación debe estar entre 1 y 10")
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { studentID, subjectID } = req.body;

        const student = await Student.findByPk(studentID);
        const subject = await Subject.findByPk(subjectID);

        if (!student || !subject) {
            return error(res, 404, "no existe el alumno o la materia"); //se podría sacar, ya tira error cuando no existen
        }

        const data = await Grade.create(req.body)
        res.status(201).json({ ok: true, id: data.id })
    })

calificaciones.route("/:id")
    .get(async (req, res) => {
        const data = await Grade.findByPk(req.params.id);
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe la inscripción");
        }
    })
    .put([
        body("instance").isString().withMessage("Instancia debe ser string"),
        body("grade").isInt().withMessage("Calificación debe ser entero").isIn[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].withMessage("Calificación debe estar entre 1 y 10")
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const [data] = await Grade.upsert({ ...req.body, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete(async (req, res) => {
        const data = await Grade.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe la inscripción");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default calificaciones