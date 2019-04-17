const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({width:'toggle'},350);
}

const sendAjax = (action, data) => {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: (result, status, xhr) => {
      $("#domoMessage").animate({width:'hide'},350);

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });        
}

//check for newest tweed
const getUpdates = () => {
  $.ajax({
    cache: false,
    type: "GET",
    url: '/updates',
    dataType: "json",
    success: (result, status, xhr) => {
      console.dir(result);
      
      //check if tweed has any info
      if(!result.id) {
        return;
      }
      
      //check if we already are displaying a tweed with this id
      const added = document.getElementById(result.id);
      
      //if not, add it
      if(!added) {
        //create new div to hold tweed
        const div = document.createElement('div');
        //add id so we can track if we already have this one
        div.id = result.id;
        div.classList.add('domo');
        
        //add the user's name
        const user = document.createElement('h3');
        user.textContent = result.name;
        user.classList.add('domoName');
        
        //add the user's tweed message
        const tweed = document.createElement('h3');
        tweed.textContent = result.tweed;
        tweed.classList.add('domoAge');
        
        //attach to our new tweed div
        div.appendChild(user);
        div.appendChild(tweed);
        
        //grab domo div
        const list = document.querySelector('#domos').children[0];
        //insert at the top so it's the first displayed
        list.insertBefore(div, list.firstChild);
      }
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  }); 
};

$(document).ready(() => {
  $("#signupForm").on("submit", (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
      handleError("RAWR! Passwords do not match");
      return false;           
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

    return false;
  });

  $("#loginForm").on("submit", (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
      handleError("RAWR! Username or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

    return false;
  });
  
  //if on app page
  const tweeds = $('#domos');
  if(tweeds) {
    //poll for updates every 5 seconds
    setInterval(getUpdates, 5000);
  }
});