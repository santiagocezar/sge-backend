/**
 * @param {import("express").Response} res
 * @param {number} code 
 * @param {string} message
 */
export function error(res, code, message) {
    res.status(code)
    res.json({
        ok: false,
        error: message
    })
}