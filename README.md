# Punk_bnb

Clone (native app for mobile) of airbnb app build with ionic with angular js framework.

## Installation

> Nodejs

> npm install -g ionic

## New Project

> ionic start

> run ionic serve [which run ng serve behind the scene]

## VS code Extensions for make your life easier

> Angular Essentials

## ionic with CDN

> [Guide Here](https://ionicframework.com/docs/installation/cdn)

## Command's

> ionic generate [gererate page or services or etc...]

## Things in use

> ionic gererate page recipes

> ionic generate page recipes/recipe-detail

> ionic generate service recipes/recipes

> ionic generate component recipes/recipe-item

## Useful Links

> [Capacitor](https://capacitor.ionicframework.com/) - Check docs for step's

## Complie to Native Platform

> Android Studio / Xcode [Download Setup] as build tool

> ionic capacitor add android/ios [run this after finish Android Studio and Tools] in project directory

    - ng build [if capacitor gives error] [do this before you turn your web app to mobile] **use native cmd for ng build or it might hang your IDE**

> Change Capacitor.config.json

```javaScript
{
    "appId": "com.pure.recipe.ionic", // this must be change
    "appName": "pure_app",
    "bundledWebRuntime": false,
    "webDir": "www"
}
```

> ionic capacitor copy android [will copy your www folder to android native app]

> ionic capacitor run android [all in one which run all above cmd line by line]

> ionic capacitor run android -l [all in one which run all above cmd line by line in the Live Mode]

> ionic capacitor run ios [all in one which run all above cmd line by line]

> ionic capacitor run ios -l [all in one which run all above cmd line by line in the Live Mode]

## App Require Pages

> ionic generate page auth

> ionic generate page places

> ionic generate page places/discover

> ionic generate page places/offers

> ionic generate page places/offers/new-offer

> ionic generate page places/offers/edit-offer

> ionic generate page places/discover/place-detail

> ionic generate page places/offers/offer-bookings

> ionic generate page bookings

> ionic generate service places/places

> ionic generate service auth/auth

> ionic generate guard auth/auth

> ionic generate component bookings/create-booking-model

> ionic generate component places/offers/offer-item

> ionic generate component map/map-box

> ionic gererate service map/map

> ionic generate component shared/pickers/location-picker

> ionic generate component shared/map-modal

> ionic generate component shared/pickers/image-picker

## Firebase Setup

> Create an app

> Go to Database Tab

> Start Real Time Database

> Use that API Base URL for Http Request

## Mapbox API

> mapbox.com

> [check steps](https://angularfirebase.com/lessons/build-realtime-maps-in-angular-with-mapbox-gl/)

## Keep In Mind

> Check for App Permission withen respective native app folder/directory [check capacitor docs]

- android
  - Android.manifest.xml

## PWD Element for web Camera

> npm install --save @ionic/pwa-elements

## [Image Upload Firebase](https://github.com/firebase/firebase-tools)

> npm install -g firebase-tools

> run `firebase init` root of the project

> choose `function`

> select `project name`

> choose `javaScript`

> Do you want to use ESLint to catch probable bugs and enforce style? (y/N) : N

> Do you want to install dependencies with npm now? : Yes

it will give you a brand new folder with `index.js` file

> check for `project id` in the firebase console and replace project id in index.js file code

> add some addition dependency to package.json of cloud function folder

> now navigate to the function folder and re run `npm install` there.

> now back to root of the project and run `firebase deploy`

> check function tab in firebase console there must be an EndPoint for image upload

## Authentication Firebase

> Enable Authentication on Firebase Control Panel

> [Restful Api](https://firebase.google.com/docs/reference/rest/auth/)

> Database rules

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "bookings": {
      ".indexOn": ["userId"]
    }
  }
}
```

> Storage rules

```javascript
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
```

> Run After all changes firebase deploy
