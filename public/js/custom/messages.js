$(document).ready(function(){
  // init the view
  $(".js-loader").hide();

  Users.init();

  // form: prevent default
  $( "form.js_messages" ).submit(function(event) {
    event.preventDefault();
    return false;
  });

  // events
  $( ".js-all" ).click(function(){
    $(".js-all").hide();
    $(".js-email").parent().show();
  });

  $(".js-to").on("click",".btn-group button.js-delete-email", function(){
    Users.deleteUser($(this).parent());
  });

  $(".js-users-list").on("click","li", function(){
    $user = $("a", this);
    Users.addUser({
      email:$user.attr("email"),
      name:$user.attr("name")
    });
  });

  $("button[type='submit']").click(function(){
    $("._loader").show();
    var emails = [];
    $.each($(".js-user:visible"), function(key, div){
      console.log(div);
      emails.push($(div).attr('email'));
    });

    if(emails.length > 0) {
      $.ajax({
        url: "/api/messages/send",
        data: {
          title: $("#title").val(),
          body: $("textarea").val(),
          emails: emails.join(",")
        },
        method: "POST"
      }).done(function (res) {
        console.log(res);
        if(res.result) {
          $("._notification").show();
          setTimeout('$("._notification").hide()', 2000);
          $("#title").val("");
          $("textarea").val("");
          $(".js-user").hide(100);

        } else {

        }
        $("._loader").hide();
      });
    } else {
      //TODO: display empty list message
    }
    return false;
  });

  $(".js-filter-user").keyup(function(event) {
    console.log(event);
    /** ----- backspace ----- */
    if(event.keyCode === 8) {
      Users.deleteUser($(".js-to .js-user").last());
    }
    /** ----- arrow up or arrow down ----- */
    if(event.keyCode === 40 || event.keyCode === 38) {
      // set direction
      var increment = 1;
      if(event.keyCode === 38) {
        increment = -1;
      }

      // get the users corresponding to the filter
      var $users = $(".js-users-list li:visible");
      // by default we consider that no user is selected
      var nextUser = -1;

      // detect if a selection already exists
      for(var key in $users) {
        var $user = $users.eq(key);
        if($user.hasClass("selected")) {
          $user.removeClass("selected")
          nextUser = parseInt(key) + increment;
          break;
        }
      }

      // move selection
      if(nextUser === -1) {
        $users.first().addClass("selected");
      } else if(nextUser >= 0 && nextUser < $users.length) {
        console.log($users.eq(nextUser));
        $users.eq(nextUser).addClass("selected");
      } else if(nextUser === $users.length) {
        $users.last().addClass("selected");
      }
    }

    /** ----- return ----- */
    if(event.keyCode === 13) {
      // get the selected user
      var $selected = $(".js-users-list li.selected a");
      if($selected.length == 1) {
        Users.addUser({
          email: $selected.attr("email"),
          name : $selected.attr("name")
        });
      }
    }

    /** ----- other keys ----- */
    var filter = $(".js-filter-user").val();

    var $usersList = $(".js-users-list");

    if(filter.length === 0) {
      $usersList.find("li").removeClass("selected");
      Users.hideUsersList();
      return;
    }

    $usersList.show();

    $.each($usersList.find("li a"), function(k, item){
      var $item = $(item);
      var user = $item.attr("name");
      var regexp = new RegExp(filter, 'i');
      var indexUser = user.search(regexp);
      if(indexUser != -1) {
        //var regexp = new RegExp("^" + filter, 'gi');
        user = user.replace(regexp,"<span style='background-color:#337ab7;color:white'>" +
          filter + "</span>");
        $item.html(user + "<br />" + "<span style='color:#BBB'>" + $item.attr("email") + "</span>");
        $item.parent().show();
      } else {
        $item.parent().hide();
      }
    });
    if($(".js-users-list li:visible").length == 0) $usersList.hide();

  });
});

/**
 * adds a user in the to section
 * @param user
 */

var Users = {
  users: [],
  addedUsers: {},
  init: function() {
    // by default set the focus on the search input
    $(".js-filter-user").focus();
    $(".js-add-all").click(function(){Users.addAll()});
  },
  addUser: function addUser(user) {
    if(!this.addedUsers[user.email]) {
      this.addedUsers[user.email] = true;
      this.hideUsersList();
      if($(".js-to div[email='" + user.email + "']").length === 1)
        return;
      $('<div class="btn-group mr5 js-user" email="' + user.email + '">' +
        '<button type="button" class="btn btn-default" aria-expanded="false">' + user.name + '</button>' +
        '<button class="btn btn-primary js-delete-email" type="button">' +
        '<span class="glyphicon glyphicon-remove" aria-hidden="false"></span>' +
        '</button>' +
        '</div>').insertBefore($('.src'));
    } else {
      // TODO: show tooltip notification
    }
  },
  deleteUser: function (element) {
    var email = $(element).attr("email");
    delete this.addedUsers[email];
    $(element).hide(100, function(){
      $(this).remove();
    });
    $(".js-filter-user").focus();
  },
  addAll: function() {
    for (var key in this.users) {
      this.addUser({
        email: this.users[key].email,
        name: this.users[key].fname + " " + this.users[key].lname
      });
    }
    $(".js-filter-user").focus();
  },
  hideUsersList: function() {
    // empty filter, reset user selection, hide the list
    $(".js-filter-user").val("");
    $(".js-users-list li").removeClass("selected");
    $(".js-users-list").hide();
  }
}
