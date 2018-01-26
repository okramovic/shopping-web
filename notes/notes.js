/* img capt:
     on mobile   http://www.syntaxxx.com/accessing-user-device-photos-with-the-html5-camera-api/
     on web  https://developers.google.com/web/fundamentals/media/capturing-images/

          get a photo from dropbox
          i might need both thumbnails 
              and full pic file   https://www.dropbox.com/developers/documentation/http/documentation#sharing-get_shared_link_file
              in different situations

- should user be able to add product to all countries/all cities/all shops?
          i think yes, it might be needed in some cases
               - example1: on airplane, EasyJet is in DB as country, but why force to specify it's cities and shops, thats nonsense)
               - example2: Amazon - that would be in DB probably as country, 
                         but user wouldnt give it it's own cities or shops in most cases


getting products from more locations (all countries/all cities/all shops)
     - how should mixed products be ordered on screen? (suppose they'll come from more users)
     - will it be needed to be able to switch their order on screen?


user stories:
- i can filter products viewed using text input
- i can choose for each user (in settings menu) if to download his images to my device with their data



TODO

- show followed users in settings
- add button and function to download my pics to device


- prepare html head for PWA
- create manifest.json
- create service worker


- product could turn red for half second or shake itself to indicate user cant change it
- small status bar could appear with announcement whats wrong
- when adding/deleting products and user is not online, create queue of future requests to be sent when app is online
          1) files to be uploaded
          2) files to be deleted
- add small status bar at bottom, that indicate suxess uploading to DBX or removing file from DBX



- on mobile, user can choose to upload picture taken previously, or to take new one with camera (to enable user to store also old pictures)
- if browsing in private mode, show message that all saved data will be deleted when tab is closed (browsers act like that)  https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage

---------------------------------------------------------------------------------------------------

dropbox stuff
     oauth guide    https://www.dropbox.com/developers/reference/oauth-guide
     token etc      https://www.dropbox.com/developers/documentation/http/documentation#oauth2-token
     my DB setup    https://www.dropbox.com/developers/apps/info/hqdb69ima3zv29t
     api explorer   https://dropbox.github.io/dropbox-api-v2-explorer/
     temp link      https://www.dropbox.com/developers/documentation/http/documentation#files-get_temporary_link

     with each API request include header "Authorization: Bearer <YOUR_ACCESS_TOKEN_HERE>"


done:
- save last open locations to loc stor
- i can create account, that gets stored in central db

10 Jan
- only followdees locations get copied into mine, not products (to be able to distinguish who they come from - might be useful later)
          - locations ARE copied - so i can add my own products there     (in case other user would delete that location from his data)
          = products are kept under their users data, they dont get copied

11 Jan
- disallow username 0 (number or string) so there arent bugs with initial unregistered user being stored under key 0 as well
- at some point, users data (products only?) get rewritten by others -> products get deleted?

12 Jan
- i can find other users to follow and follow them
- solved / it doesnt seem to reflect the content unless its refreshed by user

14 Jan
- i can add product (to currently open location)
          - information contains (* are required)
                    product type *
                    product name *
                    description
                    description Long
                    price
                    rating *
                    picture *

15 Jan
- on app start app auto-fetches followdees data (store them on my device local storage)

21 Jan
- i can change my products
- i can delete my products

22 Jan
- user cannot submit new product without picture
- make new-product-form main fields required
- user cannot add item 'all countries'/'all cities'/'all shops' as new location // it would create mess in DB
- make newly added country/city/shop selected one
- when pushing my local country data to MDB, make sure they go without owner field

23 Jan
- its possible to see products from all countries/all cities/all shops at the same time

24 Jan
- after new product submission - reset all form fields and canvas to empty
- use something looking better than annoying alerts (e.g. when i want to modify product thats not mine)
- user can edit and delete products (works again with new way products are displayed)

25 Jan
- loading images from IDB rather than from online source

26 Jan
- 'fetch and push my data' buttons - show them only if user is online
     - also search bar
     - also dropbox button

*/