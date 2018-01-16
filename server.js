// server.js
// where your node app starts

// init project
const express = require('express'),
   app = express()
const mongo = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId,
      Dropbox = require('dropbox'),
      https = require('https')


const clientOrigin = 'http://localhost:1234'



var dbx = new Dropbox({ accessToken: process.env.token });
dbx.filesListFolder({path: ''})
  .then(function(response) {
     console.log('DBDBDBDBDB')
     //console.log(response.entries);
     //getfile(response.entries[0])
  })
  .catch(function(error) {
    console.log(error);
  });


const getfile = function(fileEntry){
  
    return new Promise((resolve, reject)=>{
        console.log('file path to get', fileEntry.path_display)
        const id = fileEntry.id
        
        const options = {
            host: 'api.dropboxapi.com',
            path: '/2/files/get_temporary_link',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer qAZQ0ocdGioAAAAAAAACt4axxwChUOZ5U2XLXB1hvSzxXai4btwbq7O3LjzMst5c'
                ,'Content-Type': 'application/json'
            }
        }  

        var req = https.request(options, function(res) {
              console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));

              // Buffer the body entirely for processing as a whole.
              var bodyChunks = [];
              res.on('data', function(chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
              })
              .on('end', function() {
                var body = Buffer.concat(bodyChunks);
                //console.log('BODY: ' + body)
                let result = JSON.parse(body)
                console.log( typeof result, result.link);
                
                resolve(result.link)
              })
        });

        req.on('error', function(e) {
          console.log('ERROR: ' + e.message);
        });
  
        let obj = JSON.stringify({path: fileEntry.path_display })
        console.log(typeof obj, obj)
  
  
        req.write(obj, (x)=>{  //console.log('x',x)
        }); 
        req.end();
        
     })   
          /*const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){
               if (this.readyState == 4 && this.status == 200) {

                    console.log('SUKCES', this.response, this.responseText)
                    
                    let img = document.querySelector('#preview')
                    img.src = this.responseText
                    //const URL = window.URL || window.webkitURL
                    //img.src = URL.createObjectURL(this.response) 

               } else

               console.log('header', this.getAllResponseHeaders())
          }
          //xhr.open('POST','https://content.dropboxapi.com/2/files/get_thumbnail',true)
          xhr.open('POST','https://api.dropboxapi.com/2/files/get_temporary_link', true)
          xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
          xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With");
          //xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');

          xhr.setRequestHeader("Authorization", "Bearer qAZQ0ocdGioAAAAAAAACt4axxwChUOZ5U2XLXB1hvSzxXai4btwbq7O3LjzMst5c")
          xhr.setRequestHeader('Content_Type','application/json')
          
          xhr.send(obj)*/
}
app.post('/API/getPicURL',(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin',clientOrigin)
  
    let data = ""
    req.on('data', chunk=>{
        data += chunk
    })
    req.on('end', ()=>{
        
      data = JSON.parse(data)
      //console.log('requested user',data, typeof data)
      const myfunc = getfile
      myfunc(data).then(result=>res.send(result))
    })
      
})

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index2.html');
});


app.post('/API/getCountriesOfUser',(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin',clientOrigin)
  
    let user = ""
    req.on('data', chunk=>{
        user += chunk
    })
    req.on('end', ()=>{
        console.log('requested user',user, typeof user)
      
        mongo.connect(process.env.mongo, function(er, DB){
            if (er) { //throw new Error(er)
                     res.sendStatus(500)
                     return res.end()
            }
            const countries = DB.db('shopping_app').collection("users_countries")
                  
            countries.findOne({email: user},(er, countries)=>{
                      console.log('cntryData',countries)
              
                      if (!er && countries!==null) {
                          delete countries._id
                          //res.setHeader('Content-Type', 'application/json');
                          res.json(countries)  // sends user's email and country data
                        
                      } else res.sendStatus(500)
                      res.end()
            })
        })
    })
})
app.get ('/API/search',(req,res)=>{
    
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
                    if (followed && followed.find(user=>user.email==data.email)===undefined) followed.push({userName: data.userName,email:data.email})
                    else if (!followed) followed = [{userName: data.userName,email:data.email}]

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
                if (er || !result) return res.sendStatus(400)
                
                const toSend = { userName: result.userName, followedUsers:result.followedUsers}
                
                res.setHeader('Content-Type', 'application/json')
                res.json(toSend)
                res.end()
            })
          })
    })
})
app.post('/API/signup',(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', clientOrigin)
  console.log('signup request from')
  
  let data =""
  req.on('data', chunk=>data+= chunk)
  req.on('end',()=>{
        data = JSON.parse( data) 
        console.log(data)
     
        mongo.connect(process.env.mongo, function(er, DB){
          if (er) throw new Error(er) 
          const col = DB.db('shopping_app').collection("users")
          
          // check if email isnt used already
          col.find({email:data.email}).toArray(function(er, result){
              if (er) throw new Error(er)
              console.log(result.length)
            
              if (result.length>0) {
                    res.sendStatus(400)
                    res.end()
                    DB.close()
                
              } else col.insertOne(data,(er,result)=>{
                          if (er) throw new Error(er)
                          console.log('new user added?',result.insertedCount, result.insertedId)
                
                          if (result.insertedCount == 1){
                              const countries = DB.db('shopping_app').collection("users_countries")
                              
                              countries.insertOne({_id: new ObjectId(result.insertedId), 
                                                   email: data.email,
                                                   countries: [initialCountryData]}, 
                                                  (er, result)=>{
                                      console.log('new to user_countries?',result.insertedCount, result.insertedId)
                                      if (!er && result.insertedCount===1) res.sendStatus(200)
                                      else res.sendStatus(500)
                                      res.end()
                                      DB.close()
                              })
                              
                          }
                          // update text index in DB - for searching functionality
                          col.createIndex( { "username": "text", "email":"text" } )
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
                                          products: [{"name":"časopis"},{"name":"denní tisk"},{"name":"lulka"}]
                                        }]
                              }] 
                           }