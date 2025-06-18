import { Router } from "express";
import { StudentTable, EnrollmentTable, SubjectTable, TeacherTable } from "../db/index.js";
import { body, query, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { verifyToken } from "./auth.js";
import { StudentSchema, validarPost, validarPut } from "../db/schema.js";
import { error } from "./common.js";

const alumnos = Router()

alumnos.use(verifyToken)

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
        const alumno = validarPost(StudentSchema, req.body)

        if (await TeacherTable.findOne({where: {email: alumno.email}}) || await StudentTable.findOne({where: {email: alumno.email}})) {
            return error(res, 409, "ya existe una cuenta con ese email")
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
        const alumno = validarPut(StudentSchema, req.body)

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