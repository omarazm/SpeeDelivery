Date.prototype.monthNames = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];
Date.prototype.getMonthName = function() {
  return this.monthNames[this.getMonth()];
};
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

let requestNum = 0
let orderCount = 0
let TESTING = true
let orderCountRef
let requestsRef

// Determines if we are in testing mode or not.
(function() {
  console.log("this works");
  if (TESTING) {
    requestsRef = 'Test-Requests/'
    orderCountRef = db.ref('Test-Order-Count')
    document.getElementById('testIndentifer').innerHTML = "Testing - Requests"
  } else {
    requestsRef = 'Requests/'
    orderCountRef = db.ref('Order-Count')
  }
})()

// Displays User and Manager Requests & Submits Requests
async function submitRequest() {
  if (orderCount === 0)
    await getOrderCount().then(result => {result}).catch(err => console.error(err))
  else
    orderCount = stringify(orderCount)
  let ref = db.ref(requestsRef + orderCount)

  // List of data gathered: Phone number, date, store, item, address
  let phoneNumber = document.getElementById("newPhoneNumber").value,
      date        = new Date(),
      today       = date.getMonthName() + ' ' + date.getDate() + ', ' + date.getFullYear() + ', ' + formatAMPM(date),
      store       = (getSelectedOption(document.getElementById("stores"))).text,
      item        = document.getElementById("itemsList").value,
      address     = document.getElementById("newAddress").value;

  ref.set({
    username: user.displayName,
    email: user.email,
    uid: user.uid,
    phone_num: phoneNumber,
    date: today,
    store: store,
    items: item,
    completed: false,
    cancelled: false,
    address: address
  }).then((result) => {
    // The signed-in user info.
    let successMessage = "Your request was successfully submitted."
    $("#success-message").html(successMessage)
    $("#success-toast").toast('show')
  }).catch((error) => {
    // Handle Errors here.
    let errorMessage = "There was an error with sending your requests. There error code is: <strong>" + error.code + "</strong>. Please contact us for help."
    $("#error-message").html(errorMessage)
    $("#error-toast").toast('show')
  })
  updateOrderCount().then(result => console.log(result)).catch(err => console.error(err))
}
function displayRequests() {
  // Connects to the correct Node in the Firebase Database
  let ref = db.ref(requestsRef);
  ref.orderByChild("uid").equalTo(user.uid).on('child_added', (snapshot => {
    let requests    = snapshot.val()
        address     = requests.address,
        date        = requests.date,
        store       = requests.store,
        items       = requests.items,
        cancelled   = requests.cancelled,
        completed   = requests.completed,
        phoneNumber = requests.phone_num;
    createRequestDiv(requestNum++, '#' + snapshot.key, date, store, items, address, cancelled, completed, phoneNumber, null)
  }), (err => {
    if (error) {
      // The write failed...
      $("#error-toast").toast('show')
      let errorMessage = "There was an error with recieving your requests. There error code is: <strong>" + error.code + "</strong>. Please contact us for help."
      $("#error-message").html(errorMessage)
    }
  }))
}
async function displayManagerRequests() {
  let ref = db.ref(requestsRef)
  await ref.orderByKey().once('value', (snapshots => {
    snapshots.forEach(snapshot => {
      let request     = snapshot.val()
          address     = request.address,
          date        = request.date,
          store       = request.store,
          items       = request.items,
          cancelled   = request.cancelled,
          completed   = request.completed,
          phoneNumber = request.phone_num,
          username    = request.username;
      createRequestDiv(requestNum++, '#' + snapshot.key, date, store, items, address, cancelled, completed, phoneNumber, username)
    })
  }))
}

function completeRequest(toggle, requestNum) {
  let toggled = $(toggle.children[0].children[0]).prop('checked')
  let ref = db.ref(requestsRef + requestNum)
  if(toggled) {
    ref.update({
      completed: true
    })
    document.getElementById('completedRequests').appendChild(document.getElementById('request-' + (requestNum)))
  } else {
    ref.update({
      completed: false
    })
    document.getElementById('uncompletedRequests').appendChild(document.getElementById('request-' + requestNum))
  }
}
function cancelRequest() {
  closeRequestDetails()
  let requestID = document.getElementById('requestNum').innerHTML.slice(1)
  let request = document.getElementById('request-' + requestID)
  request.classList.add('requests-disabled')
  $("#cancelledRequest").prop("disabled", true)
  document.getElementById('cancelledRequests').appendChild(request)
  let ref = db.ref(requestsRef + requestID)
  ref.update({
    cancelled: true
  }).then((result) => {
    // The signed-in user info.
    // console.log("you cancelled a request successfully");
    let successMessage = "Your request was successfully cancelled."
    $("#success-message").html(successMessage)
    $("#success-toast").toast('show')
    // document.getElementById('cancelledRequests').appendChild(document.getElementById('request-' + (requestNum)))
  }).catch((error) => {
    // Handle Errors here.
    $("#error-toast").toast('show')
    let errorMessage = "There was an error with cancelling your requests. There error code is: <strong>" + error.code + "</strong>. Please contact us for help."
    $("#error-message").html(errorMessage)
  })
}

// Toggles Completed & Cancelled Requests.
function toggleCompletedRequest() {
  if ($("#completedChevron").css("transform") == 'none')
    $("#completedChevron").css("transform","rotate(90deg)")
  else
    $("#completedChevron").css("transform","" )
}
function toggleCancelledRequest() {
  if ($("#cancelledChevron").css("transform") == 'none')
    $("#cancelledChevron").css("transform","rotate(90deg)")
  else
    $("#cancelledChevron").css("transform","" )
}

// Helper methods for determining order count
async function getOrderCount() {
  await orderCountRef.once('value').then((snapshot => {orderCount = stringify(snapshot.val())}))
  return orderCount
}
async function updateOrderCount() {
  let result
  orderCount++
  await orderCountRef.set(orderCount).then(refResult => {result = refResult}).catch(err => console.error(err))
  return result
}
function stringify(orderCount) {
  return ('00000' + orderCount).slice(-6);
}
