$(document).ready(function(){
  $('#email').focus();
});

function doLogin() {
  $.ajax({
    url: "/api/users/login/" + $("#email").val() + "/" + $("#password").val(),
    context: document.body
  }).done(function (res) {
    if(res.result) {
      document.location.href = "/tasks";
    } else {
      $('div.alert-warning').show();
      setTimeout("fadeOut()", 1000);
    }
  });
}

function fadeOut() {
  $('div.alert-warning').fadeOut(1000, 'linear', function(){ $('div.alert-warning').hide()});
}