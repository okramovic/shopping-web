window.user_locations = new Dexie('user_locations');

     window.user_locations.version(1).stores({  countries: 'name, cities'  });
     user_locations.open().then(data=>{})
          .catch(function(error) {
                    console.error('Uh oh : ' + error);
     });


     
const users_followed = new Dexie('users_followed')

     users_followed.version(1).stores({ userData: data})

     users_followed.open()
     .catch(er=>alert('error opening following', er))





document.addEventListener('DOMContentLoaded', ev =>{     

     user_locations.countries.toArray().then(arr=>{
               //console.log('arr',arr )
               

               /*if (arr.length==0){
                    console.log('storing initial data')

                    user_locations.countries.put({
                                   name: 'all countries' , 
                                   cities: [{
                                             name: 'all cities', 
                                             shops:[{
                                                  name: 'all shops',
                                                  products: []
                                             }]
                                            }]
                    })
                    return user_locations.countries.get('all countries')

                    .then(all=>{
                         console.log('stored initial data:', all)
                         //updateWindowDBData()   
                    }) 

               } //else updateWindowDBData()
               */
     })

})

window.updateWindowDBData = function(obj){
      
          /*window.user_locations.countries.toArray()
               .then(all=>{
                    //window.countries = all
                    this.countries = all
               })*/
}



const app = new Vue({
     el: '#app',
     data: {
          locationInputShown: false,
          locationSet: null,
          newLocation: null,

          
          currentCountry: 'all countries',
          currentCity: 'all cities',
          currentShop: 'all shops',
          countries: [],
          cities: [],
          shops: []
     },
     
     methods:{
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
                                   //updateWindowDBData()  
                              user_locations.countries.toArray()
                              .then(data=>resolve(data))
                                   

                         }).catch(er=>{console.error(er);
                              reject(er)
                         }) 
               })
          },
          getUpdatedDBData: function(){
               return new Promise((reso, reje)=>{
                    window.user_locations.countries.toArray()
                    .then(all =>{  
                                   //this.countries = all
                                   reso(all)
                    })
               })
          },
          openLocationInput: function(set,ev){
               this.locationInputShown = true
               console.log('event', set, ev)
               this.locationSet = `${set}`

               //prevent adding citites to 'all countries'
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
                                   this.getUpdatedDBData().then(data => this.countries = data) // then select newly added thing
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

                              this.getUpdatedDBData().then(data => this.countries = data)
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
                                             this.getUpdatedDBData().then(data => this.countries = data) // then select newly added thing
                    })

               }
               this.locationInputShown= false
               this.newLocation = ""

          },
          updateLocationSelect:function(set, subset, event){

               //, event.srcElement)//.selectedOptions[0].text)
               

               const variable = event.srcElement.getAttribute('data-forlabel')
               console.log('---------------------\nset',set,"subset",subset, "\n variable",variable)


               getSubsetItems(this[set], subset, event.srcElement.selectedOptions[0].text)
               .then(result =>{

                    console.log("subset  >",subset,"\n  >",result.name, 
                                "\n  >",result[subset])

                    //this[variable] = result.name
                    this[subset] = result[subset]
                    //console.log('   set',set,'\n   subset',subset, '\n',this[subset])

                    //['cn','ct','sh']
               })
          }
     },
     mounted: function(){
          this.getUpdatedDBData().then( countries =>{
                    console.log('resolved',countries)

                    if (countries.length===0){
                         this.storeInitialDBData()
                         .then( initialData => {

                              console.log('-->>  initialData', initialData)
                              initializeCountriesState(this, initialData)}
                         )
                    return
                    }
                    initializeCountriesState(this, countries)
                    


          }).catch(er => console.error('error getting init data',er))
          
          function initializeCountriesState(self, countries){
                    //console.log('this',this,"\n", countries)
                    self.countries = countries
                    self.cities = countries[0].cities
                    self.shops = countries[0].cities[0].shops

                    //this.currentCountry = countries[0].name
                    //this.currentCity = countries[0].cities[0].name
                    //this.currentShop = countries[0].cities[0].shops[0].name
                    console.log( 'current Locs\n',self.countries,"\n",self.cities,"\n",self.shops)
          }
     },
     
})



function getSubsetItems(set, subset, name){
     console.log('getSubsetItems',set, subset, name)
     
     return new Promise((resolve, rej)=>{
          let result = set.find(obj=>obj.name === name)
          //console.log('   !!!  res.name, result',result.name, result[subset])

          resolve( {name:result.name, [subset]: result[subset] })
          
     })
     
}
function updateSubsetSelect(){

}

function getPicDate(date){
     console.log('typeof Date',typeof Date)
 
     if (typeof date === 'number'){
         date = new Date()
         //var d = new Date();
         //d.setTime(1332403882588);
         console.log(date)
     }
 
     let year = date.getFullYear(),
         month = date.getMonth()+1,
         day = date.getDate(),
         hours = date.getHours(),
         minutes = date.getMinutes(),
         secs = date.getSeconds()

     return `${year}-${month}-${day} ${hours}-${minutes}-${secs}`
     
}