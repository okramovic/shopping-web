/*

- what happens if followed user has same product like me?
     (- there is no way to have same entry in data, even with exact same fields, also imgName will be different)
     - they will remain independent items


- should user be able to add product to all countries/all cities/all shops?
          i think yes, it might be needed in some cases
               - example1: on airplane, EasyJet is in DB as country, but why force to specify it's cities and shops, thats nonsense)
               - example2: Amazon - that would be in DB probably as country, 
                         but user wouldnt give it it's own cities or shops in most cases
     Answer - Yes

getting products from more locations (all countries/all cities/all shops)
     - how should mixed products be ordered on screen? (suppose they'll come from more users)
     - will it be needed to be able to switch their order on screen?

     Answer in file 'all cities-display-structure.js'



*/