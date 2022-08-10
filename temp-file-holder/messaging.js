// // Your web app's Firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyBn6pmMZ4pgXAJQ1sgoVdZFTSoMqq4j7hY",
//   authDomain: "speedelivery-f5885.firebaseapp.com",
//   databaseURL: "https://speedelivery-f5885.firebaseio.com",
//   projectId: "speedelivery-f5885",
//   storageBucket: "speedelivery-f5885.appspot.com",
//   messagingSenderId: "295034080018",
//   appId: "1:295034080018:web:2481ad9d767ed44a6b81cb",
//   measurementId: "G-DHL6HDGQJ1"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);



// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();
// Add the public key generated from the console here.
messaging.usePublicVapidKey("BGr3dnhLmqcNTG51gk6ht18w_zAc0YHVTdAi6VKnr_JssS9KbaNj1zStWehEQzU92pYYoc91UJHeI-U6zknaO5E");

// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken().then((currentToken) => {
  if (currentToken) {
    console.log("have a token: here u go!!!");
    console.log(currentToken);
    // sendTokenToServer(currentToken);
    // updateUIForPushEnabled(currentToken);
  } else {
    // Show permission request.
    console.log('No Instance ID token available. Request permission to generate one.');
    // Show permission UI.
    // updateUIForPushPermissionRequired();
    // setTokenSentToServer(false);
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // showToken('Error retrieving Instance ID token. ', err);
  // setTokenSentToServer(false);
});
// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
  messaging.getToken().then((refreshedToken) => {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    setTokenSentToServer(false);
    // Send Instance ID token to app server.
    sendTokenToServer(refreshedToken);
    // ...
  }).catch((err) => {
    console.log('Unable to retrieve refreshed token ', err);
    showToken('Unable to retrieve refreshed token ', err);
  });
});

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // ...
});
