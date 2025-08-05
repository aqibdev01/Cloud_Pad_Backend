import connectToMongo from "./db.js"
import express from "express"
import auth from "./routes/auth.js";
import notes from "./routes/notes.js";
import dotenv from "dotenv";

dotenv.config();
connectToMongo();
const app = express()
const port = 5000
app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/notes', notes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on https://localhost:${port}`)
})
