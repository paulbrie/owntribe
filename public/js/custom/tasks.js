// defines if pressing the N key should toggle the add task form
// this should not happen if one of the form elements has focus
var keyToggle = true;

function setTaskStatus(node) {
  $.ajax({
    url: "/api/tasks/set/" + $(node).attr("taskid") + "/" + $(node).attr("action")
  }).done(function (res) {
    if(res.result) {
      $(node) .removeClass("btn-primary")
        .removeClass("btn-danger")
        .addClass("btn-info")

      setTimeout(function(){
        $(node).parent().parent().animate({
          height: 0
        }, 300, function(){
          $(this).remove();
          populateBadges();
        });
      }, 300);

    } else {
      alert("Task status could not be changed!");
    }
  });
}

function deleteHistory() {
  $.ajax({
    url: "/api/tasks/deletedone"
  }).done(function (res) {
    if(res.result) {
      $("#done .list-group:visible").remove();
    } else {
      alert("History could not be deleted!");
    }
    $(".js-loader").hide();
  });
}

function toggleAddForm() {
  if($("#add").css("position") == "" || $("#add").css("position") == "static") {
    $("#add").css("position","absolute");
  } else if($("#add").css("position") == "absolute"){
    $("#add").css("position","");
    $("#title").focus();
  }
}

function populateBadges() {
  $(".js-filter-all span").text($(".js-task").length);
  $(".js-filter-assigned span").text($(".js-task[taskassignee!='" +userid + "']").length);
  $(".js-filter-mine span, .todo").text($(".js-task[taskassignee='" +userid + "']").length);
  $.each($(".badge"), function(k, v) {
    console.log(v)
    if ($(v).text() > 0) {
      $(v).show();
    } else {
      $(v).hide();
    }
  });
}

$(document).ready(function() {
  // by default display the tasks assigned to the main user
  setTimeout('$(".js-filter button").first().click()', 20);
  populateBadges();


  $('#new').click(function () {
    toggleAddForm();
  });

  $("#title, #description").focusin(function(){
    keyToggle = false;
  });

  $("#title, #description").focusout(function(){
    keyToggle = true;
  });

  $(".js-filter button").click(function(){
    $(".js-filter button").removeClass("btn-primary");
    $(".js-filter button").addClass("btn-default");
    $(this).addClass("btn-primary");
    if($(this).hasClass("js-filter-mine")) {
      $.each($(".js-task"),function(key, value){
        if($(value).attr("taskassignee") == userid) {
          $(value).show();
        } else {
          $(value).hide();
        }
      });
    } else if ($(this).hasClass("js-filter-assigned")) {
      $.each($(".js-task"),function(key, value){
        if($(value).attr("taskassignee") != userid) {
          $(value).show();
        } else {
          $(value).hide();
        }
      });
    } else {
      $(".js-task").show();
    }
  });

  $(window).keydown(function(event) {
    // if typing N
    if(event.keyCode  == 78) {
      if(keyToggle) {
        toggleAddForm();
      }
    }
  });

  var urlDone = '/api/tasks/get/done';

  $("[data-toggle='tabajax']").click(function(e) {
    $("#done .loader").css("display", "block");
    $.get(urlDone, function(data) {
      if(data.result) {
        // mask the loader
        $("#done .js-loader").css("display", "none");
        // empty the list before refresh
        $.each($("#done .list-group:visible"), function() {
          if($(this).css("display") != "none") $(this).remove();
        });
        var rows = data.data;
        var template = $("#done .js-template");
        // populate
        $.each(rows, function(item){
          $("button", template).attr("taskid", rows[item].id);
          $("button", template).attr("action", "new");
          $("h4", template).text("#" + rows[item].id + " " + rows[item].name);
          $("p", template).text(rows[item].description);
          $("#done").append($(template).html());
        });
      } else {
        alert("An error has occured!");
        $("#done .js-loader").css("display", "none");
      }
    });
    $(this).tab('show');
    return false;
  });

  $(".js-delete-history").click(function(){
    $("#done .js-loader").show();
    setTimeout(deleteHistory, 1000);
  })
});