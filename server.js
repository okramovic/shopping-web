const express = require('express'),
      app = express()


const mongo = require('mongodb').MongoClient,
      bodyParser = require('body-parser'),
      ObjectId = require('mongodb').ObjectId,
      Dropbox = require('dropbox'),
      https = require('https'),
      multer  = require('multer')    //  https://www.npmjs.com/package/multer

var multiparty = require('multiparty');
var http = require('http');
var util = require('util');

let upload = multer()

//var jsonParser = bodyParser.json()
app.use(bodyParser.json())

const clientOrigin = 'http://localhost:1234'



/*var dbx = new Dropbox({ accessToken: process.env.token });
dbx.filesListFolder({path: ''})
.then(function(response) { //getfile(response.entries[0])
  })
.catch(function(error) { console.log(error);
});*/




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



app.post('/API/postPicToDrbx', (req, res)=>{  //  upload.single()
    res.setHeader('Access-Control-Allow-Origin',clientOrigin)
  
     console.log('params', req.query, req.query.email) //  (imgData, fileName, email)
     var bodyChunks = [];
     req.on('data', chunk =>{
         //data += chunk
         bodyChunks.push(chunk)
     })
     req.on('end', ()=>{
       var body = Buffer.concat(bodyChunks);
       //console.log(data.substr(0,100))
       //console.log(typeof body)
         getToken(req.query.email)
         .then(token=> postPicToDropbox(body, req.query.fileName, token) )
         .then(link =>{
           res.send(link) 
         })
       })
     //})
    /*var form = new multiparty.Form();
    var c = 0
    form.on('part', function(part) {
        //console.log(part)
        if (part.filename) {
          c++
          // filename is defined when this is a file 
          //count++;
          console.log('got file named ' + part.name);
          console.log(part)
          
          postPicToDropbox(part)
          .catch(er=>{
            console.log('ERROR: ',er)
          })
          // ignore file's content here 
          //part.resume();
        }
    })
    form.on('close', function() {
      console.log('Upload completed!');
      res.setHeader('text/plain');
      res.end('Received ' + c + ' files');
    });
    form.parse(req);*/
  
    /*form.parse(req, function(err, fields, files) {
      console.log('fields')
      console.log(fields)
      console.log(files)
      
      
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });*/
})
const postPicToDropbox=(imgData, fileName, token)=>{
  
    return new Promise((resolve, reject)=>{
        
                      //test' + new Date() + '.jpg',
          let params = {
               "path": '/' + fileName + '.jpg',
               "mode": "add"
          }  // "autorename": true, "mute": false
          params = JSON.stringify(params)  
          console.log('params', typeof params, params)
      
      
          let bearer = "Bearer " + token    // process.env.token
          //bearer = JSON.stringify(bearer)
          //console.log('bearer', bearer)
        
        const options = {
            host: 'content.dropboxapi.com',
            path: '/2/files/upload',
            method: 'POST',
            headers: {
                'Authorization': bearer,
                "Dropbox-API-Arg": params,
                'Content-Type': 'application/octet-stream'
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
                console.log('result', typeof result, result);
                
                resolve(result.link)
              })
        });

        req.on('error', function(e) {
          console.log('ERROR: ' + e.message);
        });
  
        //let obj = ''
        //console.log(typeof obj, obj)
  
  
        req.write(imgData, (x)=>{  //console.log('x',x)
        }); 
        req.end();
        
     })   
    
}
const getToken = (email) =>
    new Promise((resolve, reject)=>
        mongo.connect(process.env.mongo, (er, DB)=>{
      
            if (!er) DB.db('shopping_app').collection('users').findOne({email},(er,user)=>{
              
                  if (user.dbxToken) resolve(user.dbxToken)
                  else reject()
            })
        })
    )
    





// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index2.html');
});

app.post('/API/pushCountriesOfUser',(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin',clientOrigin)
  
    
    let bodyChunks = [];
    req.on('data', chunk => bodyChunks.push(chunk))
    req.on('end', ()=>{
      let body = Buffer.concat(bodyChunks);
      body = JSON.parse(body)    //  https://hackernoon.com/https-medium-com-amanhimself-converting-a-buffer-to-json-and-utf8-strings-in-nodejs-2150b1e3de57
      //return console.log(body)
      
      mongo.connect(process.env.mongo, (er, DB)=>{
          const col = DB.db('shopping_app').collection('users_countries')
          
          col.findOneAndUpdate({email: body.email}, {$set:{countries: body.countries}},(er, result)=>{
                console.log('   update result:',result.ok, result)
                if (!er && result.ok === 1) res.send('ok')//res.sendStatus(200)
                else res.sendStatus(400)
                //res.end()
          })
      })
    })
})

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
app.post('/API/updateDBXToken', (req,res)=>{
        res.setHeader('Access-Control-Allow-Origin',clientOrigin)

        console.log('updateDBXToken', req.body, req.query)
        let data =""
        req.on('data', chunk => data+= chunk)
        req.on('end',()=>{
          data = JSON.parse( data) 
            
          if (!data.token || data.token==='') return;
          
          mongo.connect(process.env.mongo, (er,DB)=>{
                
                const coll = DB.db('shopping_app').collection("users")
                
                coll.findOneAndUpdate(
                      { "email" : data.email},
                      { $set: { "dbxToken" : data.token}},
                      (er, result)=>{
                      /*
                          { lastErrorObject: { updatedExisting: true, n: 1 },
                            value: 
                             { _id: 5a5211c15112802d4dca854c,
                               email: 'okram@protonmail.ch',
                               userName: 'app owner',
                               password: 'nick s',
                               followedUsers: [ [Object] ] },
                            ok: 1 }
                      */
                      //console.log('    ', result.ok, result)

                      if(!er && result.ok === 1) { 
                        console.log('    alles ok')
                        res.sendStatus(200)
                        res.end()
                      } else res.sendStatus(400)      
                })
            })
        })
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
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