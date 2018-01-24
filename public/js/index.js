/**
 *        simple state management http://vuetips.com/simple-state-management-vue-stash
 * 
 */


// for each product do display in DOM, use Component or template



'use strict'

const Dexie = require('./vendor/Dexie.2.0.1.js'),
      Vue = require('./vendor/Vue.2.5.13.js')

const serverURL = 'https://shopp.glitch.me/'

//import {addLocationToDB2} from './copy.js';

//const token = 'qAZQ0ocdGioAAAAAAAACs8r7cWwxjlWLJx6b-qwlQOGEURMf-srx2X1wS_RnHari'

var Dropbox = require('dropbox');
//let dbx //= new Dropbox({ accessToken: token });


/*dbx.filesListFolder({path: ''})
  .then(function(response) {
     console.log('DBDBDBDBDBD')
     console.log(response);
     //getfileThumb(response.entries[0])
     response.entries.forEach(entry=>{
          getPicURL(entry)
          .then(url=>{
               let img = new Image()
               img.onload = function(){
                    this.width=144
                    this.height=256
               }
                    
               img.src = url
               let body = document.querySelector('body')
               body.appendChild(img)
          })
     })
     //  convert url to file?  https://stackoverflow.com/questions/28042535/converting-image-object-to-file-object-javascript
  })
  .catch(function(error) {
    console.log(error);
  });
*/

const getfileThumb = function(fileEntry){
          
          const id = fileEntry.id

          //let obj = { "path": id , format: "jpeg", size: "w128h128" }
          let obj = {"path": fileEntry.path_display }
          obj = JSON.stringify( obj) 
          console.log(obj)

          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){
               if (this.readyState == 4 && this.status == 200) {

                    console.log('SUKCES', this.response, this.responseText)
                    
                    let img = document.querySelector('#preview')
                    img.src = this.responseText
                    //const URL = window.URL || window.webkitURL
                    //img.src = URL.createObjectURL(this.response) 

               } else console.log('header', this.responseText, this.getAllResponseHeaders())
          }
          //xhr.open('POST','https://content.dropboxapi.com/2/files/get_thumbnail',true)
          xhr.open('POST','https://api.dropboxapi.com/2/files/get_temporary_link', true)
          xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
          xhr.setRequestHeader("Access-Control-Allow-Headers", "X-Requested-With");
          //xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');

          xhr.setRequestHeader("Authorization", "Bearer qAZQ0ocdGioAAAAAAAACt4axxwChUOZ5U2XLXB1hvSzxXai4btwbq7O3LjzMst5c")
          //xhr.setRequestHeader("Dropbox-API-Arg", obj)
          //xhr.responseType = 'blob';
          //xhr.send()
          xhr.setRequestHeader('Content_Type','application/json')
          
          xhr.send(obj)
}


/*let getDropToken = function(){
     const xhr = new XMLHttpRequest()
     xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) {

                         console.log('SUKCES', this.response, this.responseText)
                         
                         

                    } else console.log('header',this.status, this.getAllResponseHeaders())
     }
          //let url = 'https://www.dropbox.com/oauth2/authorize?' + 'response_type=token&' + 'client_id=hqdb69ima3zv29t&' + 'redirect_uri=http://localhost:1234/'
     let url = 'https://api.dropboxapi.com/oauth2/token'
     xhr.open('POST',url, true)
     //xhr.send(   )

}*/

const checkDrBxToken = function(){

     const user = localStorage.getItem('deviceUserEmail')
     if (!user) return;

     if ( navigator.onLine && window.location.hash && 
          window.location.hash.includes('access_token=') && 
          window.location.hash.includes('token_type=bearer')){
          

          // #access_token=qAZQ0ocdGioAAAAAAAACvzPeVzvTqmMsfEDCwQap8UvEMVAu8F0Zqatd1IypdhAt
          // &token_type=bearer  // &uid=300342838  // &account_id=dbid%3AAAC5NUHLEil2GAOA3Si3wQmQ2pBC6qKCsEo

          let str = window.location.hash.substr(1)
          let arr = decodeURI(str).split('&')
          //console.log(str,'arr',arr)
          const token = arr[0].replace('access_token=','')
          //window.accessToken = 
          console.log('    token', token)

          updateDBXToken(user, token)

          window.dbx = new Dropbox({accessToken:token})

          /*dbx.filesListFolder({path: ''})
          .then(function(response) {
               console.log('    ',response);

          })*/
          
     } else console.log('####   no new dropbox token   ####')
}
const updateDBXToken = function(email, token){
     console.log('tokenizing', email, token)

     const request = new Request(serverURL + 'API/updateDBXToken',{
          headers: new Headers({
               'Content-Type': 'application/json'
          }),
          method: 'POST',
          mode:'no-cors',
          body: JSON.stringify({ email, token })
     })


     fetch(request)
     .then(console.log)
}


const initalCountryData = [{
     name: 'all countries' , 
     cities: [
               {
                name: 'all cities', 
                shops:[{
                         name: 'all shops',
                         products: [{"name":"časopis"},{"name":"denní tisk"},{"name":"česká igelitka"}]
                }]
               }
     ]
}]



window.otherUsers = []


window.deviceUserData = new Dexie('deviceUserData')

window.deviceUserData.version(1).stores({  userData: 'userName, countries'  })
window.deviceUserData.open()
     .then(data=>{
               //console.log('open own DB, data:', data)
     })
     .catch(function(error) {
               console.error('Uh oh : ' + error);
     });


const users_followed = new Dexie('users_followed')
      users_followed.version(1).stores({ userData: 'email, userName, countries'})
      users_followed.open()
      .catch(error => {
               console.error('Uh oh : error opening Users_followed db' + error);
      });
     
     //const user1data = require('./testUserData1.json'), user2data = require('./testUserData2.json')
     //users_followed.userData.put(user1data)
     //users_followed.userData.put(user2data)


const picturesDB = new Dexie('product_img')
      picturesDB.version(1).stores({item: 'fileName, userName, data'})  // filename contains email
      picturesDB.open()
      .catch(er=>console.error('couldnt open DB',er))
      




