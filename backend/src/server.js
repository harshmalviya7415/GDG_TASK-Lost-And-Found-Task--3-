const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db")
dotenv.config();
 



const app = express();


app.use(cors());
app.use(express.json());

connectDb();    

app.get("/", async(req, res)=> {
    res.send("backend is running");
})

const PORT = process.env.PORT || 1500;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
