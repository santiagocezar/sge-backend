import { Router } from "express";
import { AbsenceTable, StudentTable, SubjectTable } from "../db/index.js";
import { error } from "./common.js";
import { body, validationResult, query } from "express-validator";
import { requiereRol, validarIdentidad, verifyToken } from "./auth.js";
import { AbsenceSchema, validarPost, validarPut } from "../db/schema.js";
import { Op } from "sequelize";

const inasistencias = Router()

inasistencias.use(verifyToken)

inasistencias.route("/")
    .get([
        query("alumno").isInt().withMessage("El ID de la alumno debe ser un número"),
        query("materia").isInt().withMessage("El ID de la materia debe ser un número"),
        query("start").isDate().withMessage("La fecha inicio del intervalo debe ser... una fecha"),
        query("end").isDate().withMessage("La fecha fin del intervalo debe ser... una fecha"),
    ], async (req, res) => {
        if (!req.query.alumno && !req.query.materia) {
            error(res, 400, "Debe filtrar mínimo por alumno o por materia")
            return
        }

        const materia = req.query.materia && await SubjectTable.findByPk(req.query.materia)

        if (!validarIdentidad(req, "student", req.query.alumno) && !validarIdentidad(req, "teacher", materia?.teacherID)) {
            error(res, 403, "No tiene el permiso")
            return
        }

        let interval = {}
        if (req.query.start && req.query.end) {
            const start = new Date(req.query.start)
            const end = new Date(req.query.end)

            interval = {
                date: {
                    [Op.gte]: start,
                    [Op.lte]: end,
                }
            }
        }

        res.status(200).json(await AbsenceTable.findAll({
            where: {
                ...(req.query.materia ? {
                    subjectID: parseInt(req.query.materia)
                } : {}),
                ...(req.query.alumno ? {
                    studentID: parseInt(req.query.alumno)
                } : {}),
                ...interval
            },
        }))
    })
    .post([
        requiereRol("teacher")
    ], async (req, res) => {
        const inasistencia = validarPost(AbsenceSchema, req.body)

        const student = await StudentTable.findByPk(inasistencia.studentID)
        const subject = await SubjectTable.findByPk(inasistencia.subjectID)

        if (!student || !subject) {
            return error(res, 404, "no existe el alumno o la materia")
        }

        const data = await AbsenceTable.create(inasistencia)
        res.status(201).json({ ok: true, id: data.id })
    })

inasistencias.route("/:id")
    .get(async (req, res) => {
        const data = await AbsenceTable.findByPk(req.params.id, {
            include: [
                {
                    model: SubjectTable,
                    required: true,
                },
            ]
        })

        if (data) {
            if (!validarIdentidad(req, "student", data.studentID) && !validarIdentidad(req, "teacher", data.Subject.teacherID)) {
                error(res, 403, "No tiene el permiso")
                return
            }

            res.status(200).json(data)
        } else {
            error(res, 404, "no existe la inasistencia")
        }
    })
    .put([
        requiereRol("teacher"),
    ], async (req, res) => {
        const inasistencia = validarPut(AbsenceSchema, req.body)
        
        const [data] = await AbsenceTable.upsert({ ...inasistencia, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete([
        requiereRol("teacher"),
    ], async (req, res) => {
        const data = await AbsenceTable.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe la inscripción")
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default inasistencias
