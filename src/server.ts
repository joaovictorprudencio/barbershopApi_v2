import express from 'express'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello server')
})

app.listen(3333, () => {
  console.log('Server is running on http://localhost:3333')
})