const app = new Vue({
     el: '#app',
     data: {
          screen:'main',
          showSignUp: false,
          showLogin: false,
          seeSignUp: false,
          loginemail: null,
          loginpass: null,

          searchText: null,
          searchResults: null,
          followedUsers: [],

          showSettings: false,
          userName: undefined,
          console: undefined,
          locationInputShown: false,
          locationSet: null,
          newLocation: null,

          currentCountry: null,
          currentCity:  null,
          currentShop:  null,
          countries: [],
          cities: [],
          shops: [],
          currentDisplayedProducts: [],

          mouseMillis: 0,
          newProductForm: false,
          newProductPreview: false,
          newProductPreviewLastModified: null,
          newProductType: null,
          newProductName: null,
          newProductDescription: null,
          newProductDescriptionLong: null,
          newProductPrice: null,

          modifyingProduct: false,
          productModified: null,
     },
     methods:{
          switchScreen:function(screen){
               this.screen = screen

               if (screen =='main'){
                    this.locationInputShown = false
                    this.locationSet = null
                    this.newLocation = null

                    this.newProductForm = false;
               }
          },
          showUserSettings:function(show){
               this.showSettings = show;
               if (show) this.screen = 'settings'
               else this.screen = 'main'
          },
          login:function(){
               let email = this.loginemail,
                   password = this.loginpass

               console.log('longin', email, password)

               const tosend = {email, password}, self = this,

               xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function() {

                    if (this.readyState == 4 && this.status == 200) {      console.log('received',typeof this.responseText, this.responseText)

                         let LSitems = ['deviceUserEmail', 'deviceUser', 
                                        'followedUsers', 'countries',
                                        'cities', 'shops']
                         LSitems.forEach(item=> window.localStorage.removeItem(item) )

                         let loginResponse
                              
                         if (typeof this.responseText==='string') loginResponse = JSON.parse(this.responseText)

                         window.localStorage.setItem('deviceUserEmail', email)
                         updateDeviceUser(loginResponse.userName)
                              
                         if (loginResponse.followedUsers) // this doesnt store their country data
                                   loginResponse.followedUsers.forEach(user=>addUserToDeviceLS(user))

                         self.userName = loginResponse.userName

                         self.informUser(`You hip'n'roll! Now logged iN`) // rock'n'hop
                         self.screen = 'main'
                         
                         return self.startApp()

                    } else if (this.readyState == 4 && this.status == 400){

                         self.informUser(`something went wrong, try again later`)
                    }
               }
               xhr.open("POST", serverURL + "API/login", true)
               xhr.send(JSON.stringify( tosend))

          },
          signUp: function($event){
               $event.preventDefault()
               let self = this
                    let email = document.querySelector('input[name="reg-useremail"').value
                    let userName = document.querySelector('input[name="reg-username"').value
                    let password  = document.querySelector('input[name="reg-userpassword"').value

               if (userName==0) return alert(`sorry, '${userName}' can't be accepted as username`) // 0 is reserved for unregistered user in IDB

               const tosend = {email, userName, password}
               

               if (!email || !userName || ! password) return console.error('email or name or pass missing')

               let xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function() {
                    
                    if (this.readyState == 4 && this.status == 200) {  //this.responseText;
                              //console.log(this.responseText,this.status)

                              self.informUser(`You rock'n'b! Account created, check your email, spam etc`)
                              window.localStorage.setItem('deviceUserEmail', email)

                              updateDeviceUser(userName)
                              
                              self.userName = getDeviceUser()
                              //.then(name=>self.userName = name)
                              self.screen = 'main'

                              return self.startApp()

                    } else if (this.readyState == 4 && this.status ==400)

                              self.informUser(`Email address '${email}' is already used..`)
                    else {}

                  };

               xhr.open("POST", serverURL + "API/signup", true)
               //xhr.setRequestHeader('Access-Control-Allow-Origin', true)  //Access-Control-Allow-Origin
               xhr.send(JSON.stringify( tosend))
          },
          logout: function($ev){
               console.log('>> logouted <<')
               
               let items = ['deviceUserEmail', 'deviceUser', 
               'followedUsers', 'countries',
               'cities', 'shops']

               items.forEach(item=>{
                    console.log('item to remove', item)
                    return window.localStorage.removeItem(item) })
               
               //this.userName = undefined
               console.log('now will reload app')
               return this.startApp()
          },
          requestDropboxAccess:function(){
               
               const url = 'https://www.dropbox.com/oauth2/authorize?' + 
                         'response_type=token&' +
                         'client_id=hqdb69ima3zv29t&' +
                         'redirect_uri=' + window.location.origin + '/'    //'http://localhost:1234/'

               window.location.href = url
          },
          fetchMyCountries:function(){
               console.log('fetching my countries of >', this.userName, '<')

               if (!this.userName) return alert('unregistered user cant back up his data')

               fetchCountriesOfUser({   userName: this.userName,
                                        email: localStorage.getItem('deviceUserEmail')
               }).then(userData =>{

                    console.log('|||  userData fecthed', userData)

                    return updateDeviceUserCountries(this.userName, userData.countries)
                    
               })
               .then( (result) => {
                    console.log('after saving user own data', result)
                    this.informUser(`Sukces - your own data updated!`)

                    return this.startApp()
               })
                    
          },
          pushMyCountries:function(){
               if (!this.userName ) return alert('unregistered user cant back up data online')
               if (!navigator.onLine) return alert(`ooops, you're not online..`)

               console.log('pushing my countries', this.userName)
               const email = localStorage.getItem('deviceUserEmail')

               sendCountryDataOfUser({email, userName: this.userName})
               .then(()=>{

               })
               .catch(er=>{
                    this.informUser(`Didnt work out as planned. Try again?`)
               })
          },
          requestUsers:function(){
               let string = this.searchText
               const self = this
               console.log('search for:', string)

               const xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) { 

                         console.log('recevide', this.responseText, typeof this.responseText)
                         const users = JSON.parse(this.responseText)
                         console.log(users)
                         self.searchResults = users
                    }
               }
               xhr.open('GET', serverURL + 'API/search?string=' + string + "&useremail=" + window.localStorage.getItem('deviceUserEmail'), true)
               xhr.send( string)

          },
          informUser: function(msg, millis = 3000){
               this.console = msg

               setTimeout(()=>{
                    this.console = undefined
               },millis)
          },
          followUser:function(email,userName){
               console.log('follow', email,userName)
               const self = this

               const xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function(){

                    if (this.readyState == 4 && this.status == 200) { 
                         console.log('follow sekces')
                         
                         addUserToDeviceLS({userName, email})    // store new followdee in local storage

                         fetchCountriesOfUser({userName, email})
                         .then(setOtherUserIDBData)              // hard-replaces whole document with new data
                         .then(self.startApp)                    // here it copies data(countries etc) to device users

                    } else if (this.readyState == 4 && this.status == 400) { 
                         console.error('TRY AGAIN LATER')
                         this.informUser('TRY AGAIN LATER')
                         // finish this part
                    }
               }
               xhr.open('POST', serverURL + 'API/followuser', true)
               xhr.send(JSON.stringify({  email, 
                                          userName,
                                          addTo: window.localStorage.getItem('deviceUserEmail')
                                       })
               )

          },
          isFollowed:function(email){
                    let users = JSON.parse(  window.localStorage.getItem('followedUsers')  )
                    //console.log('search for',email, 'LS followed users', users)

                    if (!users || users.some(user=>user.email== email)===false) return false
                    else return true
          },
          unfollowUser:function(email){

               // delete local storage country data of that user only if he isnt followed by any other deviceUser in IDB
          },
          openLocationInput: function(set,ev){
               this.locationInputShown = true
               //console.log('event', set, ev)
               this.locationSet = `${set}`

               if (this.locationSet=='city' && this.currentCountry == 'all countries') {
                    alert('choose country first')
                    return this.locationInputShown = false
               }
          },
          addNewLocation: function(){
               
               if (!this.newLocation) this.informUser('no name?',1500)
               if (this.newLocation == 'all countries' || this.newLocation == 'all cities' || this.newLocation == 'all shops'){
                         this.informUser(`sorry, '${this.newLocation}' is one of names that are not allowed`,3000)
                         return this.newLocation = ''
               }
               //console.log(`new ${this.locationSet} is ${this.newLocation}`)

               const addLocation = addNewLocationToDB.bind(this)

               return addLocation( this.locationSet, this.newLocation.toString() )
          },
          updateLocationSelect:function(index, event,requestedShopName){
               //console.log('slct', event.srcElement.selectedIndex)
               //console.log('event','>',requestedShopName,'<')//'\n', event.srcElement.getAttribute('data-saveas')  )

               if (event && event.srcElement.selectedIndex<0) return;      // protection against DOM load events ?

               const self = this
               const selects = ['countries', 'cities', 'shops','products'],
                     currents= ['currentCountry','currentCity','currentShop']
               let name
               if (event) {
                    name = event.srcElement.selectedOptions[0].text
                    setLastSelection(event.srcElement.getAttribute('data-saveas'), name)

               } else name = requestedShopName
               
               //return console.log('name', name, 'event', event)
               
               getSubsetItems(this,index,name)
                    .then(initialOwnProducts =>{
                         // save last locations to local storage rather here?
                         return;

                         // none of the below is needed now
                         const userOwnProducts = initialOwnProducts.map(prod=>{prod.owner = this.userName || 0; return prod})
                         console.log('----- user own products:', userOwnProducts.length, userOwnProducts)

                         // get products from each user in IDB: for current city, shop etc
                         getOtherUsersIDBData(this.followedUsers)
                         .then(users=>{
                              console.log('users to add products from', users)

                              let finals = []
                              if (userOwnProducts.length>0) finals = [...userOwnProducts]

                              console.log('finals1', finals.length)


                              if (users){
                                   let otherProds = users.map(user=>{

                                        const countryI = user.countries.findIndex(cntry => cntry.name === self.currentCountry)

                                        if (countryI > -1){
                                             
                                             const cityI = user.countries[countryI].cities.findIndex(city=>city.name === self.currentCity )
                                             //console.log('cityI', cityI)
                                             const shop = user.countries[countryI].cities[cityI].shops.find(shop=>shop.name===self.currentShop)
                                             //console.log('shop', shop)
                                             if (shop && shop.products) return shop.products
                                        }
                                   }).filter(prods=>prods!==undefined)

                                   if (otherProds.length>0) finals = finals.concat(...otherProds)
                              }
                              console.log('finals', finals)

                              /*return new Promise((resolve, reject)=>{
                                   
                                   resolve (this.currentDisplayedProducts = finals ) // display products on screen

                                   // check out vue cheatsheet (v-bind) to see how to attach classes
                              })*/
                              return finals
                               
                         })
                         .then(finals=>{
                              console.log('finals2', finals)

                              let prodsWImages = finals
                                                  .filter(prod=>!!prod.imgName)
                                                  .map(prod=>prod.imgName)

                              /*let imgNames = document.querySelectorAll('div.product p.prodImgData')
                                   let onlyNames = nodeListToArray(imgNames)*/
                                   //console.log(imgNames, 'onlyNames', onlyNames)


                              //
                              return getImagesData(prodsWImages)
                              
                         })
                         // give images their data
                         .then(urls=>{
                              let els = document.querySelectorAll('div.product img'),
                              images = nodeListToArray(els)

                              /** from docs
                               * <!-- bind an attribute -->
                                 <img v-bind:src="imageSrc">
                               */
                              
                              //console.log('??urls??', urls)
                              images.map((image,i)=>image.src = urls[i])
                         })
                    })
               function getSubsetItems(self, outerIndex, name){
                    
                    if (outerIndex>4) return console.error('outerIndex>4  !!!',outerIndex) // this doesnt seem to ever happen
                    
                    return new Promise((resolve, rej)=>{
                         // 0 1 2
                         const currentX = currents[outerIndex]  // 'currentCountry' 'currentCity' 'currentShop'
                         const index = outerIndex,
                               superSet = selects[index-1], // 'countries' 'cities' 'shops'
                               set      = selects[index],   // 'countries' 'cities' 'shops'
                               subSet   = selects[index+1]  // 'countries' 'cities' 'shops'
                               
                         let a = self[set].find(el=> el.name===name )
                         
                         
                         self[currentX] = name
                         setLastSelection(set, name)
                         console.log('current',currentX, name)
                         
                         

                         self[subSet] = a[subSet]
                         //console.log('subSet', subSet)
                         
                         if (currents[outerIndex+1]=== undefined) {
                              //console.log('products?', a.name, a[subSet])
                              resolve(a[subSet]) 
                         }
                         else {
                              let string = currents[outerIndex+1].toString()
                              self[string]= a[subSet][0].name    // 'currentCountry' 'currentCity' 'currentShop'
                              
                              resolve(
                                   getSubsetItems(self, outerIndex + 1, a[subSet][0].name)          
                              )
                         }
                    })
               }
          },
          startTimer:function(prod){
               //console.log('start timer')
               const self = this
               window.mouseTimer = setInterval(()=> self.mouseMillis += 10 ,10)
          },
          stopTimer:function(ev, prod){
               
               clearInterval(window.mouseTimer)
               //console.log('stop timer', this.mouseMillis, prod, ev)

               if (this.mouseMillis<300){} // its a click -> enlarge image
               else this.openProductFormToModify(prod)
               
               this.mouseMillis = 0
          },
          enlargeImage:function(ev){
               console.log('enlarging image', ev)
               const textDiv = ev.path[2]

               if (ev.srcElement.className==""){ 

                    ev.srcElement.className = 'large'
                    //textDiv.className = 'fadeAway'

               } else {
                    ev.srcElement.className ="" 
                    //textDiv.className = ""
               }

               
               
          },
          openProductForm:function(open){
               this.newProductForm = open

               if (open === false){
                    this.newProductPreview= false
                    this.newProductPreviewLastModified= null
                    this.newProductType= null
                    this.newProductName= null
                    this.newProductDescription= null
                    this.newProductDescriptionLong= null
                    this.newProductPrice= null

                    removeFormRatingChecked()

                    this.modifyingProduct= false
                    this.productModified= null
                    this.modifyingProduct = false;
               }
          },
          newProductSubmit: function($event){
               $event.preventDefault()
               
               if (!this.newProductPreview) 
                         return this.informUser(`picture of product is required`,2000)
               if (!this.newProductType || !this.newProductName ) 
                         return this.informUser(`product type and name are required`,3000)
               if (! document.querySelector('input[name="newRating"]:checked')) 
                         return this.informUser('select product rating',2500)


               const rating = document.querySelector('input[name="newRating"]:checked').value

               const fileName =`${window.localStorage.getItem('deviceUserEmail')
                               }_D${getFormattedDate(this.newProductPreviewLastModified)}`

               //console.log('submit', fileName)
               //console.log(this.newProductType, this.newProductName, this.newProductDescription, this.newProductPrice, rating)
               const fieldnames=['descr','descrLong','price'],
                     otherFields = [this.newProductDescription, this.newProductDescriptionLong, this.newProductPrice]

               const productToAdd = {
                    imgName: fileName,
                    type: this.newProductType,
                    name: this.newProductName,
                    rating
               }
               let voluntaryFields = otherFields.map(field=>{ 
                                             if (!!field && field.toString().trim()!=='') return field
                                             else return null 
               })
               
               voluntaryFields.forEach((field,i)=>{
                                   if (field) productToAdd[fieldnames[i]] = field.toString().trim()
               })
               console.log('product to add\n', productToAdd)

               const uploadToDBX = uploadImgToDropbox.bind(self),
                     addProduct = addNewLocationToDB.bind(this)

               if (navigator.onLine) // save image
                         uploadToDBX(fileName, window.toUploadToDropbox)
                         .then(link =>{
                                   
                                   console.log('link', link)
                                   productToAdd.dbxURL = link

                              return saveImageToIDB(fileName)
                         })
                         .then(result =>{
                              console.log('result 2', result)
                              window.toUploadToDropbox = undefined

                              if (result) return result
                         })
                         .then(y => addProduct('product', productToAdd) )
                         .then(()=>{
                              
                              this.newProductForm = false
                              this.newProductPreview = false
                              this.reloadView()
                         })
                         .catch(er=>alert('huge arror storing new product'))
               

               else saveImageToIDB(fileName)
               .then(()=>{
                    window.toUploadToDropbox = undefined
                    // create task to upload image when user is online
                    // return createUploadTaks
               })
               .then(()=> addProduct('product', productToAdd) )
               .then(()=>{

                    this.newProductForm = false
                    this.newProductPreview = false
                    return this.reloadView()
               })
               .catch(er => console.error('ERROR', er))

               

               
          },
          imageAdded:function(ev){

                    const reader = new FileReader(),
                         readBin = new FileReader(),
                         self = this,
                         file = ev.target.files[0]
                    
                    this.newProductPreviewLastModified = file.lastModified  // when storing pic to IDB, its part of filename
                    console.log(file)

                    reader.onload = function(fileObj){
                         let img = new Image()

                         //let data = fileObj.target.result
                         
                         img.onload = function(){

                              if (this.width>this.height) return alert(`take image with vertical orientation please`)

                              let fract = 10
                              let wid = 300     //parseInt(  this.width/fract),
                                  //,hei = 300  //parseInt(  this.height/fract)
                              

                              const canvas = document.querySelector('canvas'),
                                   ctx = canvas.getContext('2d'),
                                   start = Math.floor( (this.height-this.width)/2 )
                              canvas.width = wid
                              canvas.height = wid


                                             //  sX  sY     sW          sH                       
                              ctx.drawImage(this,0,  start, this.width, this.width,  0,0, wid, wid)

                              console.log(' canvas len', canvas.toDataURL().length/1024)
                              console.log('preview len',img.src.toString().length/1024)

                              self.newProductPreview = true

                              window.canvasData = canvas.toDataURL() // canvas data for new image to save to IDB

                              canvas.toBlob(function(blob){
                                   
                                   let reader = new FileReader()
                                   reader.onloadend = function(){
                                        console.log('binary result', reader.result)//, reader.result.substr(0,100) + '...')
                                        window.toUploadToDropbox = reader.result    // global var is used later to upload

                                        //const upload = uploadImgToDropbox.bind(self)

                                        //upload(undefined, reader.result,  ev.target.files[0], blob)//,
                                        //uploadImgToDropbox(undefined, reader.result)
                                   }
                                   reader.readAsArrayBuffer(blob)    //reader.readAsBinaryString(blob)
                              })
                         }
                         img.src = fileObj.target.result
                    }
                    
                    reader.readAsDataURL(ev.target.files[0])
                    //this.newProductForm = false
          },
          openProductFormToModify:function(prod){
               
               if (!prod.owner) return this.informUser(`You can only modify your own products`,1500)
               console.log('modify',prod)


               this.modifyingProduct = true // to show correct submit button
               this.productModified = prod

               if (prod.type) this.newProductType = prod.type
               if (prod.name) this.newProductName = prod.name
               if (prod.descr) this.newProductDescription = prod.descr
               if (prod.descrLong) this.newProductDescriptionLong =prod.descrLong
               if (prod.price) this.newProductPrice = parseFloat( prod.price )
               
               if (prod.rating) document.querySelector(`input[name="newRating"][value="${prod.rating}"]`).setAttribute('checked', true)
                    
               // just showing product's image
               if (prod.imgName) getImagesData([prod.imgName])   
               .then(data=>{
                    const self = this,
                          img = new Image(),
                          canv = document.querySelector('canvas'),
                          ctx = canv.getContext('2d')

                    img.onload = function(){
                         ctx.drawImage(this,0,0,300,300)
                         self.newProductPreview = true
                    }
                    img.src = data
               })
               this.newProductForm = true

          },
          applyProductChanges:function(ev){
               ev.preventDefault()
               console.log('prod change', this.productModified)

               
               getOwnIDBData(this.userName)
               .then(ownData=>{
                    //console.log('    ownData',ownData)
                    //console.log(this.productModified.imgName)

                    const search = findProductLocations(ownData, this.productModified.imgName)
                    const prod = search.product

                    //return console.log('locs of product', locations)

                    /*let country = ownData.find(country=>country.name == this.currentCountry)
                    let city = country.cities.find(city=> city.name == this.currentCity)
                    let shop = city.shops.find(shop=>shop.name== this.currentShop)
                    let prod = shop.products.find(prod=>prod.name === this.productModified.name)*/


                    for (let prop in prod){
                         if (prop!=='imgName' && prop!=='dbxURL') delete prod[prop]
                    }
               

                    if ( this.newProductType) prod.type = this.newProductType
                    if ( this.newProductName) prod.name = this.newProductName
                    if ( this.newProductDescription) prod.descr = this.newProductDescription
                    if ( this.newProductDescriptionLong)  prod.descrLong = this.newProductDescriptionLong
                    if ( this.newProductPrice) prod.price = parseFloat(this.newProductPrice)

                    prod.rating = document.querySelector('input[name="newRating"]:checked').value

                    //console.log('prod edited to:', prod)
                    console.log('upated cntries?\n', ownData)

                    updateDeviceUserCountries(this.userName, ownData)  // returns exact same countries object
                    .then(this.UIafterProductFormSubmitted)
               })
          },
          deleteProduct:function(ev){
               ev.preventDefault()

               if (confirm('Delete this product?')){
               
                    //console.log('delete', this.productModified)
                    if (!this.productModified.imgName) return this.informUser('cant delete this product', 2000)

                    
                    // using stored data, since displayed data has unnecessary temp info attached, this way it's easier
                    getOwnIDBData(this.userName)
                    .then(ownData=>{
                         console.log('    ownData',ownData)

                         const search = findProductLocations(ownData, this.productModified.imgName),     // find product among own prods
                              i = search.i

                         search.shop.products.splice(i,1)
                         //return console.log('    shop prods modified?', ownData)

                         deleteImageFromIDB(this.productModified.imgName)
                         .then(()=>updateDeviceUserCountries(this.userName, ownData))
                         .then(this.UIafterProductFormSubmitted)

                         if (this.productModified.imgName && navigator.onLine) 

                              deleteDropboxImg( localStorage.getItem('deviceUserEmail'), this.productModified.imgName)
                              .then(status=>this.informUser(`deleted Dropbox img: ${status}`, 3000))
                              
                              
                         else if (this.productModified.imgName && !navigator.onLine){

                              // create queue of files to get deleted from Dropbox
                         }
                         
                    })
               }
          },
          UIafterProductFormSubmitted:function(){
               this.modifyingProduct = false    // hides Modify and Delete buttons
               this.newProductPreview = false   // to hide canvas

               this.openProductForm(false) // to reset form
               this.reloadView()
               return this.switchScreen('main')
          },
          reloadView:function(){
                    console.log('RELOADING VIEW')

               let ownCountries,
                   othersCountriesWProds,
                   somethingChanged = false

               getOwnIDBData(this.userName)
               .then( ownData =>{

                    if (!this.userName || !this.followedUsers) return initializeLocationSelects(this, ownData)

                    //ownCountries = ownData
                    ownCountries = addOwner(ownData, this.userName)  // owner key serves later when allowing/blocking user to modify product
                    //console.log('countries w owner', ownCountries)     

                    return getOtherUsersIDBData(this.followedUsers)
               })
               .then(othersData=>{
                         
                    let own = [...ownCountries], 
                        Users = othersData.map(user=> user.countries )

                    othersCountriesWProds = JSON.parse(JSON.stringify(Users)) // it will be needed later in original state to show poducts
                         
                    //let woProducts = copyUserDataOrig.call(this, Users, own, 1) //return woProducts


                    // returns Countries with added new locations from others (w/o their prods)
                    // its needed when saving them to users IDB
                    return copyUserDataOrig.call(this, Users, own, 1)  
               })
               .then(result=>{
                    console.log('somethingChanged? ',result.somethingChanged)
                    console.log('reloading - location w/o prods to save', result.countries)

                         
                    if (result.somethingChanged===true) 
                         // save all locations without prods to device user IDB
                         // return updateDeviceUserCountries(this.userName, result.countries)
                              return result.countries
                    //     .then(initializeLocationSelects(this, result.countries))

                    else return result.countries
                              
               })
               .then(myresult=>{
                         
                         //console.log('my', myresult)
                         //console.log('others', othersCountriesWProds)
                         let copy = JSON.parse( JSON.stringify(othersCountriesWProds))

                         const withProducts = copyUserDataOrig.call(this, copy, myresult, 0)
                         console.log('withProducts for display', withProducts)

                         this.countries = withProducts.countries // update screen w new data available

                         initializeLocationSelects(this, withProducts.countries)
               })
               
          },
          startApp:function(){
               //this.screen = 'main'

               this.userName = getDeviceUser()
               //if (this.userName===null) this.userName = 'null'  // because of IDB so user can be found, it doesnt store null as value
               //console.log('userName', this.userName)
               
               if (this.userName) this.followedUsers = getLSfollowedUsers()
               else this.followedUsers = null
               console.log('followedUsers', this.followedUsers)
               
               let ownCountries
               let somethingChanged = false

               getOwnIDBData(this.userName)

               
               .then( ownData =>{  

                    if (!this.userName || !this.followedUsers) return initializeLocationSelects(this, ownData)

                    ownCountries = ownData

                    // try to get other's MDB data to update IDB
                    if (navigator.onLine){
                         const fetchedCountryData = this.followedUsers.map(fetchCountriesOfUser) // get new data for each user
                         //console.log('nav online - fetched', fetchedCountryData)

                         Promise.all(fetchedCountryData)
                         .then(userData=>{   // store new user data
                              console.log('nav online - fetched', fetchedCountryData)
                              const saved = userData.map(user=>setOtherUserIDBData(user))
                              
                              return Promise.all(saved)
                         })
                         
                         .then(saved=>{      // reloadView() is where new locations get copied to users countries

                              console.log('starting app - other users data', saved)
                              return this.reloadView()     //getOtherUsersIDBData(this.followedUsers)

                         })
                         .catch(er=>console.error('error in online branch',er))
                         

                         
                    } else {

                         console.log('|||  not online')
                    
                         //return getOtherUsersIDBData(this.followedUsers)  
                    }
               }).then(users=>{
                         
                    if (users){
                         console.log('my own', ownCountries)
                         
                         /*if (!users){   // this cant happen now
                              console.log('NO FOLLOWED USERS')
                              return initializeLocationSelects(this, ownCountries)
                         }*/

                         let 
                             own = [...ownCountries],
                             Users = users.map(user=>user.countries)

                         const copyFunc = copyUserDataOrig.bind(this)
                         console.log('|||  equal? ', copyFunc == copyUserDataOrig, copyFunc === copyUserDataOrig)
                         const copy = copyFunc.call(this, Users, own, 0)

                         // copies all others' locations to save them in IDB of device
                         //copyUserData(Users, own)
                         copy.then(final=>{
                                   console.log('somethingChanged? ',somethingChanged)
                                   if (somethingChanged) console.log('location data to save', final===own, final)

                                   // save each country without prods to device user IDB
                                   if (somethingChanged) {
                                        updateDeviceUserCountries(this.userName, final)   // store everything to deviceUser IDB
                                        .then(initializeLocationSelects(this, final))      // update screen w new data available

                                   } else return initializeLocationSelects(this, final)
                                   //final.forEach( country => deviceUserData.countries.put(country) )
                         })


                         /*function copyUserData(users, owndata){
                              //console.log('EQUAL', ownCountries == owndata)
                              
                              return new Promise((resolve, reject)=>{
                                   const sets = ['countries','cities','shops','products']
                                   let index = 0
                                   users.forEach(other_countries => {

                                             // remove products from each country
                                             const others_cleaned = other_countries.map( country => removeProducts(country,0))     

                                             copyEntries(index, owndata, others_cleaned)

                                             .then(newCountries=> resolve(newCountries) )  
                                   })

                                   function removeProducts(entry,index){
                                        //if (index>3) return;

                                        if (entry.hasOwnProperty('products')){
                                             //console.log('in SHOP', entry.name)
                                             return {name: entry.name, products: []} //entry.products = []

                                        } else if (entry.name){
                                             //console.log('|||| not shop', index, entry.name, sets[index])
                                             let name = entry.name
                                             let prop = sets[index+1]  // cities shops
                                             let y 
                                             entry[prop] = entry[prop].map(entry => {
                                                            //console.log('-- going into',entry.name, sets[index+1])
                                                            return removeProducts(entry, index+1)
                                                           })
                                             //console.log('filtered ',prop,'of',entry.name, entry[prop])
                                             return entry
                                        } 
                                   }
                                   function copyEntries(outerIndex, ownEntries, otherEntries){
                                        
                                        function emptyspace(ind){
                                                  let spaces = "", len = ind*5
                                                  for (let i=0; i<len; i++){
                                                       spaces = spaces.concat(" ")
                                                  }
                                                  return spaces
                                        }
                                        let index = outerIndex +1
                                        let set = sets[outerIndex], subset = sets[index]
                                        //console.log(emptyspace(outerIndex),'index', index, set, subset)
                                        // if its shops now

                                        return new Promise((resolve,rej)=>{
                                             otherEntries.forEach(other_entry=>{
                                                  
                                                  //console.log( emptyspace(outerIndex),`checking others '${other_entry.name}'`)

                                                  if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)=== false ) {
                                                       // not on device -> add it there
                                                       //console.log(emptyspace(outerIndex),set, 'NOT THERE -> ADDING ',other_entry.name )
                                                        //console.log(emptyspace(outerIndex),'- doing -', other_entry.name) 
                                                        //let locations = removeProducts( other_entry, index)
                                                        //console.log('without products',set, locations, subset)
                                                        //other_entry[subset] = location
                                                       ownEntries.push(other_entry)
                                                       somethingChanged = true
                                                        //console.log(other_entry.name,'updated?',other_entry)
                                                        //console.log( other_entry.name, 'updated?',locations )

                                                  // if this entry is already there
                                                  } else{
                                                       ownEntries.forEach( own_entry=>{
                                                            //console.log(emptyspace(outerIndex),'checking >>>',subset, 'of',own_entry.name, own_entry)
                                                            //console.log(emptyspace(outerIndex),set, 'is there checking >>>',own_entry.name, own_entry)
                                                            // take others subentries and add them to Own
                                                            if (own_entry.name === other_entry.name){
                                                                 //console.log(emptyspace(outerIndex),`duplicates ${own_entry.name} = ${other_entry.name}`)
                                                                 //console.log(emptyspace(outerIndex),index, 'subset',subset,'<<')
                                                                 if (index<3)//subset!==undefined) // if subset is undefined, can it even reach this deep? i.e. - if the condition neccessary
                                                                 copyEntries(index, own_entry[subset], other_entry[subset] )

                                                                 else if (subset===undefined) {
                                                                      
                                                                      //console.log(emptyspace(outerIndex),'??',own_entry)
                                                                      //let smt = removeProducts(own_entry,index)
                                                                      //console.log(emptyspace(outerIndex),'done ------- with', set)
                                                                 }
                                                            } //it gets added above
                                                       })
                                                  }
                                             })
                                             resolve(ownEntries)
                                        })
                                   }
                              })
                         }*/
                    }
               })
               .catch( er => {
                    
                    if (er===null){  //console.log('- - - will initialize Country data')
                         
                         storeInitialDBData(this.userName)
                         .then( data =>{
                              console.log('- - - stored?', data)
                              initializeLocationSelects(this, initalCountryData)
                              //this.startApp()
                         })

                    } else 
                         console.error('!!!!!  there was real error\n error getting init data',er)
               })
          
     
          }
     },
     mounted: function(){
          window.initializeLocationSelects = initializeLocationSelects.bind(this)  // its used on few occasions w different contexts
          
          this.startApp()

          // should unregistered user be able to upload pics to his dropbox?

          // check logged in user ('deviceUserEmail' is set?) and find out if he got new dropbox token
          // if yes, update his MDB token field
          checkDrBxToken()

          //window.addNewLocationToDB = addNewLocationToDB.bind(this)
          //console.log( window.addNewLocationToDB == addNewLocationToDB, addNewLocationToDB)

          
     },
     created:function(){
          //console.log('CREATED')
     }
})
let closTest = function(){ //console.log('hi,', somename)
}

