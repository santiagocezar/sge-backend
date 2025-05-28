import express from 'express'

const app = express()

// respond with "hello world" when a GET request is made to the homepage
app.put('/api/alumnos/:id', (req, res) => {
    req.params
})
app.get('/', (req, res) => {
    res.send('hello world')
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})