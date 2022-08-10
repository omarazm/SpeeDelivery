//Opens new request modal
function openModal() {
  if ($('#termsModal').hasClass('show')) {
    $("#termsModal").modal('hide')
    setTimeout(function() {$("#newRequestModal").modal('show')}, 150)
  } else
    $("#newRequestModal").modal('show');
}
function closeModal() {
  $('#newRequestModal').on('hidden.bs.modal', function (e) {
    $(this)
    .find("select").val("heb").end()
    .find("input").val('').end()
    .find("textarea").val('Enter Items Here... ').end()
    .find("input[type=checkbox], input[type=radio]").prop("checked", "").end();
  })
}
function requestToS() {
  setTimeout(function() {$("#termsModal").modal('show')}, 150)
}
function openRequestDetails() {
    $('#displayRequestModal').modal('show');
}
function closeRequestDetails() {
    $('#displayRequestModal').modal('hide');
}

function getSelectedOption(sel) {
    var opt;
    for ( var i = 0, len = sel.options.length; i < len; i++ ) {
        opt = sel.options[i];
        if ( opt.selected === true ) {
            break;
        }
    }
    return opt;
}
function createRequestDiv (divNumber, requestNum, date, store, item, address, cancelled, completed, phoneNumber, username, testMode) {
  let requestString = requestNum.slice(1)
  console.log(requestString);
  let template = '<div class="row p-3 m-3 justify-content-between requests rounded-pill" id="request-' + requestString + '">' +
                 '  <div class="col">' + requestNum + '</div>' +
                 '  <div class="btn-group-toggle col-2 mr-5 mr-sm-3" id="requestToggler-' + divNumber + '" onclick="completeRequest(this, ' + "'" + requestString + "'" + ')">' +
                 '    <div class="pretty p-switch p-fill col-1 mr-5 my-auto completedSwitch">' +
                 '      <input type="checkbox" id="requestCheck-' + divNumber + '" check>' +
                 '      <div class="state p-info"><label></label></div>' +
                 '    </div>' +
                 '  </div>' +
                 '  <svg class="bi bi-chevron-right my-auto" id="modalToggle-' + divNumber + '" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                 '    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z" clip-rule="evenodd"/>' +
                 '  </svg> ' +
                 '</div>';
  if (cancelled) {
    $("#cancelledRequests").append(template)
    // if (userType == 1)
    document.getElementById('request-' + requestString).classList.add('requests-disabled')
    document.getElementById('requestToggler-' + divNumber).remove()
  } else {
    completed ? $("#completedRequests").append(template) : $("#uncompletedRequests").append(template)
    if (userType != 1)
      document.getElementById('requestToggler-' + divNumber).remove()
  }
  if (completed)
    document.getElementById('requestCheck-' + divNumber).setAttribute('checked', true)
  $("#modalToggle-" + divNumber).click(() => {
    $('#date').text(date);
    $('#requestNum').text(requestNum);
    $('#store').text(store);
    $('#items').text(item);
    $("#address").text(address);
    $("#phoneNumber").text(phoneNumber);
    userType == 1 ? $("#username").text(username) : $("usernameRow").css("display", "none")
    if (cancelled)
      $("#cancelledRequest").prop("disabled", true)
    $('#displayRequestModal').modal('show');
  })
}
function clearItems() {
  itemsList = document.getElementById("itemsList").value;
  if (itemsList == "Enter Items Here... ") {
    document.getElementById("itemsList").value = '';
  }
  else {
  }
}

function contactUsPage() {
  window.location = "contactus.html";
}
function aboutUsPage() {
  window.location = "aboutus.html";
}
function requestsPage() {
  window.location = "requests.html";
}
