import { Router } from "express";
import { StudentTable, EnrollmentTable, SubjectTable } from "../db/index.js";
import { body, query, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { verifyToken } from "./auth.js";
import { StudentSchema } from "../db/schema.js";

const alumnos = Router()

//alumnos.use(verifyToken)

alumnos.route("/")
    .get([
        query("materia").isInt().withMessage("El ID de la materia debe ser un número")
    ], async (req, res) => {
        res.status(200).json(await StudentTable.findAll({
            include: req.query.materia ? [{
                model: SubjectTable,
                where: { id: parseInt(req.query.materia) },
                as: "enrollments"
            }] : []
        }))
    })
    .post(async (req, res) => {
        const alumno = StudentSchema.parse(req.body)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        alumno.password = await bcrypt.hash(alumno.password, 10)

        const data = await StudentTable.create(alumno)
        res.status(201).json({ ok: true, id: data.id })
    })

alumnos.route("/:id")
    .get(async (req, res) => {
        const data = await StudentTable.findByPk(req.params.id);
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe el alumno");
        }
    })
    .put(async (req, res) => {
        const alumno = StudentSchema.parse(req.body)

        delete alumno.password

        const [data] = await StudentTable.upsert({ ...alumno, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete(async (req, res) => {
        const data = await StudentTable.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe el alumno");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default alumnos