var express = require('express')
var app = express()

app.use(express.static("app"))
app.get("/",(req,res)=>{
  res.send("app/index.html")
})

app.listen(process.env.PORT || 3000, ()=>{

      console.log("app ready on port " + process.env.PORT + " or 3000")
})