const findProductLocations = (countries, imgName)=>{

     if (!imgName || imgName=='') return console.error('provide imgName')

     let countryName, cityName, shopName, shop, product, i

     countries.forEach(cntry=>
          cntry.cities.forEach(cty=>
               cty.shops.forEach(shp=>
                    shp.products.forEach((prod,index)=>{
                              if (prod.imgName && prod.imgName === imgName){

                                        countryName = cntry.name
                                        cityName = cty.name
                                        shopName = shp.name
                                        shop = shp
                                        product = prod
                                        i = index
                              }
                    })
               )
          )
     )

     return {countryName, cityName, shopName, shop, product, i}
}

const addOwner = (countries, nameToAdd) =>{

     countries.forEach(country=>
          country.cities.forEach(city=>
               city.shops.forEach(shop=>
                    shop.products.forEach(prod=>
                         prod.owner = nameToAdd
                    )
               )
          )
     )
     return countries
}

const copyUserDataOrig = (users, owndata, removeProds) => {
                              
          let somethingChanged = 0
          const sets = ['countries','cities','shops','products']
          let index = 0

          //console.log('removeProds?', removeProds)


          users.forEach(other_countries => {
     
                    let others_cleaned
                    if (removeProds) {
                         console.log('removing prods')
                         others_cleaned = other_countries.map( country => removeProducts(country,0))
                    } else {
                         console.log('keeping products')
                         others_cleaned = other_countries
                    }


                    copyEntries(index, owndata, others_cleaned)
          })
          
          
          return({ somethingChanged, countries: owndata})


          function copyEntries(outerIndex, ownEntries, otherEntries){
               
               let index = outerIndex +1
               let set = sets[outerIndex], subset = sets[index]

               otherEntries.forEach(other_entry=>{
                         //console.log( emptyspace(outerIndex),`checking others '${other_entry.name}'`)

                         if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)=== false ){
                         // it's not on device -> add it there
                              console.log(emptyspace(outerIndex),set, 'NOT THERE -> ADDING ',other_entry.name )
                              
                              ownEntries.push(other_entry)
                              somethingChanged = true
                              

                         // this entry is already there
                         } else ownEntries.forEach( own_entry=>{
                              //console.log(emptyspace(outerIndex),'checking >>>',subset, 'of',own_entry.name, own_entry)
                              //console.log(emptyspace(outerIndex),set, 'is there checking >>>',own_entry.name, own_entry)
                              // take others subentries and add them to Own
                              if (own_entry.name === other_entry.name){
                                   //console.log(emptyspace(outerIndex),`duplicates ${own_entry.name} = ${other_entry.name}`)
                                   //console.log(emptyspace(outerIndex),index, 'subset',subset,'<<')

                                        if (index< 3)  copyEntries( index, own_entry[subset], other_entry[subset] )

                                        else if (index===3 && !removeProds)
                                             copyEntries(index, own_entry[subset], other_entry[subset] )
                                   

                              } //it gets added above
                         })
                         
                         
               })
               return ownEntries
               
          }
          function removeProducts(entry,index){
               //if (index>3) return;

               if (entry.hasOwnProperty('products')){
                    //console.log('in SHOP', entry.name)
                    return {name: entry.name, products: []} //entry.products = []

               } else if (entry.name){
                    //console.log('|||| not shop', index, entry.name, sets[index])
                    let name = entry.name
                    let prop = sets[index+1]  // cities shops
                    let y 
                    entry[prop] = entry[prop].map(entry => {
                                   //console.log('-- going into',entry.name, sets[index+1])
                                   return removeProducts(entry, index+1)
                              })
                    //console.log('filtered ',prop,'of',entry.name, entry[prop])
                    return entry
               } 
          }
          function emptyspace(ind){
               let spaces = "", len = ind*5
               for (let i=0; i<len; i++){
                    spaces = spaces.concat(" ")
               }
               return spaces
          }
     
}

