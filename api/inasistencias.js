import { Router } from "express";
import { Absence, Student, Subject } from "../db/index.js";
import { error } from "./common.js";
import { body, validationResult } from "express-validator";

const inasistencias = Router()

inasistencias.route("/")
    .get([
        query("alumno").isInt().withMessage("El ID de la alumno debe ser un número"),
        query("materia").isInt().withMessage("El ID de la materia debe ser un número"),
    ], async (req, res) => {
        res.status(200).json(await Absence.findAll({
            where: {
                ...(req.query.materia ? {
                    subjectID: parseInt(req.query.materia)
                } : {}),
                ...(req.query.alumno ? {
                    studentID: parseInt(req.query.alumno)
                } : {}),
            },
        }))
    })
    .post([
        body("date").isDate().withMessage("Fecha incorrecta"),
        body("justified").isBoolean().withMessage("Justificación debe ser booleano")
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

        const data = await Absence.create(req.body)
        res.status(201).json({ ok: true, id: data.id })
    })

inasistencias.route("/:id")
    .get(async (req, res) => {
        const data = await Absence.findByPk(req.params.id);
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe la inscripción");
        }
    })
    .put([
        body("date").isDate().withMessage("Fecha incorrecta"),
        body("justified").isBoolean().withMessage("Justificación debe ser booleano")
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const [data] = await Absence.upsert({ ...req.body, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete(async (req, res) => {
        const data = await Absence.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe la inscripción");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default inasistencias