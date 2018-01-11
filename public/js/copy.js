function addLocationToDB2(set, newName, status){
     console.log('this', this)
     console.log(somevar, somethingChanged)
     
     /*   under what country to add it
          should i update whole country document?
     */     
     const self = this

     if (set =='country'){
                    //console.log('vue locs', deviceUserData)
                    
                    let index = this.countries.findIndex(country=>country.name == newName)

                    if (index>-1) {
                         alert(`${newName}\nis already in your database`)
                         return
                    }
                    const obj = [{  name: newName, 
                                   cities: [{
                                        name: 'all cities', 
                                        shops:[{
                                             name: 'all shops',
                                             products: []
                                        }]
                                   }]
                    }]
                    
                    //window.
                    //var somethingChanged = false
                    //const  = 
                    function copyUserDataI(){
                         var somethingChanged = false
                         //var somevar = 1
                         return copyUserData([obj], self.countries)
                         //const xx = function(){ console.log('hi', somevar)}//test1
                         //return xx
                         //console.log( typeof test1)
                         //return copyUserData//([obj], self.countries)
                    }

                    console.log('copyUserDataI',typeof copyUserDataI)
                    let idk = copyUserDataI()
                    //copyUserDataI([obj], self.countries)

                    /*.then(final=>{
                         console.log('somethingChanged B? ',somethingChanged)
                         console.log('location data to save', final===this.countries, final)

                         // save each country without prods to device user IDB
                         //if (somethingChanged) final.forEach( country => deviceUserData.countries.put(country) )
                         //return initializeCountriesState(this, final)
                    })*/

                    //deviceUserData.userData.put({userName: this.userName || 0, countries: obj})
                    //window.deviceUserData.userData.add(obj)
                    /*     .then(status => { console.log('status',status)
                              //getOwnDBData(this.userName)
                         })
                              .then(data => {
                                        //initalCountryData(this, data)
                                        //this.countries = data
                              }) // then select newly added thing
                   //\ )*/

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
               window.deviceUserData.countries.put(countryData).then(status =>{ 

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
          window.deviceUserData.countries.put(countryData).then(status => {
                                   console.log('   updated Vue data',this.countries) 
                                   this.getOwnDBData().then(data => this.countries = data) // then select newly added thing
          })

     }
     //this.locationInputShown= false
     //this.newLocation = ""

}

export {addLocationToDB2}