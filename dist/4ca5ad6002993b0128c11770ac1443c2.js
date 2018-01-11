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
})({7:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function addLocationToDB(set, newName) {
  console.log('this', this);
  /*   under what country to add it
       should i update whole country document?
  */
  const self = this;

  if (set == 'country') {
    //console.log('vue locs', deviceUserData)

    let index = this.countries.findIndex(country => country.name == newName);

    if (index > -1) {
      alert(`${newName}\nis already in your database`);
      return;
    }
    const obj = [{ name: newName,
      cities: [{
        name: 'all cities',
        shops: [{
          name: 'all shops',
          products: []
        }]
      }]
    }];

    //window.
    //var somethingChanged = false
    //const  = 
    function copyUserDataI() {
      var somethingChanged = false;
      var somevar = 1;
      return copyUserData([obj], self.countries);
      //const xx = function(){ console.log('hi', somevar)}//test1
      //return xx
      //console.log( typeof test1)
      //return copyUserData//([obj], self.countries)
    }

    console.log('copyUserDataI', typeof copyUserDataI);
    let idk = copyUserDataI();
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
  } else if (set == 'city') {
    let countryData = this.countries.find(cntry => cntry.name == this.currentCountry);
    console.log('   adding city', this.countries, "\n", countryData);

    // check if this city is already there
    let index = countryData.cities.findIndex(city => city == newName);

    if (index > -1) {
      alert(`${newName}\nis already in your database`);
      return;
    }
    countryData.cities.push({
      name: newName,
      shops: [{
        name: 'all shops',
        products: []
      }]
    });
    window.deviceUserData.countries.put(countryData).then(status => {

      this.getOwnDBData().then(data => this.countries = data);
      console.log('updated Vue data', this.countries);
    });
  } else if (set == 'shop') {
    let countryData = this.countries.find(cntry => cntry.name === this.currentCountry);

    let cityData = countryData.cities.find(city => city.name === this.currentCity);
    console.log('   adding shop', cityData);
    // check its not there already
    if (cityData.shops.findIndex(shop => shop.name === newName) > -1) {
      alert(`${newName}\nis already in your database`);
      return;
    }

    cityData.shops.push({
      name: newName,
      products: []
    });
    console.log('   new cntry data', this.currentCountry, countryData);
    window.deviceUserData.countries.put(countryData).then(status => {
      console.log('   updated Vue data', this.countries);
      this.getOwnDBData().then(data => this.countries = data); // then select newly added thing
    });
  }
  //this.locationInputShown= false
  //this.newLocation = ""
}

exports.addLocationToDB = addLocationToDB;
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
  var ws = new WebSocket('ws://localhost:56814/');
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
},{}]},{},[0,7])