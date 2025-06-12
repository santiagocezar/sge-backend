import { z } from "zod/v4";

/** 
 * @template {z.ZodObject} T
 * @param {T} schema
 * @param {any} data
 * @return {Omit<z.infer<T>, "id">}
 */
export function validarPost(schema, data) {
    return schema.omit({ id: true }).parse(data)
}

/** 
 * @template {z.ZodObject} T
 * @param {T} schema
 * @param {any} data
 * @return {Partial<z.infer<T>>}
 */
export function validarPut(schema, data) {
    return schema.partial().parse(data)
}

/**
 * @typedef {z.infer<typeof StudentSchema>} Student
 */
export const StudentSchema = z.object({
    id: z.int(),
    name: z.string(),
    surname: z.string(),
    dni: z.int(),
    email: z.email(),
    phone: z.string(),
    career: z.literal(["A", "B", "C", "D", "E", "Z"]),
    password: z.string(),
})

/**
 * @typedef {z.infer<typeof TeacherSchema>} Teacher
 */
export const TeacherSchema = z.object({
    id: z.int(),
    name: z.string(),
    surname: z.string(),
    dni: z.int(),
    email: z.email(),
    phone: z.string(),
    password: z.string(),
})

/**
 * @typedef {z.infer<typeof AbsenceSchema>} Absence
 */
export const AbsenceSchema = z.object({
    id: z.int(),
    date: z.string().pipe( z.coerce.date() ),
    justified: z.boolean(),
    studentID: z.int(),
    subjectID: z.int(),
})

/**
 * @typedef {z.infer<typeof GradeSchema>} Grade
 */
export const GradeSchema = z.object({
    id: z.int(),
    instance: z.string(),
    grade: z.int(),
    studentID: z.int(),
    subjectID: z.int(),
})

/**
 * @typedef {z.infer<typeof EnrollmentSchema>} Enrollment
 */
export const EnrollmentSchema = z.object({
    id: z.int(),
    instance: z.string(),
    grade: z.int(),
    studentID: z.int(),
    subjectID: z.int(),
})

/**
 * @typedef {z.infer<typeof SubjectSchema>} Subject
 */
export const SubjectSchema = z.object({
    id: z.int(),
    name: z.string(),
    career: z.literal(["A", "B", "C", "D", "E", "Z"]),
    duration: z.literal([ 0, 1, 2 ]),
    schedule: z.string(),
    teacherID: z.int(),
})
