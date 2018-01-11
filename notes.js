
// on mobile   http://www.syntaxxx.com/accessing-user-device-photos-with-the-html5-camera-api/
//  on web  https://developers.google.com/web/fundamentals/media/capturing-images/
/**
 *        try Image object - new Image()
 * 
 */

/*

user stories:

- only followdees locations get copied into mine, not products (to be able to distinguish who they come from - might be useful later)
          - locations ARE copied - so i can add my own products there     (in case other user would delete that location from his data)
          = products are kept under their users data, they dont get copied
- i can find other users to follow and follow them
- app auto-fetches followdees data (store them on my device local storage) - when? on app start or login/registration
- i can add product (to currently open location)
          - information contains
                    product type *
                    product name *
                    description
                    price
                    rating *
                    






- user can delete products



to do

- if browsing in private mode, show message that all saved data will be deleted when tab is closed (browsers act like that)  https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage
- disallow username 0 (number or string) so there arent bugs with initial unregistered user being stored under key 0 as well



done:
- i can create account, that gets stored in central db
- at some point, users data (products only?) get rewritten by others -> products get deleted?





*/