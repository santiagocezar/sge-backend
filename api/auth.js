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

const EXPIRY = 3600 // una hora

auth.route("/login")
    .post(async (req, res) => {
        const { isTeacher, email, password } = req.body;

        let payload = undefined

        if (email === "admin@admin.com" && password === "admin") {
            payload = {
                role: "admin",
                id: 0,
            }
        } else if (isTeacher) {
            const teacher = await TeacherTable.findOne({
                where: {
                    email
                }
            });

            if (await bcrypt.compare(password, teacher.password)) {
                payload = {
                    role: "teacher",
                    id: teacher.id,
                }
            }
        } else {
            const student = await StudentTable.findOne({
                where: {
                    email
                }
            });

            if (await bcrypt.compare(password, student.password)) {
                payload = {
                    role: "student",
                    id: student.id,
                }
            }
        }

        if (payload) {
            const token = jwt.sign(payload, privateKey, {
                algorithm: "RS512",
                expiresIn: EXPIRY
            })

            res.status(200).json({
                ok: true,
                token,
                expiresIn: EXPIRY,
                ...payload
            })
        } else {
            error(res, 401, "Contraseña o usuario incorrectos")
        }
    })

export const verifyToken = expressjwt({ secret: publicKey, algorithms: [ "RS512" ] })

/**
 * @param {"student" | "teacher"} role
 */
export function requiereRol(role) {
    /**
     * @type {import("express").RequestHandler}
     */
    const middleware = (req, res, next) => {
        if (req.auth.role !== role) {
            error(res, 403, "No tiene el permiso")
        } else {
            next()
        }
    }
    return middleware
}

/**
 * @param {import("express").Request} req
 * @param {"student" | "teacher"} role
 * @param {string | undefined | null} id
 */
export function validarIdentidad(req, role, id) {
    return !id || (req.auth.role == role && req.auth.id == parseInt(id))
}

export default auth