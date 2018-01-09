// server.js
// where your node app starts

// init project
const express = require('express'),
   app = express()
var mongo = require('mongodb').MongoClient
 
const clientOrigin = 'http://localhost:1234'


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/API/search',(req,res)=>{
    
    let string = req.query.string //|| ""
    //console.log('search for ',typeof req.query.string,req.query.string==null, '>', string,typeof string,'<', req.query.useremail)
    
  
    mongo.connect(process.env.mongo, function(er, DB){
            if (er) throw new Error(er) 
            const col = DB.db('shopping_app').collection("users")
            

            let searchObject = {} //  or  db.users.find( { 'name' : { '$regex' : yourvalue, '$options' : 'i' } } )  // from Mongo version 3 up
            if (string!=='null') searchObject = { $text:{$search: string} }
      
            col.find(searchObject,{'username':1, 'email':1}).toArray((er, results)=>{
              
                //console.log(results)
                results = results.filter(user=>user.email!==req.query.useremail).map(user=>{delete user.password; delete user._id; return user})
                console.log(results)
              
                res.setHeader('Access-Control-Allow-Origin',clientOrigin)
                res.send(results)
                res.end()
                DB.close()
            })
    })
})
app.post('/API/followuser', (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin',clientOrigin)
  
    let data =""
    req.on('data', chunk=>data+= chunk)
    req.on('end',()=>{
        data = JSON.parse( data) 

        mongo.connect(process.env.mongo, function(er, DB){
            if (er) throw new Error(er) 
            const col = DB.db('shopping_app').collection("users")

            col.findOne({email:data.addTo},(er, user)=>{
                    let followed = user.followedUsers

                    // search for newly requested user and add only if not already present
                    if (followed && followed.find(email=>email==data.email)===undefined) followed.push(data.email)
                    else if (!followed) followed = [data.email]

                    console.log('    ',user.followedUsers)

                    col.updateOne({ email: data.addTo },
                                  { $set:{ followedUsers: followed }}, 
                                  (er, result)=>{
                          console.log('    updated?', result.matchedCount, result.modifiedCount, 'ok? ',result.result.ok)
                          if (result.matchedCount==1) res.sendStatus(200)
                          else res.sendStatus(400)
                          res.end()
                          DB.close()
                    })
            })
        })
    })
})

app.post('/API/login', (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin',clientOrigin)
  
  console.log('login request', req.query, req.body)
    let data =""
    req.on('data', chunk=>data+= chunk)
    req.on('end',()=>{
          data = JSON.parse( data) 
          console.log(data)
 
          mongo.connect(process.env.mongo, function(er, DB){
            if (er) throw new Error(er) 
            const col = DB.db('shopping_app').collection("users")

            col.findOne({email:data.email, password: data.password},function(er, result){
                console.log('result', result)
                if (er) res.sendStatus(400)
              
                result = result
                res.end(result.username)
            })
          })
    })
})

app.post("/API/signup",(req,res)=>{
  console.log('signup request', req.query, req.body)
  
  let data =""
  req.on('data', chunk=>data+= chunk)
  req.on('end',()=>{
        data = JSON.parse( data) 
        console.log(data)
     
        mongo.connect(process.env.mongo, function(er, DB){
          if (er) throw new Error(er) 
          const col = DB.db('shopping_app').collection("users")
          
          col.find({email:data.email}).toArray(function(er, result){
              if (er) throw new Error(er)
            
              console.log(result.length)
              res.setHeader('Access-Control-Allow-Origin', clientOrigin)
            
              if (result.length>0) {
                    res.sendStatus(400)
                    res.end()
                    DB.close()
              } else col.insertOne(data,(er,result)=>{
                          if (er) throw new Error(er)
                
                          console.log(result.insertedCount)
                          if (result.insertedCount == 1) res.sendStatus(200)
                          res.end()
                          // update text index in DB
                          col.createIndex( { "username": "text", "email":"text" } )
                          DB.close()
              })
          })
      })
  })
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});




const initialCountryData = {
                              name: 'all countries' , 
                              cities: [
                              {
                                  name: 'all cities', 
                                  shops:[{
                                          name: 'all shops',
                                          products: [{"name":"časopis"},{"name":"denní tisk"}]
                                        }]
                              }] 
                           }