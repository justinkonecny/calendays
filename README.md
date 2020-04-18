# Calendays
### React Web App
Web application used for shared event planning. Uses Firebase for user authentication and storing user data (events, networks, profile). Once authenticated and verified, users can create events to be displayed on their calendar. Users can also create named networks, which consist of groups of two or more users.

## Project Breakdown
### screenshots/
* This folder contains a series of screenshots taken throughout the development of the application
### src/
* `index.css`: css for the index page
* `index.js`: Javascript for the index page; initializes and configures Firebase for the application; renders the main `App` component in a `BrowserRouter`
* `MainRoutes.tsx`: configures the routes for the application
  * `https://calendays.jkonecny.com/`->`Login`
  * `https://calendays.jkonecny.com/home`->`Home`
  * `https://calendays.jkonecny.com/reset`->`Reset`
### src/components/calendar/...
* `Calendar.js`: component that given user events, renders the main calendar for the current week of the month; additional weeks are rendered as the user changes the displayed week
* `CalendarDay.js`: component used by `Calendar`; represents one 'day' in week (one calendar column); renders given list of events at their specified times
* `NewEvent.js`: component to allow the user to create a new event; handles updating the Firebase store with newly created event
### src/components/common/...
* `DropdownDate.js`: dropdown component used for selecting from a list of date
* `DropdownTime.js`
* `InputField.js`
### src/components/main/...
* `App.tsx`
* `Constants.js`
* `Home.js`
* `Login.tsx`
* `NavBar.js`
* `Reset.js`
* `User.js`
### src/components/networks/...
* `Group.js`
* `Networks.js`
* `NewNetwork.js`
### src/components/profile/...
* `Profile.js`
### src/data/...
* `dataStructures.json`
* `DbConstants.js`
* `NetworkGroup.js`
* `UserProfile.js`


## User Interface
### Login Screen
![Alt text](screenshots/readme/login.png "Login")

### Landing Screen
![Alt text](screenshots/readme/landing.png "Landing")

### Event Creation Screen
![Alt text](screenshots/readme/event_create.png "Event Creation")

### Network Creation Screen
![Alt text](screenshots/readme/network_create.png "Event Creation")
