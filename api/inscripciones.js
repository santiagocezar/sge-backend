import { Router } from "express";
import { Enrollment, Student, Subject } from "../db/index.js";
import { error } from "./common.js";

const inscripciones = Router()

inscripciones.route("/")
    .get(async (req, res) => {
        res.json(await Enrollment.findAll())
    })
    .post(async (req, res) => {
        const { studentID, subjectID } = req.body;

        const student = await Student.findByPk(studentID);
        const subject = await Subject.findByPk(subjectID);

        if (!student || !subject) {
            return error(res, 400, "no existe el alumno o la materia"); //se podría sacar, ya tira error cuando no existen
        }

        const data = await Enrollment.create(req.body)
        res.status(201).json({ ok: true, id: data.id })
    })

inscripciones.route("/:id")
    .get(async(req, res) => {
        const data = await Enrollment.findByPk(req.params.id);
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe la inscripción");
        }
    })
    .put(async(req, res) => {
        const [data] = await Enrollment.upsert({ ...req.body, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete(async(req, res) => {
        const data = await Enrollment.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe la inscripción");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default inscripciones