const getMyPic =()=>{
          let d2    = 'https://dl.dropboxusercontent.com/s/jl15lcir35926i5/okram%40protonmail.ch_D2018-01-12_T22-09-07.jpg' 
          let dbximg= 'https://www.dropbox.com/s/jl15lcir35926i5/okram%40protonmail.ch_D2018-01-12_T22-09-07.jpg'
          //  https://www.dropboxforum.com/t5/API-support/CORS-issue-when-trying-to-download-shared-file/td-p/82466/page/2

          //   https://dl.dropboxusercontent.com/s/1mzslkpuoilup3l/okram%40protonmail.ch_D2018-01-21_T17-42-18.jpg?dl=0
          
          const req1 = new Request(d2,{  // './test1.png'
               headers: new Headers({
                    //'Content-Type': 'image/png'
               }),
               method: 'GET'
               
               //body: JSON.stringify({ email, token })
          })
          var image = new Image(); //image.crossOrigin = "Anonymous"

          fetch(req1)
          .then(result=>{
               console.log('img result',result)
               return  result.blob()//result.arrayBuffer()//.blob()
               
               
          }).then(blob=>{
               console.log('res', blob)
               let r = new FileReader()
               r.onload = function(obj){
                    
                    
                    //let x = fin.replace('data:text/html', 'data:image/png')
                    image.src = obj.target.result //URL.createObjectURL(blob);
                    //document.body.appendChild(image);
               }
               r.readAsDataURL(blob)
               
               
               //const URL = window.URL || window.webkitURL;
               //console.log(URL)
               //image.src = URL.createObjectURL(blob);
          })
          
          /*let xhr = new XMLHttpRequest()
          if ("withCredentials" in xhr) { console.log('with creds') }
          xhr.onreadystatechange = function(){
               if (this.readyState == 4 && this.status == 200) {
                    console.log(this.response, this.responseText, this.responseType)

               } else console.log(this.status, this.response)
          }
          xhr.open('GET', CE + 'https://www.dropbox.com/s/jl15lcir35926i5/okram%40protonmail.ch_D2018-01-12_T22-09-07.jpg?dl=0', true)
          console.log(xhr)
          //xhr.send()*/
}
//getMyPic()

