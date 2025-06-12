import { generateKeyPairSync } from "crypto";
import { Router } from "express";
import { EnrollmentTable, StudentTable, SubjectTable, TeacherTable } from "../db/index.js";
import { error } from "./common.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return error(res, 401, "No se proporcionó el token")
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
        return error(res, 401, "Formato de token inválido")
    }

    const [scheme, token] = parts;

    jwt.verify(token, publicKey, { algorithms: ["RS512"] }, (err) => {
        if (err) {
            return error(res, 401, "Token inválido")
        }
        next();
    });
};


export default auth