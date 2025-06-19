import { Router } from "express";
import { EnrollmentTable, StudentTable, SubjectTable, TeacherTable } from "../db/index.js";
import { body, query, validationResult } from "express-validator";
import { SubjectSchema, validarPost, validarPut } from "../db/schema.js";
import { validarIdentidad, verifyToken } from "./auth.js";
import { error } from "./common.js";

const materias = Router()

materias.use(verifyToken)

materias.route("/")
    .get([
        query("alumno").isInt().withMessage("El ID de la alumno debe ser un número"),
        query("docente").isInt().withMessage("El ID de la docente debe ser un número"),
    ], async (req, res) => {
        if (!validarIdentidad(req, "student", req.query.alumno) || !validarIdentidad(req, "teacher", req.query.docente)) {
            error(res, 403, "No tiene el permiso")
            return
        }
        res.status(200).json(await SubjectTable.findAll({
            where: {
                ...(req.query.docente ? {
                    teacherID: parseInt(req.query.docente)
                } : {}),
            },
            include: [
                {
                    model: TeacherTable,
                    required: true,
                },
                ...(req.query.alumno ? [{
                    model: StudentTable,
                    where: { id: parseInt(req.query.alumno) },
                    as: "enrollments"
                }] : [])
            ]
        }))
    })
    .post(async (req, res) => {
        const materia = validarPost(SubjectSchema, req.body)

        const data = await SubjectTable.create(materia)
        res.status(201).json({ ok: true, id: data.id })
    })

materias.route("/:id")
    .get(async (req, res) => {
        const data = await SubjectTable.findByPk(req.params.id, {
            include: [
                {
                    model: TeacherTable,
                    required: true,
                },
            ]
        });
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe la materia");
        }
    })
    .put(async (req, res) => {
        const materia = validarPut(SubjectSchema, req.body)

        const [data] = await SubjectTable.upsert({ ...materia, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete(async(req, res) => {
        const data = await SubjectTable.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe la materia");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default materias