const deleteDropboxImg = (email, fileName)=>{

     return new Promise((resolve, reject)=>{
          if (!email || ! fileName) reject(null)

          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){
               if (this.readyState == 4 && this.status == 200) {

                    console.log('SUKCES deleting dbx image', this.response, this.responseText)
                    resolve(this.response)

               } else console.log('so?', this.status, this.responseText) //this.getAllResponseHeaders())
          }
          xhr.open('POST', serverURL + '/API/deleteDrbxImage' + `?email=${email}&fileName=${fileName}` , true)
          xhr.send()
     })
}


// set image property so its accessible publicly any time it ll be needed by others
const uploadImgToDropbox = function(newName='test', imgData, file, blobb){
     return new Promise((resolve, reject)=>{

          let fileName = newName// + new Date()
          //console.log(this.userName,'fileName', fileName, file, blobb)

          const email = localStorage.getItem('deviceUserEmail')
          const toSend = { email }//data: JSON.stringify(imgData)
          
          // https://stackoverflow.com/questions/9395911/send-a-file-as-multipart-through-xmlhttprequest
          // https://stackoverflow.com/questions/15001822/sending-large-image-data-over-http-in-node-js
          // https://stackoverflow.com/questions/5052165/streaming-an-octet-stream-from-request-to-s3-with-knox-on-node-js
          // https://stackoverflow.com/questions/3146483/html5-file-api-read-as-text-and-binary
          /*let fd = new FormData()
               fd.append('json', JSON.stringify(toSend))
               fd.append('imgData', imgData )  // stringify imgData didnt work
               //fd.append('blob', new Blob([ file ] ))
               fd.append('ffile',  file  )
               fd.append('blobb', blobb )
          */
          /*fetch(serverURL + '/API/postPicToDrbx' + '?' + 'name='+ this.userName,{
               method: 'POST',
               body: imgData
               })*/

               /*fd.append('json_data', JSON.stringify({a: 1, b: 2}))
               fd.append('binary_data', new Blob([binary.buffer])
          */

          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){
               if (this.readyState == 4 && this.status == 200) {

                    console.log('SUKCES uploading to dbx -link?', this.response)//, this.responseText)
                    //resolve(this.status)
                    resolve(this.response)

               } else console.log('so?', this.status, this.responseText) //this.getAllResponseHeaders())
          }
          xhr.open('POST', serverURL + '/API/postPicToDrbx' + `?email=${email}&fileName=${fileName}` , true)
          xhr.send(imgData)
          // 
          //
          //xhr.send(fd) // imgData
          
               /*let params = {
                    "path": fileName,
                    "mode": "add"
               }  // "autorename": true, "mute": false
               params = JSON.stringify(params)  

               let bearer = "Bearer " + window.accessToken
               bearer = JSON.stringify(bearer)
               console.log('bearer', bearer)
               
               xhr.open('POST','https://content.dropboxapi.com/2/files/upload', true)
               xhr.setRequestHeader("Authorization", bearer)
               xhr.setRequestHeader("Dropbox-API-Arg", params)
               xhr.setRequestHeader('Content_Type','application/octet-stream')

               //xhr.setRequestHeader("Authorization", "Bearer qAZQ0ocdGioAAAAAAAACt4axxwChUOZ5U2XLXB1hvSzxXai4btwbq7O3LjzMst5c")
               //xhr.setRequestHeader("Dropbox-API-Arg", obj)
               //xhr.responseType = 'blob';
               //xhr.send()
               
               
          xhr.send(imgData)*/
          // later set images to be accessible from dropbox publicly?
     })
}


