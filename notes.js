
// on mobile   http://www.syntaxxx.com/accessing-user-device-photos-with-the-html5-camera-api/
//  on web  https://developers.google.com/web/fundamentals/media/capturing-images/
/**
 *        try Image object - new Image()
 * 
 */

/*

user stories:

- app auto-fetches followdees data (store them on my device local storage) - when? on app start or login/registration







- user can delete products



to do
- on mobile, user can choose to upload picture taken previously, or to take new one with camera (to enable user to store also old pictures)
- if browsing in private mode, show message that all saved data will be deleted when tab is closed (browsers act like that)  https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage




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


*/