import { Router } from "express";
import { TeacherTable, StudentTable } from "../db/index.js";
import { error } from "./common.js";
import { body, validationResult } from "express-validator";
import { TeacherSchema, validarPost, validarPut } from "../db/schema.js";
import { verifyToken } from "./auth.js";
import bcrypt from "bcrypt"


const docentes = Router()

docentes.use(verifyToken)

docentes.route("/")
    .get(async (req, res) => {
        res.status(200).json(await TeacherTable.findAll())
    })
    .post(async (req, res) => {
        const docente = validarPost(TeacherSchema, req.body)

        if (await TeacherTable.findOne({ where: { email: docente.email } }) || await StudentTable.findOne({ where: { email: docente.email } })) {
            return error(res, 409, "ya existe una cuenta con ese email")
        }

        docente.password = await bcrypt.hash(docente.password, 10)

        const data = await TeacherTable.create(docente)
        res.status(201).json({ ok: true, id: data.id })
    })

docentes.route("/:id")
    .get(async (req, res) => {
        const data = await TeacherTable.findByPk(req.params.id);
        if (data) {
            res.status(200).json(data)
        } else {
            error(res, 404, "no existe el docente");
        }
    })
    .put(async (req, res) => {
        const docente = validarPut(TeacherSchema, req.body)
        
        delete docente.password

        const [data] = await TeacherTable.upsert({ ...docente, id: req.params.id })
        res.status(200).json({ ok: true, id: data.id })
    })
    .delete(async (req, res) => {
        const data = await TeacherTable.findByPk(req.params.id)

        if (!data) {
            return error(res, 404, "no existe el docente");
        }

        await data.destroy()
        res.status(200).json({ ok: true })
    })

export default docentes