function getImagesData(names){

     //console.log('getting img data', names)

     const promises = names.map(name=>
          new Promise((resolve, reject)=>
               
               picturesDB.item.get({fileName:name})

               .then(result=>{ resolve(result.data) })
               .catch(er=>{ resolve(null) })

          )
     )
     return Promise.all(promises)
}

function addNewLocationToDB(set, toAdd){
     console.log('adding', set, this.userName)
     //return console.log('this', this)
     getOwnIDBData(this.userName)
     .then( ownCountries =>{
          if (set!=='product') toAdd = toAdd.toString()

          let somethingChanged = '333' //false
          const copyData = new Function('users', 'owndata', copyUserData_text)
          const self = this
          
          let toSave, lastLocs = []

          if (set =='country'){
                         
                         //let index = this.countries.findIndex(country=>country.name == toAdd)
                         let index = ownCountries.findIndex(country=>country.name == toAdd)

                         if (index>-1) { return self.informUser(`'${toAdd}' is already in your database`) }

                         const newCountry = 
                                   [{   name: toAdd, 
                                        cities: [{
                                             name: 'all cities', 
                                             shops:[{
                                                  name: 'all shops',
                                                  products: []
                                             }]
                                        }]
                                   }]
                         
                         toSave = [newCountry]
                         lastLocs.push({key: 'countries', value: toAdd})
                         lastLocs.push({key: 'cities', value: 'all cities'})
                         lastLocs.push({key: 'shops',  value: 'all shops'})

          } else if (set =='city') { console.log(`this happens 1`)

                    //let countryData = this.countries.find(cntry=> cntry.name == this.currentCountry)
                    let countryData = ownCountries.find(cntry=> cntry.name == this.currentCountry)
                    
                    // check if this city is already there
                    let index = countryData.cities.findIndex(city=>city.name == toAdd)

                    if (index>-1){ return alert(`'${toAdd}' is already in your database`) }
                    

                    countryData.cities.push({
                                        name: toAdd, 
                                        shops:[{
                                             name: 'all shops',
                                             products: []
                                        }]
                    })
                    console.log( '   adding city',"\n",countryData)
                    console.log( '   original',"\n",ownCountries)

                    toSave = [[countryData]]

                    lastLocs.push({key: 'cities', value: toAdd})
                    lastLocs.push({key: 'shops', value: 'all shops'})

          } else if (set =='shop') {  console.log(`this happens 1`)

               //let countryData = this.countries.find(cntry=> cntry.name ===this.currentCountry)
               let countryData = ownCountries.find(cntry=> cntry.name ===this.currentCountry)
               
               let cityData = countryData.cities.find(city=> city.name === this.currentCity)
               console.log( '   adding shop ', toAdd, 'to', cityData.name)

               // check its not there already
               if (cityData.shops.findIndex(shop=>shop.name===toAdd) > -1)
                         return alert(`'${toAdd}' is already in your database`)
               

               cityData.shops.push(
                                        {
                                        name: toAdd,
                                        products: []
                                        }
                                   )

               console.log('   new entry now', this.currentCountry, countryData)
               
               toSave = [[countryData]]
               lastLocs.push({key:'shops', value: toAdd})
               
          } else if (set=='product'){
               //let countryData = this.countries.find(cntry=> cntry.name=== this.currentCountry)
               let countryData = ownCountries.find(cntry=> cntry.name=== this.currentCountry)
               let cityData = countryData.cities.find(city=> city.name === this.currentCity)
               let shopData = cityData.shops.find(shop=> shop.name=== this.currentShop)

               shopData.products.push(toAdd)
               console.log('shopData', shopData)
               console.log('countryData', countryData)
               toSave = [[countryData]]
          }
          
          // 

          //copyData( toSave, [...this.countries] )
          copyData( toSave, [...ownCountries] )
          .then(final=>{
                    console.log('location data to save', final===this.countries, final)


                    lastLocs.forEach(item=>setLastSelection(item.key, item.value))

                    return updateDeviceUserCountries(this.userName, final)
                              
          }).then(result=>{
                    console.log('result', result)
                    return initializeLocationSelects(this, result)
          })
          .catch(er=>{
               alert('add Loc to DB er' + er)
          })


          return this.switchScreen('main')
     })
}


