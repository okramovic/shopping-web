/**
 *        simple state management http://vuetips.com/simple-state-management-vue-stash
 * 
 */


// for each product do display in DOM, use Component or template

/**  DONE
 *   -    save last open locations to loc stor
 */

'use strict'
//import {addLocationToDB2} from './copy.js';
//console.log('hey', typeof addLocationToDB2)

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

     users_followed.version(1).stores({ userData: 'userName, countries'})
     //const user1data = require('./testUserData1.json'), user2data = require('./testUserData2.json')
     //users_followed.userData.put(user1data)
     //users_followed.userData.put(user2data)
     //console.log('user1data',user2data.userName)


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
               let email = this.loginemail
               let password = this.loginpass

               console.log('longin', email, password)

               const tosend = {email, password}, self = this

               let xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {      console.log('received',typeof this.responseText, this.responseText)
                              
                              let loginResponse
                              
                         if (typeof this.responseText==='string') loginResponse = JSON.parse(this.responseText)

                              window.localStorage.setItem('deviceUserEmail', email)
                              updateDeviceUser(loginResponse.userName)
                              
                              if (loginResponse.followedUsers) 
                                   loginResponse.followedUsers.forEach(user=>addUserToDeviceLS(user))

                              self.userName = loginResponse.userName
                              self.screen = 'main'
                              self.startApp()
                              return self.log(`You rock'n'hop! logged iN`)

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
                    let userName = document.querySelector('input[name="reg-username"').value
                    let password  = document.querySelector('input[name="reg-userpassword"').value
               
                    const tosend = {email, userName, password}
                    //console.log('email', tosend)

               if (!email || !userName || ! password) return console.error('email or name or pass missing')

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
               this.userName = undefined
               window.localStorage.removeItem('deviceUserEmail')
               window.localStorage.removeItem('deviceUser')
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
          followUser:function(email,userName){
               console.log('follow', email,userName)
               const self = this

               const xhr = new XMLHttpRequest()
               xhr.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) { 
                         console.log('follow sekces')
                         // store new followdee in local storage
                         addUserToDeviceLS({userName, email})

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
          /*getLocalStoredUsersData: function(){
               return new Promise((resolve, reject)=>{
                    getOtherUsersLocalData().then(result=>{
                         //result = result.map(el=>el.countries)
                         //console.log(result)
                         if (result.length>0) resolve(result)
                         else resolve(null)

                    })
               })   
          },*/
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

               const addLocation = addLocationToDB.bind(this)
               
               return addLocation(this.locationSet, this.newLocation)
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

               
               getSubsetItems(this,index,name)
                    .then(userOwnProducts =>{  
                         // save last locations to local storage rather here?
                         console.log('----- user own products:', userOwnProducts.length, Array.isArray(userOwnProducts) , userOwnProducts)

                         // get products from each user in IDB: for current city, shop etc
                         getOtherUsersLocalData()
                         .then(users=>{
                              
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


                              console.log('|||| to add', Array.isArray(otherProds), otherProds)
                              let finals = []
                              if (userOwnProducts.length>0) finals = [...userOwnProducts]
                              console.log('finals1', finals.length)

                              if (otherProds.length>0) finals = finals.concat(...otherProds)
                              //finals = [...finals, ...otherProds]
                              console.log('finals2', finals.length)
                              // displays products on screen
                              this.currentDisplayedProducts = finals//[...finals]
                              //userOwnProducts.concat(otherProds)
                              console.log('curr prods',this.currentDisplayedProducts)
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
                         console.log(currentX, name)
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
          },
          startApp:function(){


               this.userName = getDeviceUser()
               //if (this.userName===null) this.userName = 'null'  // because of IDB so user can be found, it doesnt store null as value
               console.log('userName', this.userName)
               
               if (this.userName!==undefined){ 
                    this.followedUsers = getLSfollowedUsers() 
               }
               console.log('followedUsers len', this.followedUsers.length, this.followedUsers)
               // try to update followdees data in IDB from MDB (if online)
               
               getOwnDBData(this.userName)
               .then( ownCountries =>{
                    console.log('resolved length:',ownCountries.length, ownCountries)

                    // try to get MDB data to update LocSto
                    if (navigator.onLine){
                         /*this.followedUsers.forEach(user=>{
                              fetchUserCountries(user)
                         })*/

                    } else {}

                    //let somethingChanged = false
                    if (!this.userName) return initializeCountriesState(this, ownCountries)
                    //else return console.log('can follow others')

                    getOtherUsersLocalData()
                    .then(users=>{

                         let somethingChanged = false
                         let own = [...ownCountries]
                         let Users = users.map(user=>user.countries)
                         console.log('my own', ownCountries)
                         console.log('users', Users)

                         //return;
                         if (!Users){
                              //console.log('-------    testing screen init    -------')
                              console.log('NO FOLLOWED USERS')
                              return initializeCountriesState(this, own)
                         }

                         // copies all others' locations to save them in IDB of device
                         copyUserData(Users, own)
                              .then(final=>{
                                   console.log('somethingChanged? ',somethingChanged)
                                   console.log('location data to save', final===own, final)

                                   // save each country without prods to device user IDB
                                   //if (somethingChanged) final.forEach( country => deviceUserData.countries.put(country) )
                                   return initializeCountriesState(this, final)
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
                    })
               })
               .catch( er => {
                    
                    if (er===null){  //console.log('- - - will initialize Country data')
                         
                         storeInitialDBData(this.userName)
                         .then( data =>{
                              console.log('- - - stored?', data)
                              initializeCountriesState(this, initalCountryData)
                              //this.startApp()
                         })

                    } else 
                         console.error('!!!!!  there was real error\n error getting init data',er)
               })
          
     
          }
     },
     mounted: function(){
          this.startApp()
     },
     created:function(){
          //console.log('CREATED')
     }
})

function addLocationToDB(set, newName){
     console.log('add', set)
     //   under what country to add it
     //   should i update whole country document?
     let somethingChanged = '333' //false
     const copyData = new Function('users', 'owndata', copyUserData_text)
     const self = this
     
     let toSave

     if (set =='country'){
                    console.log(`this happens 1`)
                    let index = this.countries.findIndex(country=>country.name == newName)

                    if (index>-1) { return alert(`'${newName}' is already in your database`) }

                    const newCountry = 
                              [{   name: newName, 
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
               let index = countryData.cities.findIndex(city=>city.name == newName)

               if (index>-1){ return alert(`'${newName}' is already in your database`) }
               

               countryData.cities.push({
                                   name: newName, 
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
          console.log( '   adding shop',cityData.name)

          // check its not there already
          if (cityData.shops.findIndex(shop=>shop.name===newName) > -1)
                    return alert(`'${newName}' is already in your database`)
          

          cityData.shops.push(
                                   {
                                     name: newName,
                                     products: []
                                   }
                              )

          console.log('   new cntry original',this.currentCountry, countryData)
          
          toSave = [[countryData]]
          
          /*window.deviceUserData.countries.put(countryData).then(status => {
                                   console.log('   updated Vue data',this.countries) 
                                   this.getOwnDBData().then(data => this.countries = data) // then select newly added thing
          })*/

     }
     console.log(`this happens last`)
     

     copyData( toSave, [...this.countries] )

     .then(final=>{
               console.log('location data to save', final===this.countries, final)

               return updateDeviceUserCountries(this.userName, final)
                         
     }).then(result=>{
               console.log('result', result)
               return initializeCountriesState(this, result)
     })



     return this.switchScreen('main')
}





function fetchUserCountries(user){
     console.log(`geeting data of ${user.email}`)

     const xhr = new XMLHttpRequest()
     xhr.onreadystatechange = function(){
          if (this.readyState == 4 && this.status == 200) {     // console.log(this.status,'received',typeof this.responseText)
                    const result = JSON.parse(this.responseText)
                    console.log(result.email, result, typeof this.responseText)
          }
     }
     xhr.open('POST',serverURL + 'API/getCountriesOfUser',true)
     xhr.send(user.email)
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

//createDeviceUser('app Owner')
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

function initializeCountriesState(self, countries){
     console.log('initializing countries\n')

     //it doesnt seem to reflect the content unless its refreshed by user

     self.countries = countries
     self.currentCountry = getLastSelection('countries') || 'all countries'
     //console.log(self.currentCountry, self.countries)
     //self.updateLocationSelect('countries','cities',undefined, self.currentCountry.toString() )

     // city
     let lastCntry = countries.find(cn=>cn.name=== self.currentCountry)
     self.cities = lastCntry.cities
     //console.log('self.cities',self.cities)

     self.currentCity =  self.cities.find(city => city.name ==  getLastSelection('cities') || 'all cities' )
     self.currentCity = self.currentCity.name
     //console.log(self.currentCity)

     // shop
     let lastCity = self.cities.find(city => city.name === self.currentCity )
     self.shops = lastCity.shops
     self.currentShop =  getLastSelection('shops')  || 'all shops'
     //console.log(self.currentShop)

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
