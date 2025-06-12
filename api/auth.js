import { generateKeyPairSync } from "crypto";
import { Router } from "express";
import { EnrollmentTable, StudentTable, SubjectTable, TeacherTable } from "../db/index.js";
import { error } from "./common.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    }
})

const auth = Router()

auth.route("/login")
    .post(async (req, res) => {
        const { isTeacher, email, password } = req.body;

        if (isTeacher === "true") {
            const teacher = await TeacherTable.findOne({
                where: {
                    email
                }
            });

            const ok = await bcrypt.compare(password, teacher.password)

            if (ok) {
                jwt.sign({
                    role: "teacher",
                    id: teacher.id
                }, privateKey, {
                    algorithm: "RS512"
                })

                res.status(200).json({ ok: true, token })
                return
            }
        } else {
            const student = await StudentTable.findOne({
                where: {
                    email
                }
            });

            const ok = await bcrypt.compare(password, student.password)

            if (ok) {
                const token = jwt.sign({
                    role: "student",
                    id: student.id
                }, privateKey, {
                    algorithm: "RS512"
                })

                res.status(200).json({ ok: true, token })
                return
            }
        }

        error(res, 401, "Contraseña o usuario incorrectos")
    })

export const verifyToken = expressjwt({ secret: publicKey, algorithms: [ "RS512" ] })

/**
 * @param {import("express").Request} req
 * @param {"student" | "teacher"} role
 * @param {string | undefined | null} id
 */
export function validarIdentidad(req, role, id) {
    return !id || (req.auth.role == role && req.auth.id == parseInt(id))
}

export default auth