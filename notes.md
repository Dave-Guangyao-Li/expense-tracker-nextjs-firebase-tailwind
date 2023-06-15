- [Build a NextJS 13 App with Firebase & Tailwind CSS](https://www.youtube.com/watch?v=uikATllLdRc&t=647s)
- progress: finished
- Add Firebase to your web app, go to project settings, scroll down to your apps, click on the web app, copy the config object, and paste it into your app. put it under app folder in a file called firebase.js
- go to cloud firestore, create a database, add data, make sure to import db from firebase.js, and add data to the database.

```javascript
npm install firebase
```

```javascript
npm i -g create-next-app
npx create-next-app . // np typescript, no eslint, no prettier, with tailwindcss, and app routing, no src folder.

// start up development server
npm run dev

'use client' // page.js nextjs create server side rendered react app by default, this tells it to create a client side rendered app
```
