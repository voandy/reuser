# reuser

![reuser logo](public/images/others/reuser-logo-green-small.png)

# Features

https://www.reuser.xyz/

The following pages are all responsive and work on most mobile devices as well as modern desktop browsers (Chrome, Firefox, Safari).
- [Homepage](https://www.reuser.xyz/)
- [Map](https://www.reuser.xyz/map)
- [Listings page](https://www.reuser.xyz/view-listing?id=5cbc59742a14973148d13862)
- [Profile page](https://www.reuser.xyz/profile?id=5cbc59652a14973148d1384a)
- [Sign-up Page](https://www.reuser.xyz/sign-up)
- [Log-in Page](https://www.reuser.xyz/login)

## Browsing Website/Listings

#### Map
- From the [homepage](https://www.reuser.xyz/), users can search for listings in their area by entering the address or suburb into the search bar (try "Parkville "), this will direct them to a [map](https://www.reuser.xyz/map) showing individual listings as pins.
- A dynamically updating bar on the right of the map shows the ten closest listings in order or proximity.
- Clicking a listing on the bar will zoom in on the pin and open an info window with more details.
- Clicking the title of the info window will direct the user to a detailed listing page.

#### Listings/Profiles
- The [listings page](https://www.reuser.xyz/view-listing?id=5cbc59742a14973148d13862) shows the details of one listing and a map with a single pin indicating its location.
- A sidebar on the left shows the user who posted the listing along with their 5 most recent reviews.
- Clicking on the name of the listing's poster or any of the reviewers will take you to a detailed [profile page](https://www.reuser.xyz/profile?id=5cbc59652a14973148d1384a).
- The profile page shows the user's details as well as all their active listings and reviews of them.

### User Accounts

#### Signing-up
- New users can create an account by clicking the "become a reuser" button on the home page or clicking login on the top right of the navigation bar and selecting "sign-up."
- The [sign-up page](https://www.reuser.xyz/sign-up) validates input ensuring that a valid email address is entered (follows a valid format and doesn't already exist in the database) and matching passwords of at least 8 characters are entered.
- After signing-up, a new user account is added to the database along with a hashed and salted password. The user is then directed to the log-in page.

#### Logging-in
- Users can log-in on the [log-in page](https://www.reuser.xyz/login) or by clicking "log-in" on the navigation bar which is available on every page.
- Once the user's credentials are authenticated by passport an express-session is created to keep track of the user.
- You can verify that you are logged-in by viewing the placeholder [dashboard](https://www.reuser.xyz/dashboard) (not yet implemented).
- Further features for logged-in users are yet to be implemented.

# Views, Routes, Controllers & Models

#### Maps, Listings, Profile

Views
- default.pug
- nav.pug
- map.pug
- view-listing.pug
- profile.pug

Routes
- Get specific user: /user/id/:id
- Get specific listing: /listing/id/:id
- Get all listings: /listing
- Get all listings made by specific user: /listing/userId/:userId
- Get all reviews of specific user: /review/userId/:userId

Controllers
- user-controller.js
- listing-controller.js
- review-controller.js

Models
- user
- listing
- review

#### User Accounts

Views
- default.pug
- nav.pug
- sing-up.pug
- login.pug

Routes
- Get user by email: /user/email/:email
- Get user by id: /user/id/:id
- Post a new user: /user

Controllers
- user-controller.js

Models
- User
