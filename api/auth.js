import { generateKeyPairSync } from "crypto";
import { Router } from "express";
import { Enrollment, Student, Subject, Teacher } from "../db/index.js";
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
            const teacher = await Teacher.findOne({ 
                where: {
                    email
                }
            });

            const ok = await bcrypt.compare(password, teacher.password)
            
            if (ok) {
                jwt.sign({
                    role: "teacher",
                }, privateKey, {
                    algorithm: "RS512"
                })

                res.status(200).json({ ok: true, token })
                return
            }
        } else {
            const student = await Student.findOne({ 
                where: {
                    email
                }
            });

            const ok = await bcrypt.compare(password, student.password)
            
            if (ok) {
                const token = jwt.sign({
                    role: "student",
                }, privateKey, {
                    algorithm: "RS512"
                })
                
                res.status(200).json({ ok: true, token })
                return
            }
        }

        error(res, 401, "Contraseña o usuario incorrectos")
    })

export default auth