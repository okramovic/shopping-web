const db = new Dexie("product_pictures");

          db.version(1).stores({
              pictures: 'name,data'
});
/*const alldata = new Dexie("alldata");

          db.version(1).stores({
              data: 'data'
});*/


db.open()
  .then(idk=>{  console.log(idk)
  })
  .catch(function(error) {
		alert('Uh oh : ' + error);
});

document.addEventListener('DOMContentLoaded',ev=>{
        //console.log('loaded? \n', db)
  
        db.pictures.toArray().then(data=>{
                  
                  console.log(data)
                  //alert(data.length || 'nothing')
          
                  data.forEach( pic =>{
                        console.log(pic)
                        
                        const img = document.createElement('img')
                        
                        //const windowURL = window.URL || window.webkitURL;
                        //const picURL = windowURL.createObjectURL(pic.data);
                    
                    
                        img.id = pic.name
                        img.src= pic.data
                      
                        document.querySelector('body').appendChild(img)
                  })
        })
  
        /*new Dexie('product_pictures').open()
          .then(function (db) {
                //console.log (db);
                //console.log ("Database version: " + db.verno);

        }).catch('NoSuchDatabaseError', function(e) {
            // Database with that name did not exist
            console.log ("Database not found");
        })*/
})

document.getElementById('mobileSwitch').addEventListener('change',ev=>{
      console.log('ev\n', ev)
  
      const file = ev.target.files[0]
      console.log(file);
      
      //const windowURL = window.URL || window.webkitURL;
      //const picURL = windowURL.createObjectURL(file);
      const name = getPicDate(file.lastModifiedDate || file.lastModified)
      let fileData;
      
      const reader = new FileReader();
      //console.log(reader)
      
      reader.onloadend = function(ev){
            //console.log(ev.target.result)
            fileData = ev.target.result
            const preview = document.getElementById('preview')
            
            preview.src = fileData
            preview.style.display = 'block'
            
        
            saveImage(name, fileData)
      }
      reader.readAsDataURL(file)
      
      
      
      // windowURL.revokeObjectURL(picURL);
  
  
  
      
})



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

function saveImage(name, data){
  db.pictures.put({name , data}).then (function(){
              //
              // Then when data is stored, read from it
              //
              return db.pictures.get(name);
        
        
          }).then(function (picture) {
              //
              // Display the result
              //
              console.log(picture);
              //document.getElementById('pic').src = picture.data
        
          }).catch(function(error) {
             //
             // Finally don't forget to catch any error
             // that could have happened anywhere in the
             // code blocks above.
             //
             console.log ("Ooops: " + error);
          });
      
  
}