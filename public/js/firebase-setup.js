// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBn6pmMZ4pgXAJQ1sgoVdZFTSoMqq4j7hY",
  authDomain: "speedelivery-f5885.firebaseapp.com",
  databaseURL: "https://speedelivery-f5885.firebaseio.com",
  projectId: "speedelivery-f5885",
  storageBucket: "speedelivery-f5885.appspot.com",
  messagingSenderId: "295034080018",
  appId: "1:295034080018:web:2481ad9d767ed44a6b81cb",
  measurementId: "G-DHL6HDGQJ1"
};
// Initialize Firebase
var user
var userType
let db

(function() {
  var $login = $('#login');
  var $signOut = $('#sign-out');

  firebase.initializeApp(firebaseConfig);
  db = firebase.database()

  $login.click(function() {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(result) {
      // The signed-in user info.
      window.location.href = "requests.html"
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    })
  })
  $signOut.click(function() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      window.location.href = "index.html"
    }).catch(function(error) {
      // An error happened.
    })
  })

  firebase.auth().onAuthStateChanged(function(u) {
    if (u) {
      user = u
      identifyPersonType()
      .then(result => {
        if (userType == 0)
          displayRequests()
        else if (userType == 1)
          displayManagerRequests().then(results => console.log(results)).catch(err => console.error(err))
      })
      .catch(err => {
        $("#error-toast").toast('show')
        let errorMessage = "There was an error with sending your requests. There error code is: <strong>" + err.code + "</strong>. Please contact us for help."
        $("#error-message").html(errorMessage)
      })
      if (window.location.pathname == "/contactus.html" || window.location.pathname == "/aboutus.html" || window.location.pathname == "/index.html") {
        $("#sign-out").css("display", "block");
        $("#requests").css("display", "block");
        $("#login").css("display", "none");
      }
    }
    else {
      user = undefined
      if (window.location.pathname == "/contactus.html" || window.location.pathname == "/aboutus.html" || window.location.pathname == "/index.html")
        $("#login").css("display", "block");
        $("#sign-out").css("display", "none");
        $("#requests").css("display", "none");
    }
  })

  async function identifyPersonType() {
    let uid = user.uid
    await db.ref('Users/' + uid).once('value').then(function(data) {
      if (data.exists()) {
        if (data.child('account').val() == 1)
          userType = 1
      } else
        userType = 0
    })
    return userType
  }
})()
