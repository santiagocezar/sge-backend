import { Router } from "express";
import { EnrollmentTable, StudentTable, SubjectTable } from "../db/index.js";
import { error } from "./common.js";
import { verifyToken } from "./auth.js";

const inscripciones = Router()

inscripciones.use(verifyToken)

inscripciones.route("/")
    .get(async (req, res) => {
        res.status(200).json(await EnrollmentTable.findAll())
    })
    .post(async (req, res) => {
        const { studentID, subjectID } = req.body;

        const student = await StudentTable.findByPk(studentID);
        const subject = await SubjectTable.findByPk(subjectID);

        if (!student || !subject) {
            return error(res, 404, "no existe el alumno o la materia"); //se podría sacar, ya tira error cuando no existen
        }

        const data = await EnrollmentTable.create(req.body)
        res.status(201).json({ ok: true, id: data.id })
    })

inscripciones.route("/:id")
    .get(async(req, res) => {
        const data = await EnrollmentTable.findByPk(req.params.id);
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe la inscripción");
        }
    })
    .put(async(req, res) => {
        const [data] = await EnrollmentTable.upsert({ ...req.body, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete(async(req, res) => {
        const data = await EnrollmentTable.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe la inscripción");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default inscripciones