const sendCountryDataOfUser = userObj =>

     new Promise((resolve, reject)=>{

          getOwnIDBData(userObj.userName)
          .then(countries=>{
               console.log(`data of - ${userObj.userName} - to be pushed to MDB`, countries)

               const request = new Request(serverURL + 'API/pushCountriesOfUser',{
                    headers: new Headers({
                         'Content-Type': 'application/json'
                    }),
                    method: 'POST',
                    mode:'no-cors',
                    body: JSON.stringify({
                         email: userObj.email,
                         countries
                    })
               })
     

               fetch(request).then(result =>{
                    console.log('result ',result)
                    resolve(null)
               })


          }).catch(er=>{
               console.error(er)
               reject(er)
          })
     })



function fetchCountriesOfUser(user){

     return new Promise((resolve, reject)=>{
          console.log(`geeting data of ${user.email}`)

          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){
               if (this.readyState == 4 && this.status == 200) {     // console.log(this.status,'received',typeof this.responseText)

                         const result = JSON.parse(this.responseText)
                         result.userName = user.userName

                         //console.log('   got user data from server',result.email, result)
                         resolve(result)

               } else if (this.readyState == 4 && this.status!=200) reject()
          }
          xhr.open('POST',serverURL + 'API/getCountriesOfUser',true)
          xhr.send(user.email)
     })
}

function setOtherUserIDBData(allData){
     console.log('allData to put to IDB >', allData)
     return new Promise((resolve, reject)=>{

          users_followed.userData.put(allData)
          .then(result=>{
               //console.log(result)  // this returns primary key i.e. email
               resolve()
          }).catch(er=>{
               console.error(er)
               reject()
          })
     })
}


function setLastSelection(set, value){
     //console.log('>> saving', set, value)
     window.localStorage.setItem(set, value.toString() )
}
function getLastSelection(set){
     
     let val = window.localStorage.getItem(set)
     //console.log('requested', set, val)
     return val
}



function getLSfollowedUsers(){
     let users = window.localStorage.getItem('followedUsers')
     users = JSON.parse(users)
     return users
}
function addUserToDeviceLS(newUser){

     let users = window.localStorage.getItem('followedUsers')
     users = JSON.parse(users)

     if (users===null) users = [newUser]
     else if (users.some(user=>user.email==newUser.email)===false) users.push(newUser) // add new user only if he isnt there yet

     console.log('LS users now', users)

     return window.localStorage.setItem('followedUsers', JSON.stringify(users))
}


function updateDeviceUser(name = 0){
     //if ( window.localStorage.getItem('deviceUser') === null){
          name = name.toString().trim()

          const initialData = {
               userName: name, 
               createdDate: getFormattedDate(null)
          } 
          window.localStorage.setItem('deviceUser', JSON.stringify(initialData)) 
     //}
     console.log('created user', window.localStorage.getItem('deviceUser') )
}

function getDeviceUser(){

          let data = JSON.parse(window.localStorage.getItem('deviceUser'))
          if (data) return data.userName
          else return undefined
}

function getOwnIDBData(user = 0){
     console.log(`getting data of ${user}`)

     return new Promise((resolve, reject)=>{

          //console.log('test1',deviceUserData.userData.userName)

          /*if (deviceUserData.userData===undefined) {
               console.log('!! 1st condition')
               return reject(null)
          }*/

          deviceUserData.userData.get({userName:user})//.toArray()   // https://dexie.org/docs/Table/Table.get()
          .then(data => {
               if (data==undefined) {
                    console.log('no data, probably initializing app?')
                    return reject(null)
               } 

               const res = data.countries
               
               if (Array.isArray(res)) resolve(res)

               else if (res.hasOwnProperty('name')){
                    console.log('got only initial data')
                    resolve([res])
               }
          })
          .catch(er => {
               console.log('||||||||||  er',er)
               reject(er) 
          })
     })
}

function storeInitialDBData(userName = 0){
     console.log(`storing data for ${userName}`)
     return new Promise((resolve, reject)=>{
          //console.log(window.deviceUserData.userData)
          
          deviceUserData.userData.put({userName, countries: initalCountryData})

          .then(all=>{
                    console.log('stored initial data:', all,"<<")
                    resolve(all)
          })                         
          .catch(er=>{
               console.error(er);
               reject(er)
          })
     })
}

function getOtherUsersIDBData(localUsers){
     //console.log('    localUsers', localUsers)

     return new Promise((resolve,rej)=>{
          if (!localUsers || localUsers.length==0) return resolve(null)

          users_followed.userData.toArray()
          .then(users =>{ 
               
               users = users.filter(user=> localUsers.find(lUser=>lUser.email==user.email)!==undefined )
               console.log('|||     filtered users',users)

               if (users.length==0) resolve(null)     // when can this happen?
               else resolve(users)

          })
          .catch(er=>console.error('error opening following', er))
     })
}


function initializeLocationSelects(self, countries){
     console.log('initializing countries\n')

     self.countries = countries
     self.currentCountry = getLastSelection('countries') || 'all countries'
     
     
     let lastCntry = countries.find(cn=>cn.name=== self.currentCountry)
     self.cities = lastCntry.cities

     // city
     self.currentCity = getLastSelection('cities') || 'all cities' 
     let lastCity = self.cities.find(city => city.name ==  self.currentCity)

     // shop
     self.shops = lastCity.shops
     self.currentShop =  getLastSelection('shops')  || 'all shops'


     // 2 stands for 'shop/s' in array, null for event, currentShop = requested shop name
     //let somevar = self.updateLocationSelect(2, null, self.currentShop)

}



function copyUserData(users, owndata){
     console.log('EQUAL', users, owndata)
     //console.log('copying', somethingChanged)//users, owndata)
     
     return new Promise((resolve, reject)=>{
          const sets = ['countries','cities','shops','products']
          let index = 0
          users.forEach(other_countries => {

                    // remove products from each country
                    const others_cleaned = other_countries.map( country => removeProducts(country,0))     

                    copyEntries(index, owndata, others_cleaned)

                    .then(newCountries=> resolve(newCountries) )  
          })

          function removeProducts(entry,index){
               //if (index>3) return;

               if (entry.hasOwnProperty('products')){
                    //console.log('in SHOP', entry.name)
                    return {name: entry.name, products: []} //entry.products = []

               } else if (entry.name){
                    //console.log('|||| not shop', index, entry.name, sets[index])
                    let name = entry.name
                    let prop = sets[index+1]  // cities shops
                    let y 
                    entry[prop] = entry[prop].map(entry => {
                                   //console.log('-- going into',entry.name, sets[index+1])
                                   return removeProducts(entry, index+1)
                                  })
                    //console.log('filtered ',prop,'of',entry.name, entry[prop])
                    return entry
               } 
          }
          function copyEntries(outerIndex, ownEntries, otherEntries){
               
               function emptyspace(ind){
                         let spaces = "", len = ind*5
                         for (let i=0; i<len; i++){
                              spaces = spaces.concat(" ")
                         }
                         return spaces
               }
               let index = outerIndex +1
               let set = sets[outerIndex], subset = sets[index]
               //console.log(emptyspace(outerIndex),'index', index, set, subset)
               // if its shops now

               return new Promise((resolve,rej)=>{
                    otherEntries.forEach(other_entry=>{
                         
                         //console.log( emptyspace(outerIndex),`checking others '${other_entry.name}'`)

                         if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)=== false ) {
                              // not on device -> add it there
                              //console.log(emptyspace(outerIndex),set, 'NOT THERE -> ADDING ',other_entry.name )
                               //console.log(emptyspace(outerIndex),'- doing -', other_entry.name) 
                               //let locations = removeProducts( other_entry, index)
                               //console.log('without products',set, locations, subset)
                               //other_entry[subset] = location
                              ownEntries.push(other_entry)
                              somethingChanged = true
                               //console.log(other_entry.name,'updated?',other_entry)
                               //console.log( other_entry.name, 'updated?',locations )

                         // if this entry is already there
                         } else{
                              ownEntries.forEach( own_entry=>{
                                   //console.log(emptyspace(outerIndex),'checking >>>',subset, 'of',own_entry.name, own_entry)
                                   //console.log(emptyspace(outerIndex),set, 'is there checking >>>',own_entry.name, own_entry)
                                   // take others subentries and add them to Own
                                   if (own_entry.name === other_entry.name){
                                        //console.log(emptyspace(outerIndex),`duplicates ${own_entry.name} = ${other_entry.name}`)
                                        //console.log(emptyspace(outerIndex),index, 'subset',subset,'<<')
                                        if (index<3)//subset!==undefined) // if subset is undefined, can it even reach this deep? i.e. - if the condition neccessary
                                        copyEntries(index, own_entry[subset], other_entry[subset] )

                                        else if (subset===undefined) {
                                             
                                             //console.log(emptyspace(outerIndex),'??',own_entry)
                                             //let smt = removeProducts(own_entry,index)
                                             //console.log(emptyspace(outerIndex),'done ------- with', set)
                                        }
                                   } //it gets added above
                              })
                         }
                    })
                    resolve(ownEntries)
               })
          }
     })
}


