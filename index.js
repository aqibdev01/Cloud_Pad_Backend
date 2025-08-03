import connectToMongo from "./db.js"
import express from "express"
import auth from "./routes/auth.js";
import notes from "./routes/notes.js";

connectToMongo();
const app = express()
const port = 3000

app.use('/api/auth', auth)
app.use('/api/notes', notes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
