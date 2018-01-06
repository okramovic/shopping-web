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
})({3:[function(require,module,exports) {
/**
 *        simple state management http://vuetips.com/simple-state-management-vue-stash
 * 
 */


// for each product do display in DOM, use Component or template

/**  DONE
 *   -    save last open locations to loc stor
 */

'use strict'

function createDeviceUser(defaultName = 'anonymous'){
     //if ( window.localStorage.getItem('deviceUser') === null){
          const initialData = {
               userName: defaultName, 
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

//const user1data = require('./testUserData1.json'), user2data = require('./testUserData2.json')




const users_followed = new Dexie('users_followed')

     users_followed.version(1).stores({ userData: 'userName, countries'})

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
               console.log('otherUsers',otherUsers)
               let others = []
               users.forEach(user=>others.push(user))
               console.log('otherUsers',others)
               res(others)

          })
          .catch(er=>alert('error opening following', er))
     })
}






const app = new Vue({
     el: '#app',
     data: {
          username: undefined,
          locationInputShown: false,
          locationSet: null,
          newLocation: null,

          currentCountry: null,
          currentCity:  null,
          currentShop:  null,
          countries: [],
          cities: [],
          shops: []
     },
     
     methods:{
          getDeviceUser:function(){
               return new Promise((resolve, reject)=>{
                    let data = JSON.parse(window.localStorage.getItem('deviceUser'))
                    console.log('user', data)
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
                                                                 products: []
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
                         result = result.map(el=>el.countries)
                         //console.log(result)
                         resolve(result)
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
               console.log('slct', event.srcElement.selectedIndex)
               //console.log('label', event,'\n', event.srcElement.getAttribute('data-saveas')  )

               if (event.srcElement.selectedIndex<0) return      // protection against DOM load events 

               const self = this
               const selects = ['countries', 'cities', 'shops'], //, 'products'],
                     currents= ['currentCountry','currentCity','currentShop']
               console.log('index', index, selects[index])

               // improve this nonsense
               //if (event && event.timeStamp>2000) setLastSelection(selects[index], event.srcElement.selectedOptions[0].text)
               const name = event.srcElement.selectedOptions[0].text

               //if (event && event.srcElement.selectedOptions[0])
               setLastSelection(event.srcElement.getAttribute('data-saveas'), name)


               if (index< selects.length-1)  getSubsetItems(this,index,name)

                                                  .then(result =>{  // save last locations to local storage
                                                  })
               function getSubsetItems(self, outerIndex, name){
                    if (outerIndex>2) return false;

                    return new Promise((resolve, rej)=>{
                         // 0 1 2
                         const currentX = currents[outerIndex]  // 'currentCountry' 'currentCity' 'currentShop'
                         const index = outerIndex,
                               superSet = selects[index-1], // 'countries' 'cities' 'shops'
                               set      = selects[index],   // 'countries' 'cities' 'shops'
                               subSet   = selects[index+1]  // 'countries' 'cities' 'shops'
                               
                         //console.log('self[currentX]', currentX, self[currentX])
                         //console.log('self.set', self[set])
                         // get current Country without DOM
                         //console.log('!!',currents[outerIndex-1])

                         //const name = event.srcElement.selectedOptions[0].text
                         self[currentX] = name
                         console.log(currentX, name)
                         console.log('    save ?', set, name)
                         setLastSelection(set, name)


                         let a = self[set].find(el=>{
                                   //console.log('el.name', el.name)
                                   return el.name===name
                         })
                         //console.log('a',a.name, a[subSet])
                         

                         self[subSet] = a[subSet]
                         //console.log(`set city to`, a[subSet][0].name)
                         //console.log('---',currents[outerIndex+1])
                         if (currents[outerIndex+1]=== undefined) return;

                         let string = currents[outerIndex+1].toString()
                         self[string]= a[subSet][0].name    // 'currentCountry' 'currentCity' 'currentShop'
                         
                         //console.log('self[subSet]', self[subSet][0].name)  // name of default item to set
                         // save it as last in Loc Storage
                         

                         getSubsetItems(self, outerIndex + 1, a[subSet][0].name)
                                        //. then(()=> setLastSelection(currentX, name))
                         resolve()
                    })
               }
          }
     },
     mounted: function(){
          this.getDeviceUser().then(username=>{
               this.username = username

               this.getOwnDBData().then( ownCountries =>{
                    //console.log('resolved',countries)

                    // = user opened app for first time or has deleted browser memory
                    if (ownCountries.length===0){
                              this.storeInitialDBData()
                              .then( initialData => 
                                   //console.log('-->>  initialData', initialData)
                                   initializeCountriesState(this, initialData) )
                              return
                         }
                         

                    this.getLocalStoredUsersData().then(users=>{
                                   
                         //let allCountries = [...ownCountries]
                         console.log('users', users)

                         copyUserData(users).then(final=>{
                                   console.log('\n\n')
                                   console.log('final data', final)
                                   initializeCountriesState(this, final)
                         })

                         function copyUserData(users){
                              return new Promise((resolve, reject)=>{
                                   const sets = ['countries','cities','shops','products']
                                   let index = 0
                                   users.forEach(other_countries=>{
                                                  console.log('------------------ checking another user:')//, other_countries.name)

                                                  copyEntries(index, ownCountries, other_countries)
                                                  .then(newCountries=>{
                                                       resolve(newCountries) 
                                                  })  
                                   })

                         
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
                                        //console.log(emptyspace(outerIndex),'index', index, subset)
                                        //if (subset===undefined) return false;
                                        //else 
                                        return new Promise((resolve,rej)=>{
                                             otherEntries.forEach(other_entry=>{

                                                  console.log( emptyspace(outerIndex),`checking others '${other_entry.name}'`)

                                                  if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)===false) {
                                                       // not among own ones
                                                       console.log(emptyspace(outerIndex),'NOT THERE -> ADDING ',other_entry.name )
                                                       ownEntries.push(other_entry)
                                                  } else{
                                                       //const subindex = index + 1
                                                       ownEntries.forEach( own_entry=>{
                                                            // take others subentries and add them to Own
                                                            if (own_entry.name === other_entry.name){
                                                                 console.log(emptyspace(outerIndex),`duplicates ${own_entry.name} = ${other_entry.name}`)
                                                                 console.log(emptyspace(outerIndex),'subset',subset,'<<')
                                                                 if (subset!==undefined) // if subset is undefined, can it even reach this deep? i.e. - if the condition neccessary
                                                                 copyEntries(index, own_entry[subset], other_entry[subset] )

                                                                 else if (subset===undefined) console.log(emptyspace(outerIndex),'done -------')
                                                            }
                                                       })
                                                  }
                                             })
                                             resolve(ownEntries)
                                        })
                                        /*return new Promise((resolve,rej)=>{
                                                       ownEntries.forEach(own_entry=>{
                                                            console.log('own - checking ', own_entry.name)
                         
                                                            // if its not already among Own entries 
                                                            otherEntries.forEach( other_entry=>{
                                                                 //console.log('       ', other_entry.name)//, other_entry[subset])
                                                                 console.log('     ',own_entry.name, other_entry.name)
                                                                 if (ownEntries.some(ownEntry=> ownEntry.name == other_entry.name)===false) {
                                                                      // not among own ones
                                                                      console.log('      not there -> adding ',other_entry.name )
                                                                      ownEntries.push(other_entry)
                                                                      
                                                                 } else {
                                                                      // take others subentries and add them to Own
                                                                      console.log(`     '${other_entry.name}'  is there, checking ${subset}`)
                                                                      console.log(`     own ${subset}->`, own_entry[subset])
                                                                      console.log(`     oth ${subset}->`, other_entry[subset])
                                                                      // get all [subset] from own entry
                                                                      // get all [subset] from other entries
                                                                 }
                                                            })
                                                       })
                                                       console.log('!! final ownEntries', ownEntries)
                                                       resolve(ownEntries)
                                        })*/
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
          }
          function updateNextSelect(items){

          }
     },
     created:function(){
          //console.log('CREATED')
     }
})




function updateSubsetSelect(){

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
          year,month, day, hours, minutes, secs
     }
     for (let num in obj){
          
          if (obj[num]<10) {
               
               obj[num] =  String('0' + obj[num] ) 
               //console.log('short ',obj[num]) 
          }
          
     }

     return `${obj.year}-${obj.month}-${obj.day} ${obj.hours}-${obj.minutes}-${obj.secs}`
     
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
  var ws = new WebSocket('ws://localhost:59885/');
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
},{}]},{},[0,3])