function updateDeviceUserCountries(userName=0, countries){
     console.log(`save to user: ${userName} ${countries}`)
     let obj = { userName, countries }
     //console.log(obj)
     return new Promise((resolve, reject)=>{

          deviceUserData.userData.put({ userName, countries })
          .then(result=>{
               console.log(result)
               resolve(countries)

          }).catch(er=>{})
     })
}
const copyUserData_text = `
     console.log('newdata, owndata', users, owndata)
     //console.log('copying', somethingChanged)//users, owndata)

     return new Promise((resolve, reject)=>{
          const sets = ['countries','cities','shops','products']
          let index = 0
          users.forEach(other_countries => {
                    console.log(other_countries)
                    // remove products from each country  
                    // not if its used to store new location
                    //const others_cleaned = other_countries//.map( country => removeProducts(country,0))     

                    copyEntries(index, owndata, other_countries)//others_cleaned)

                    .then(newCountries=> resolve(newCountries) )  
          })

          function removeProducts(entry,index){
               //if (index>3) return;

               if (entry.hasOwnProperty('products')){
                    //console.log('in SHOP', entry.name)
                    return {name: entry.name, products: []} //entry.products = []

               } else if (entry.name){
                    //console.log('|||| not shop', index, entry.name, sets[index])
                    let name = entry.name
                    let prop = sets[index+1]  // cities shops
                    let y 
                    entry[prop] = entry[prop].map(entry => {
                                   //console.log('-- going into',entry.name, sets[index+1])
                                   return removeProducts(entry, index+1)
                              })
                    //console.log('filtered ',prop,'of',entry.name, entry[prop])
                    return entry
               } 
          }
          function copyEntries(outerIndex, ownEntries, otherEntries){
               
               function emptyspace(ind){
                         let spaces = "", len = ind*5
                         for (let i=0; i<len; i++){
                              spaces = spaces.concat(" ")
                         }
                         return spaces
               }
               let index = outerIndex +1
               let set = sets[outerIndex], subset = sets[index]
               //console.log(emptyspace(outerIndex),'index', index, set, subset)
               // if its shops now

               return new Promise((resolve,rej)=>{
                    otherEntries.forEach(other_entry=>{
                         
                         if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)=== false ) {
                              // not on device -> add it there
                              console.log(emptyspace(outerIndex),set, 'NOT THERE -> ADDING ',other_entry.name )
                              //console.log(emptyspace(outerIndex),'- doing -', other_entry.name) 
                              //let locations = removeProducts( other_entry, index)
                              //console.log('without products',set, locations, subset)
                              //other_entry[subset] = location
                              ownEntries.push(other_entry)
                              //console.log(somethingChanged)
                              //if (somethingChanged!=undefined) somethingChanged = true
                              //console.log(other_entry.name,'updated?',other_entry)
                              //console.log( other_entry.name, 'updated?',locations )

                         // if this entry is already there
                         } else{
                              ownEntries.forEach( own_entry=>{
                                   //console.log(emptyspace(outerIndex),'checking >>>',subset, 'of',own_entry.name, own_entry)
                                   //console.log(emptyspace(outerIndex),set, 'is there checking >>>',own_entry.name, own_entry)
                                   // take others subentries and add them to Own
                                   if (own_entry.name === other_entry.name){
                                        //console.log(emptyspace(outerIndex),index, 'subset',subset,'<<')
                                        if (index<3)//subset!==undefined) // if subset is undefined, can it even reach this deep? i.e. - if the condition neccessary
                                        copyEntries(index, own_entry[subset], other_entry[subset] )

                                        else if (subset===undefined) {
                                             
                                             //console.log(emptyspace(outerIndex),'??',own_entry)
                                             //let smt = removeProducts(own_entry,index)
                                             //console.log(emptyspace(outerIndex),'done ------- with', set)
                                        }
                                   } //it gets added above
                              })
                         }
                    })
                    resolve(ownEntries)
               })
          }
     })`
//



function saveImageToIDB(fileName){
     console.log(getDeviceUser(), fileName)

     return new Promise((resolve, reject)=>{
          if (!fileName || !window.canvasData) reject(null)
          let user = getDeviceUser()
                  //{data: fileName, userName,                  data
          picturesDB.item.put({ 'fileName': fileName, 'userName': user, 'data': window.canvasData })
          .then(result=>{
               console.log('result',result)
               resolve(result)
          })
          .catch(er=>{console.error(er)})
     })
}


function deleteImageFromIDB(fileName){
     //console.log(fileName, picturesDB.item)
     return new Promise((resolve, reject)=>{
          

          picturesDB.item.where('fileName').equals(fileName).delete()
          .then(something=>{

               console.log('deleted?',something)
               resolve(something)
          })
          .catch(er=>console.error(er))        
     })

}


function removeFormRatingChecked(){
     const radios = document.querySelectorAll('input[type="radio"][name="newRating"]')
     radios.forEach(radio=>radio.removeAttribute('checked') )
}
function nodeListToArray(list){
     console.log(list)
     let result = []
     for (let item of list) result.push(item)
     
     return result
}
function getFormattedDate(date){
     //console.log('typeof Date',typeof date, date)
 
     if (typeof date == 'number') date = new Date(date)
     else if (!date) date = new Date()
 
     let year = date.getFullYear(),
         month = date.getMonth()+1,
         day = date.getDate(),
         hours = date.getHours(),
         minutes = date.getMinutes(),
         secs = date.getSeconds()

     const obj = {
          year, month, day, hours, minutes, secs
     }

     for (let num in obj){
          if (obj[num]<10) obj[num] =  String('0' + obj[num] ) 
     }

     return `${obj.year}-${obj.month}-${obj.day}_T${obj.hours}-${obj.minutes}-${obj.secs}`
}


const getPicURL = function(entry){

     return new Promise((resolve, reject)=>{

          let obj = {"path": entry.path_display }
          obj = JSON.stringify( entry) 
          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){

               if (this.readyState == 4 && this.status == 200) {

                         console.log('SUKCES', this.status)//this.response, this.responseText)
                         resolve(this.responseText)

               } else console.log(this.status)
          }
          xhr.open('POST', serverURL + '/API/getPicURL', true)
          xhr.send(obj)
     })
}







/*let somelet = 44
const funText = 'console.log("hi " + somelet)'
function fun(){

     let somelet = 33
     let f2 = new Function(funText) 
     let f3 = function(){
          let somelet = 33
          let f4 = new Function(funText) 
          return f4()
     }
     console.log(f3)
     //hi = function(){ console.log('oh ' + somelet)} 
     return f3()    //hi()
}*/
//fun()





/* templating attempt
//import App from './templ1.Vue'
//const tem1 = require('./templ1.Vue')
//console.log(tem1)

let templ1 = new Vue({
     el: '#templ1',
     data: {
          msg: 'hoho'
     }
     //render: h => h(App)
})

let productTemplate = Vue.component('product',{
     data:{
          pname: 'jezisek'
     },
     props:{
          pname: 'jezisek'
     },
     created:function(){
          this.pname = 'babuska'
     },
     mounted:function(){
          this.pname = 'babuska'
     },
     render:function(createElement){
          return createElement(
               'p',
               `omg product ${this.pname} `
               //this.$slots.default
          )
     }
})*/