// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({4:[function(require,module,exports) {
/**
 *        simple state management http://vuetips.com/simple-state-management-vue-stash
 * 
 */


// for each product do display in DOM, use Component or template

/**  DONE
 *   -    save last open locations to loc stor
 */

'use strict'
//createDeviceUser('app Owner')
function createDeviceUser(name = 'anonymous'){
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


window.otherUsers = []

window.user_locations = new Dexie('user_locations');

     window.user_locations.version(1).stores({  countries: 'name, cities'  });
     user_locations.open().then(data=>{})
          .catch(function(error) {
                    console.error('Uh oh : ' + error);
     });






const users_followed = new Dexie('users_followed')

     users_followed.version(1).stores({ userData: 'userName, countries'})
     //const user1data = require('./testUserData1.json'), user2data = require('./testUserData2.json')
     //users_followed.userData.put(user1data)
     //users_followed.userData.put(user2data)
     //console.log('user1data',user2data.userName)

function getOtherUsersLocalData(){
     return new Promise((res,rej)=>{
               
          users_followed.open(x=>{
               console.log('x',x)
               return //x.userData.toArray()
          })
          .then(()=>users_followed.userData.toArray())
          .then(users =>{ 
               //let others = []
               //users.forEach(user=>others.push(user))
               //console.log('otherUsers',others)
               res(users)

          })
          .catch(er=>alert('error opening following', er))
     })
}


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

          newProductForm: false
     },
     
     methods:{
          switchScreen:function(screen){
               this.screen = screen
          },
          showUserSettings:function(show){
               this.showSettings = show;
               if (show) this.screen = 'settings'
               else this.screen = 'main'
          },
          login:function(){
               let email = this.loginemail
               let password = this.loginpass

               console.log('longin', email, password)

               const tosend = {email, password}, self = this

               let xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {      console.log('received',this.responseText)
                              
                              self.log(`You rock'n'hop! logged iN`)
                              window.localStorage.setItem('deviceUserEmail', email)
                              createDeviceUser(this.responseText)
                              self.userName = this.responseText
                              self.screen = 'main'

                    } else if (this.readyState == 4 && this.status == 400){

                         self.log(`something went wrong`)
                    }
               }
               xhr.open("POST", serverURL + "API/login", true)
               xhr.send(JSON.stringify( tosend))

          },
          signUp: function($event){
               $event.preventDefault()
               let self = this
                    let email = document.querySelector('input[name="reg-useremail"').value
                    let username = document.querySelector('input[name="reg-username"').value
                    let password  = document.querySelector('input[name="reg-userpassword"').value
               
                    const tosend = {email, username, password}
                    //console.log('email', tosend)

               if (!email || !username || ! password) return console.error('email or name or pass missing')

               let xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function() {
                    
                    if (this.readyState == 4 && this.status == 200) {  //this.responseText;
                              //console.log(this.responseText,this.status)

                              self.log(`You rock'n'b! Account created, check your email, spam etc`)
                              window.localStorage.setItem('deviceUserEmail', email)
                              createDeviceUser(username)
                              self.getDeviceUser().then(name=>self.userName = name)
                              self.screen = 'main'

                    } else if (this.readyState == 4 && this.status ==400)

                              self.log(`Email address '${email}' is already used..`)
                    else {}

                  };

               xhr.open("POST", serverURL + "API/signup", true)
               //xhr.setRequestHeader('Access-Control-Allow-Origin', true)  //Access-Control-Allow-Origin
               xhr.send(JSON.stringify( tosend))
          },
          logout: function($ev){
               console.log('>> logouted <<')
               this.userName = null
               window.localStorage.removeItem('deviceUserEmail')
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
          log: function(msg){
               this.console = msg

               setTimeout(()=>{
                    this.console = undefined
               },5000)
          },
          followUser:function(email,username){
               console.log('follow', email,username)
               const self = this

               const xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) { 
                         console.log('follow sekces')
                         // store new followdee in local storage
                         addUserToDeviceLS({username, email})

                    } else if (this.readyState == 4 && this.status == 400) { 
                         console.error('TRY AGAIN LATER')
                         // finish this part
                    }
               }
               xhr.open('POST', serverURL + 'API/followuser', true)
               xhr.send(JSON.stringify({  email:email, 
                                          addTo: window.localStorage.getItem('deviceUserEmail')
                                       })
               )

          },
          isFollowed:function(email){
                    let users = window.localStorage.getItem('followedUsers')
                    users = JSON.parse(users)
                    console.log(email, 'LS followed users', users)
                    if (!users || users.some(user=>user.email== email)===false) return false
                    else return true
          },
          getDeviceUser:function(){
               return new Promise((resolve, reject)=>{
                    let data = JSON.parse(window.localStorage.getItem('deviceUser'))
                    //console.log('user', data)
                    if (data) resolve(data.userName)
                    else resolve(null)  //createDeviceUser() //can have default string
                    
               })
               
          },
          storeInitialDBData:function(){
               return new Promise((resolve, reject)=>{

                         user_locations.countries.put({
                                             name: 'all countries' , 
                                             cities: [
                                                       {
                                                        name: 'all cities', 
                                                        shops:[{
                                                                 name: 'all shops',
                                                                 products: [{"name":"časopis"},{"name":"denní tisk"}]
                                                        }]
                                                       }
                                                     ]
                              
                         })
                         .then(all=>{
                                   console.log('stored initial data:', all,"<<")
                                   //getOwnDBData()  
                              user_locations.countries.toArray()
                              .then(data=>resolve(data))
                                   

                         }).catch(er=>{console.error(er);
                              reject(er)
                         }) 
               })
          },
          getOwnDBData: function(){
               return new Promise((reso, reje)=>{
                    window.user_locations.countries.toArray()
                    .then(all =>{  
                                   //this.countries = all
                                   reso(all)
                    })
               })
          },
          getLocalStoredUsersData: function(){
               return new Promise((resolve, reject)=>{
                    getOtherUsersLocalData().then(result=>{
                         //result = result.map(el=>el.countries)
                         //console.log(result)
                         if (result.length>0) resolve(result)
                         else resolve(null)

                    })
               })   
          },
          openLocationInput: function(set,ev){
               this.locationInputShown = true
               console.log('event', set, ev)
               this.locationSet = `${set}`

               if (this.locationSet=='city' && this.currentCountry == 'all countries') {
                    alert('choose country first')
                    return this.locationInputShown = false
               }
          },
          addNewLocation: function(){
               console.log(`new ${this.locationSet} is ${this.newLocation}`)

               this.addLocationToDB(this.locationSet, this.newLocation)
          },
          addLocationToDB: function(set, newName){

               /*   under what country to add it
                    should i update whole country document?
               */     
               
               if (set =='country'){
                              console.log('vue locs', user_locations)

                              let index = this.countries.findIndex(country=>country.name == newName)

                              if (index>-1) {
                                   alert(`${newName}\nis already in your database`)
                                   return
                              }
                              const obj = {  name: newName, 
                                             cities: [{
                                                  name: 'all cities', 
                                                  shops:[{
                                                       name: 'all shops',
                                                       products: []
                                                  }]
                                             }]
                              }
                              window.user_locations.countries.add(obj).then(status => 
                                   this.getOwnDBData().then(data => this.countries = data) // then select newly added thing
                              )

                         //})
               } else if (set =='city') {
                         let countryData = this.countries.find(cntry=> cntry.name==this.currentCountry)
                         console.log( '   adding city',this.countries,"\n",countryData)


                         // check if this city is already there
                         let index = countryData.cities.findIndex(city=>city == newName)

                         if (index>-1){
                              alert(`${newName}\nis already in your database`)
                              return
                         }
                         countryData.cities.push({
                                             name: newName, 
                                             shops:[{
                                                  name: 'all shops',
                                                  products: []
                                             }]
                         })
                         window.user_locations.countries.put(countryData).then(status =>{ 

                              this.getOwnDBData().then(data => this.countries = data)
                              console.log('updated Vue data',this.countries) 
                         })
               } else if (set =='shop') {
                    let countryData = this.countries.find(cntry=> cntry.name===this.currentCountry)
                    
                    let cityData = countryData.cities.find(city=>city.name === this.currentCity)
                    console.log( '   adding shop',cityData)
                    // check its not there already
                    if (cityData.shops.findIndex(shop=>shop.name===newName)>-1){
                         alert(`${newName}\nis already in your database`)
                         return
                    }

                    cityData.shops.push(
                                             {
                                               name: newName,
                                               products: []
                                             }
                                        )
                    console.log('   new cntry data',this.currentCountry, countryData)
                    window.user_locations.countries.put(countryData).then(status => {
                                             console.log('   updated Vue data',this.countries) 
                                             this.getOwnDBData().then(data => this.countries = data) // then select newly added thing
                    })

               }
               this.locationInputShown= false
               this.newLocation = ""

          },
          updateLocationSelect:function(index, event){
               //console.log('slct', event.srcElement.selectedIndex)
               //console.log('label', event,'\n', event.srcElement.getAttribute('data-saveas')  )

               if (event.srcElement.selectedIndex<0) return      // protection against DOM load events 

               const self = this
               const selects = ['countries', 'cities', 'shops','products'],
                     currents= ['currentCountry','currentCity','currentShop']
               
               const name = event.srcElement.selectedOptions[0].text

               setLastSelection(event.srcElement.getAttribute('data-saveas'), name)


               //if (index< selects.length-1)  
               
               getSubsetItems(this,index,name)
                    .then(userOwnProducts =>{  
                         // save last locations to local storage rather here?
                         console.log('----- user own products:', userOwnProducts.length, userOwnProducts)

                         // get products from each user in IDB: for current city, shop etc
                         getOtherUsersLocalData()
                         .then(users=>{
                              
                              //const their_countries = data.map(user=>user.countries)
                              //console.log('their_countries', their_countries)
                              let newProds = users.map(user=>{
                                   const countryI = user.countries.findIndex(cntry=>{
                                                            //console.log(self.currentCountry, cntry.name)
                                                            return cntry.name === self.currentCountry
                                                  })
                                   //console.log('i ?', countryI)
                                   if (countryI > -1){
                                        //console.log(self.currentCity)
                                        const cityI = user.countries[countryI].cities.findIndex(city=>city.name === self.currentCity )
                                        
                                        const shop = user.countries[countryI].cities[cityI].shops.find(shop=>shop.name===self.currentShop)
                                        //console.log('shop', shop)
                                        return shop.products
                                   }
                              }).filter(prods=>prods!==undefined)
                              console.log('|||| ', newProds)

                              // displays products on screen
                              this.currentDisplayedProducts = userOwnProducts.concat(newProds)
                         })
                         
                    })
               function getSubsetItems(self, outerIndex, name){
                    
                    if (outerIndex>4) return false;

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

                         let a = self[set].find(el=>{ return el.name===name })
                         
                         

                         self[currentX] = name
                         //console.log(currentX, name)
                         //console.log('    save ?', set, name)
                         setLastSelection(set, name)

                         self[subSet] = a[subSet]
                         //console.log(`subset`, a[subSet])
                         //console.log('subSet', subSet)
                         
                         //console.log('---',currents[outerIndex+1])
                         if (currents[outerIndex+1]=== undefined) {
                              //console.log('products?', a.name, a[subSet])
                              resolve(a[subSet]) 
                              return //console.log('test')
                         }

                         let string = currents[outerIndex+1].toString()
                         self[string]= a[subSet][0].name    // 'currentCountry' 'currentCity' 'currentShop'
                         
                         //console.log('[subSet]', self[subSet][0])  // name of default item to set
                         
                         resolve(
                              getSubsetItems(self, outerIndex + 1, a[subSet][0].name)          
                         )
                    })
               }
          },
          openNewProductForm:function(open){
               this.newProductForm = open
          },
          newProductSubmit: function($event){
               $event.preventDefault()
               
               //const form = document.querySelector('form[name="newProductForm"')
               const rating = document.querySelector('input[name="newRating"]:checked').value

               const fileName = `${this.userName}_D${getFormattedDate(null)}`
               console.log('submit', fileName)
          }
     },
     mounted: function(){
          this.getDeviceUser().then(userName=>{
               this.userName = userName
               console.log('this uname', this.userName)
               //if (userName === null) this.userName = 'anonymous'
               this.followedUsers = getLSfollowedUsers()

               // try to update followdees data in IDB from MDB (if online)

               this.getOwnDBData().then( ownCountries =>{
                    console.log('resolved was length:',ownCountries.length, ownCountries)

                    // = user opened app for first time or has deleted browser memory
                    if (ownCountries.length===0){
                              this.storeInitialDBData()
                              .then( initialData => 
                                     initializeCountriesState(this, initialData) )
                    }     

                    this.getLocalStoredUsersData().then(users=>{
                                   
                         let own = [...ownCountries]
                         let Users = users.map(user=>user.countries)
                         console.log('users', Users)

                         
                         // copies all others' locations to save them in IDB of device
                         if (Users) copyUserData(Users, own)
                                        .then(final=>{
                                             console.log('location data to save', final===own, final)

                                             // save each country without to device user IDB
                                             //final.forEach( country => user_locations.countries.put(country) )

                                             return initializeCountriesState(this, final)
                                        })

                         else console.log('NO FOLLOWED USERS')
                         return initializeCountriesState(this, ownCountries)



                         function copyUserData(users, owndata){
                              //console.log('EQUAL', ownCountries == owndata)
                              
                              return new Promise((resolve, reject)=>{
                                   const sets = ['countries','cities','shops','products']
                                   let index = 0
                                   users.forEach(other_countries => {

                                             // remove products from each country
                                             const others_cleaned = other_countries.map( country => removeProducts(country,0))     

                                             copyEntries(index, owndata, others_cleaned) //users.countries)

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

               }).catch(er => console.error('error getting init data',er))
          })


          function initializeCountriesState(self, countries){
                    //console.log('this',self,"\n", countries)
                    //it doenst seem to reflect the content unless its refreshed by user

                    self.countries = countries
                    self.currentCountry = getLastSelection('countries')
                    //self.updateLocationSelect('countries','cities',undefined, self.currentCountry.toString() )

                    // city
                    let lastCntry = countries.find(cn=>cn.name=== self.currentCountry)
                    self.cities = lastCntry.cities
                    //console.log('self.cities',self.cities)

                    self.currentCity =  self.cities.find(city => city.name ==  getLastSelection('cities') )
                    self.currentCity = self.currentCity.name

                    // shop
                    let lastCity = self.cities.find(city => city.name === self.currentCity )
                    self.shops = lastCity.shops
                    self.currentShop=  getLastSelection('shops') 

                    self.currentDisplayedProducts = self.shops.find(shop=>shop.name = self.currentShop).products
          }
     },
     created:function(){
          //console.log('CREATED')
     }
})




function setLastSelection(set, value){
     //console.log('>> saving', set, value)
     window.localStorage.setItem(set, value.toString() )
}
function getLastSelection(set){
     
     let val = window.localStorage.getItem(set)
     //console.log('requested', set, val)
     return val
}

function getFormattedDate(date){
     //console.log('typeof Date',typeof date, date)
 
     if (typeof date === 'number' || !date){
         date = new Date()
         //var d = new Date();
         //d.setTime(1332403882588);
         //console.log(date)
     }
 
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

},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://localhost:64454/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,4])