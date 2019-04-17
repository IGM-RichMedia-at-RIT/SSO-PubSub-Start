"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var sendAjax = function sendAjax(action, data) {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: function success(result, status, xhr) {
      $("#domoMessage").animate({ width: 'hide' }, 350);

      window.location = result.redirect;
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });
};

var getUpdates = function getUpdates() {
  $.ajax({
    cache: false,
    type: "GET",
    url: '/updates',
    dataType: "json",
    success: function success(result, status, xhr) {
      console.dir(result);

      if (!result.id) {
        return;
      }

      var added = document.getElementById(result.id);

      if (!added) {
        var div = document.createElement('div');
        div.id = result.id;
        div.classList.add('domo');

        var user = document.createElement('h3');
        user.textContent = result.name;
        user.classList.add('domoName');

        var tweed = document.createElement('h3');
        tweed.textContent = result.tweed;
        tweed.classList.add('domoAge');

        div.appendChild(user);
        div.appendChild(tweed);

        var list = document.querySelector('#domos').children[0];
        console.log(list);
        list.insertBefore(div, list.firstChild);
      }
    },
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });
};

$(document).ready(function () {
  $("#signupForm").on("submit", function (e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
      handleError("RAWR! Passwords do not match");
      return false;
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

    return false;
  });

  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
      handleError("RAWR! Username or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

    return false;
  });

  var tweeds = $('#domos');

  if (tweeds) {
    setInterval(getUpdates, 5000);
  }
});
