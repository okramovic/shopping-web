/**
 *        simple state management http://vuetips.com/simple-state-management-vue-stash
 * 
 */


// for each product do display in DOM, use Component or template



'use strict'

//const Dexie = require('./vendor/Dexie.2.0.1.js'),
//      Vue = require('./vendor/Vue.2.5.13.js')

//import {addLocationToDB2} from './copy.js';


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
      
const serverURL = 'https://shopp.glitch.me/'



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

          newProductForm: false,
          newProductPreview: false,
          newProductPreviewLastModified: null,
          newProductType: null,
          newProductName: null,
          newProductDescription: null,
          newProductDescriptionLong: null,
          newProductPrice: null,

          modifyingProduct: false
     },
     methods:{
          switchScreen:function(screen){
               this.screen = screen

               if (screen =='main'){
                    this.locationInputShown = false
                    this.locationSet = null
                    this.newLocation = null
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
                         
                         return self.startApp() //self.reloadView()

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

                              return self.startApp()  // self.reloadView()

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
               return this.startApp() // this.reloadView()//
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
          informUser: function(msg){
               this.console = msg

               setTimeout(()=>{
                    this.console = undefined
               },5000)
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
                         .then(self.reloadView)                    // here it copies data(countries etc) to device users

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
               console.log(`new ${this.locationSet} is ${this.newLocation}`)
               if (!this.newLocation) return alert('no name?');

               const addLocation = addNewLocationToDB.bind(this)
               return addLocation(this.locationSet, this.newLocation.toString() )
               //return addNewLocationToDB(this.locationSet, this.newLocation)
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
                    .then(userOwnProducts =>{
                         // save last locations to local storage rather here?
                         console.log('----- user own products:', userOwnProducts.length, userOwnProducts)

                         userOwnProducts = userOwnProducts.map(prod=>{prod.owner = this.userName || 0; return prod})
                         // get products from each user in IDB: for current city, shop etc
                         getOtherUsersIDBData(this.followedUsers)
                         .then(users=>{
                              console.log('users to add products from', users)

                              let finals = []
                              if (userOwnProducts.length>0) 
                                   finals = [...userOwnProducts]

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
                              
                              return new Promise((resolve, reject)=>{
                                   // display products on screen
                                   resolve (this.currentDisplayedProducts = finals ) //[...finals]

                                   // check out vue cheatsheet (v-bind) to see how to attach classes
                              })
                               
                         })
                         .then(finals=>{
                              console.log('finals2', finals.length)

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

                    //console.log('getting items of', name)
                    //console.log('continue -- outerIndex, name',outerIndex, name)
                    return new Promise((resolve, rej)=>{
                         // 0 1 2
                         const currentX = currents[outerIndex]  // 'currentCountry' 'currentCity' 'currentShop'
                         const index = outerIndex,
                               superSet = selects[index-1], // 'countries' 'cities' 'shops'
                               set      = selects[index],   // 'countries' 'cities' 'shops'
                               subSet   = selects[index+1]  // 'countries' 'cities' 'shops'
                               
                         //console.log('self[currentX]', currentX, self[currentX])
                         //console.log('set', set)

                         //const name = event.srcElement.selectedOptions[0].text
                         if (set == 'products'){
                              //console.log('products', subSet, a.name, a[subSet], a.products)
                              //console.log('PRODUCTS!!!  ', a.products)
                              //resolve( getSubsetItems(self, outerIndex + 1, 'products') )
                              return alert('oops')
                         }

                         let a = self[set].find(el=> el.name===name )
                         
                         

                         self[currentX] = name
                         console.log('current',currentX, name)
                         //console.log('    save ?', set, name)
                         setLastSelection(set, name)

                         self[subSet] = a[subSet]
                         //console.log('subSet', subSet)
                         
                         //console.log('---',currents[outerIndex+1])
                         if (currents[outerIndex+1]=== undefined) {
                              //console.log('products?', a.name, a[subSet])
                              resolve(a[subSet]) 
                              //return
                         }
                         else {
                              let string = currents[outerIndex+1].toString()
                              self[string]= a[subSet][0].name    // 'currentCountry' 'currentCity' 'currentShop'
                              
                              //console.log('[subSet]', self[subSet][0])  // name of default item to set
                              
                              resolve(
                                   getSubsetItems(self, outerIndex + 1, a[subSet][0].name)          
                              )
                         }
                    })
               }
          },
          openNewProductForm:function(open){
               this.newProductForm = open
          },
          newProductSubmit: function($event){
               $event.preventDefault()
               
               if (!this.newProductPreview) return this.informUser(`picture of product is required`)
               //const form = document.querySelector('form[name="newProductForm"')
               const rating = document.querySelector('input[name="newRating"]:checked').value

               const fileName =`${window.localStorage.getItem('deviceUserEmail')
                               }_D${getFormattedDate(this.newProductPreviewLastModified)}`.toString()

               console.log('submit', fileName)
               console.log(this.newProductType, this.newProductName, this.newProductDescription, this.newProductPrice, rating)
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

               // save image
               saveImageToIDB(fileName)
               .then(x=>{
                    console.log('result 2', x)
                    if (x) return x
               })
               .then(y=>{
                    addProduct('product', productToAdd)
                    this.newProductForm = false
                    this.newProductPreview = false

               }).catch(er=>alert('huge arror storing new product'))
               
               const addProduct = addNewLocationToDB.bind(this)

               
          },
          imageAdded:function(ev){

                    const reader = new FileReader(),
                         self = this,
                         file = ev.target.files[0]
                    
                    this.newProductPreviewLastModified = file.lastModified  // when storing pic to IDB, its part of filename
                    console.log(file)

                    reader.onload = function(fileObj){
                         let img = new Image()

                         //let data = fileObj.target.result
                         
                         img.onload = function(y){

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

                              //let w = window.open()
                              //w.document.write(`<img src="${canvas.toDataURL()}" >`)
                         }
                         img.src = fileObj.target.result
                         
                    }
                    
                    reader.readAsDataURL(ev.target.files[0])
                    //this.newProductForm = false
          },
          openProductForm:function(prod){
               console.log('modify',prod)
               if (!prod.owner) return alert(`You can only modify your own products`)

               // let currCountry = this.currentCountry, etc...
               //   get curr Country, City & Shop so if user would change them w form open,
               //   take it as indication he wants to place product 
               //   to new current country city shop

               this.modifyingProduct = true // to show correct submit button

               if (prod.type) this.newProductType = prod.type
               if (prod.name) this.newProductName = prod.name
               if (prod.descr) this.newProductDescription = prod.descr
               if (prod.descrLong) this.newProductDescriptionLong =prod.descrLong
               if (prod.price) this.newProductPrice = parseFloat( prod.price )
               
               if (prod.rating) document.querySelectorAll(`input[type="radio"][value="${prod.rating}"]`)[0].setAttribute('checked', true)
               

               if (prod.imgName) 
               
               getImagesData([prod.imgName])
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
               this.newProductForm =true

          },
          applyProductChanges:function(ev){
               ev.preventDefault()
               console.log('prod change')
          },
          deleteProduct:function(ev){
               ev.preventDefault()
               console.log('delete')
          },
          reloadView:function(){
                    console.log('RELOADING VIEW')

                    let ownCountries,
                        somethingChanged = false

                    getOwnDBData(this.userName)
                    .then( ownData =>{

                         if (!this.userName || !this.followedUsers) return initializeLocationSelects(this, ownData)

                         ownCountries = ownData

                         return getOtherUsersIDBData(this.followedUsers)
                    })
                    .then(othersData=>{

                         let own = [...ownCountries],
                             Users = othersData.map(user=>user.countries)

                         return copyUserData(Users, own)

                         function copyUserData(users, owndata){
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
                         }
                    })
                    .then(final=>{
                         console.log('somethingChanged? ',somethingChanged)
                         //if (somethingChanged) 
                         console.log('location data to save', final) //  , final===own

                         // save each country without prods to device user IDB
                         if (somethingChanged) {
                              updateDeviceUserCountries(this.userName, final)   // store everything to deviceUser IDB
                              .then(initializeLocationSelects(this, final))      // update screen w new data available

                         } else return initializeLocationSelects(this, final)
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

               getOwnDBData(this.userName)

               // try to get other's MDB data to update IDB
               .then( ownData =>{  

                    if (!this.userName || !this.followedUsers) return initializeLocationSelects(this, ownData)

                    ownCountries = ownData

                    
                    if (navigator.onLine){
                         const fetchedData = this.followedUsers.map(fetchCountriesOfUser) // get new data for each user
                         //console.log('nav online - fetched', fetchedData)

                         Promise.all(fetchedData)
                         .then(userData=>{   // store new user data
                              console.log('nav online - fetched', fetchedData)
                              const saved = userData.map(user=>setOtherUserIDBData(user))
                              
                              return Promise.all(saved)
                         })
                         
                         .then(saved=>{      // reload view where new locations get copied to users countries

                              console.log('saved? other users data', saved)
                              //return 
                              this.reloadView()//getOtherUsersIDBData(this.followedUsers)

                         })
                         .catch(er=>console.error('error in online branch',er))
                         

                         
                    } else {

                         console.log('|||  not online')
                    
                         return getOtherUsersIDBData(this.followedUsers)  
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


                         // copies all others' locations to save them in IDB of device
                         copyUserData(Users, own)
                         .then(final=>{
                                   console.log('somethingChanged? ',somethingChanged)
                                   if (somethingChanged) console.log('location data to save', final===own, final)

                                   // save each country without prods to device user IDB
                                   if (somethingChanged) {
                                        updateDeviceUserCountries(this.userName, final)   // store everything to deviceUser IDB
                                        .then(initializeLocationSelects(this, final))      // update screen w new data available

                                   } else return initializeLocationSelects(this, final)
                                   //final.forEach( country => deviceUserData.countries.put(country) )
                         })


                         function copyUserData(users, owndata){
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
                         }
                    }
               })
               //})
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
          
          //window.addNewLocationToDB = addNewLocationToDB.bind(this)
          //console.log( window.addNewLocationToDB == addNewLocationToDB, addNewLocationToDB)

          this.startApp()
     },
     created:function(){
          //console.log('CREATED')
     }
})

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
     console.log('add', set)
     //return console.log('this', this)
     //   under what country to add it
     //   should i update whole country document?
     
     let somethingChanged = '333' //false
     const copyData = new Function('users', 'owndata', copyUserData_text)
     const self = this
     
     let toSave

     if (set =='country'){
                    console.log(`this happens 1`)
                    let index = this.countries.findIndex(country=>country.name == toAdd)

                    if (index>-1) { return alert(`'${toAdd}' is already in your database`) }

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
                    

     } else if (set =='city') { console.log(`this happens 1`)

               let countryData = this.countries.find(cntry=> cntry.name == this.currentCountry)
               
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
               console.log( '   original',"\n",this.countries)

               toSave = [[countryData]]

     } else if (set =='shop') {  console.log(`this happens 1`)

          let countryData = this.countries.find(cntry=> cntry.name ===this.currentCountry)
          
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
          
     } else if (set=='product'){
          let countryData = this.countries.find(cntry=> cntry.name=== this.currentCountry)
          let cityData = countryData.cities.find(city=> city.name === this.currentCity)
          let shopData = cityData.shops.find(shop=> shop.name=== this.currentShop)

          shopData.products.push(toAdd)
          console.log('shopData', shopData)
          console.log('countryData', countryData)
          toSave = [[countryData]]
     }
     

     copyData( toSave, [...this.countries] )

     .then(final=>{
               console.log('location data to save', final===this.countries, final)

               return updateDeviceUserCountries(this.userName, final)
                         
     }).then(result=>{
               console.log('result', result)
               return initializeLocationSelects(this, result)
     })
     .catch(er=>{alert('add Loc to DB er' + er)})


     return this.switchScreen('main')
}


function fetchCountriesOfUser(user){

     return new Promise((resolve, reject)=>{
          console.log(`geeting data of ${user.email}`)

          const xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function(){
               if (this.readyState == 4 && this.status == 200) {     // console.log(this.status,'received',typeof this.responseText)

                         const result = JSON.parse(this.responseText)
                         result.userName = user.userName

                         console.log('   got user data from server',result.email, result)
                         resolve(result)

               } else if (this.readyState == 4 && this.status!=200) reject()
          }
          xhr.open('POST',serverURL + 'API/getCountriesOfUser',true)
          xhr.send(user.email)
     })
}

function setOtherUserIDBData(allData){
     console.log('allData to IDB >', allData)
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

function getOwnDBData(user = 0){
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
               //console.log('|||     filtered users',users)

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
     //console.log(self.currentCountry, self.countries)
     //self.updateLocationSelect('countries','cities',undefined, self.currentCountry.toString() )

     // city
     let lastCntry = countries.find(cn=>cn.name=== self.currentCountry)
     self.cities = lastCntry.cities
     //console.log('self.cities',self.cities)

     
     self.currentCity = getLastSelection('cities') || 'all cities' 
     //console.log('currentCity', self.currentCity)
     let lastCity = self.cities.find(city => city.name ==  self.currentCity)

     // shop
     //let lastCity = self.cities.find(city => city.name === self.currentCity )
     self.shops = lastCity.shops
     self.currentShop =  getLastSelection('shops')  || 'all shops'
     //console.log(self.currentShop)

     let gz = self.updateLocationSelect(2, null,self.currentShop)

     console.log('promise?', gz)
     /*gz.then(x=>{  //it doesnt return promise
          console.log('after updated loaction', x)
     })*/
     //console.log('this happens last')
     // this is probably not needed anymore
     self.currentDisplayedProducts = self.shops.find(shop=>shop.name === self.currentShop).products
     //console.log('curr prods',self.currentDisplayedProducts)
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
     //console.log(`save to user: ${userName} ${countries}`)
     let obj = {userName, countries }
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

function nodeListToArray(list){
     let result = []
     for (let item of list) result.push(item)
     
     return result
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