import { Router } from "express";
import { GradeTable, StudentTable, SubjectTable } from "../db/index.js";
import { error } from "./common.js";
import { body, query, validationResult } from "express-validator";
import { requiereRol, verifyToken } from "./auth.js";
import { GradeSchema, validarPost, validarPut } from "../db/schema.js";

const calificaciones = Router()

calificaciones.use(verifyToken)

calificaciones.route("/")
    .get([
        query("alumno").isInt().withMessage("El ID de la alumno debe ser un número"),
        query("materia").isInt().withMessage("El ID de la materia debe ser un número"),
    ], async (req, res) => {
        const materia = req.query.materia && await SubjectTable.findByPk(req.query.materia)
        
        if (!validarIdentidad(req, "student", req.query.alumno) && !validarIdentidad(req, "teacher", materia?.teacherID)) {
            error(res, 403, "No tiene el permiso")
            return
        }

        res.status(200).json(await GradeTable.findAll({
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
        requiereRol("teacher")
    ], async (req, res) => {
        const calificacion = validarPost(GradeSchema, req.body)

        const { studentID, subjectID } = calificacion;

        const student = await StudentTable.findByPk(studentID);
        const subject = await SubjectTable.findByPk(subjectID);

        if (!student || !subject) {
            return error(res, 404, "no existe el alumno o la materia"); //se podría sacar, ya tira error cuando no existen
        }

        const data = await GradeTable.create(req.body)
        res.status(201).json({ ok: true, id: data.id })
    })

calificaciones.route("/:id")
    .get(async (req, res) => {
        const data = await GradeTable.findByPk(req.params.id, {
            include: [
                {
                    model: SubjectTable,
                    required: true,
                },
            ]
        });

        if (data) {
            if (!validarIdentidad(req, "student", data.studentID) && !validarIdentidad(req, "teacher", data.Subject.teacherID)) {
                error(res, 403, "No tiene el permiso")
                return
            }

            res.status(200).json(data)
        } else {
            error(res, 404, "no existe la inscripción");
        }
    })
    .put([
        requiereRol("teacher")
    ], async (req, res) => {
        const calificacion = validarPut(AbsenceSchema, req.body)
        
        const [data] = await GradeTable.upsert({ ...calificacion, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete([
        requiereRol("teacher")
    ], async (req, res) => {
        const data = await GradeTable.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe la inscripción");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default calificaciones