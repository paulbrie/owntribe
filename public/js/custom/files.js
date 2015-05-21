var uploadButton;
var sendButton;
var actionsButton;
var fileElem;

$(document).ready(function(){
  loadFiles();
  addEventsListeners();
});

function addRowHandlers() {
  //show and hide share button
  $('.file-row').on('mouseover', function(){
    var $this = $(this);
    $this.find('.share .label-share').show();
  }).on('mouseout', function(){
    var $this = $(this);
    $this.find('.share .label-share').hide();
  });

  //add click event on share button
  $('.share span').on('click', function(){
    shareFiles(this);
  });

  $('.get-ico').on('click', function(event){
    event.stopPropagation();
    getLink(this);
  });
}

function getFiles() {
  return $.ajax({
    url: 'api/files/get'
  });
}

function rederFiles(files) {
  var html = [];

  if (files.length === 0) {
    $("#files tbody").html("<h3>This folder is empty</h3><p>Hit Select files to upload your files</p>");
    return;
  }

  for(var file in files) {
    var shareText = 'Share';
    var shareStatus = '';
    var getIco = '';
    var row = '';

    if (files[file].share == 1) {
      shareText = 'Unshare';
      shareStatus = 'shared';
      getIco = '<i class="fa fa-clipboard get-ico" data-link= "http://' + window.location.host + '/files/s/' + files[file].hash + '" title="Get link" hidden=""></i>';
    }

    row += "<tr class='file-row' data-file='"+files[file].id+"'>";
    row += "<td class='ar file-remove'>";
    row += "<button type='button' class='btn btn-danger' onclick='deleteFile("+files[file].id+");'>Delete</button>";
    row += "</td>";
    row += "<td>";
    row += "<a href='files/download/" + files[file].id +"/"+files[file].name + "'>"+files[file].name+"</a>";
    row += "</td>"
    row += "<td class='ar "+shareStatus+"'>"+ files[file].size+"</td>";
    row += "</td>";
    row += "<td class='ar "+shareStatus+"'>"+ files[file].size+"</td>";
    row += "<td class='ar "+shareStatus+"'>"+ files[file].mimetype+"</td>";
    row += "<td class='ar "+shareStatus+"'>"+ files[file].created+"</td>";
    row += "<td class='ar'>"+getIco+"</td>";
    row += "<td class='ar share'>";
    row += "<span data-action='"+shareText.toLowerCase()+"'data-hash='"+files[file].hash+"' data-file='"+files[file].id+"' data-filename='"+files[file].name+"' class='label label-default label-share'>"+shareText+"</span>";
    row += "</td>";
    row += "</tr>";

    html.push(row);
  }

  $("#files tbody").html(html.join(''));
  addRowHandlers();
}

function loadFiles() {
  var action = getFiles();

  action.done(function(result) {
    toggleActions(result.data.length);
    rederFiles(result.data);
  });
}

function addEventsListeners() {
  uploadButton = document.getElementById("upload-button");
  sendButton = document.getElementById("send-button");
  actionsButton = document.getElementById("actions-button");
  fileElem = document.getElementById("fileElem");

  uploadButton.addEventListener("click", function(event){
    fileElem.click();
  });

  actionsButton.addEventListener("click", function(event){
    $(".file-remove").toggle();
  });

  fileElem.addEventListener("change", function(event) {
    handleFiles(fileElem);
  });

  //hide text link
  $(document).click( function(){
    $('.link-box').hide();
  });
}

function handleFiles(fileSelect) {
  if(fileSelect.files && fileSelect.files.length > 0) {
    var count = 0;
    var files = fileSelect.files;
    var filesNr = files.length;

    // Update button text.
    uploadButton.innerHTML = 'Uploading...';

    // Loop through each of the selected files.
    for (var i = 0; i < filesNr; i++) {
      var file = files[i];
      // Add the file to the request.
      sendFormFile(file, function() {
        count++;
        if  (count == filesNr) {
          uploadButton.innerHTML = 'Select files';
        }
      });
    }
  }
}

function sendFormFile(file, callback) {
  var stringFileName = file.name + Math.floor(Date.now() / 1000);

  // Set up the request.
  var formData = new FormData();
  formData.append('filesselect', file, file.name);

  //create unique hash code for uploaded file
  file.hash = stringFileName.hashCode();

  //add progress-bar ui
  $('.progress-wrapper').append('' +
    '<div class="progress">' +
    '<div class="progress-bar" file-name="'+file.hash+'" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">'+file.name+'</div>' +
    '</div>'
  );

  var xhr = new XMLHttpRequest();
  xhr.upload.onprogress = (function(event) {
    updateProgress(event, file)
  });

  xhr.upload.onloadend = (function(event){
    transferComplete(event, file, function(){
      callback();
    });
  });

  xhr.open('POST', 'api/files/add', true);

  // Set up a handler for when the request finishes.
  xhr.onload = function () {
    if (xhr.status === 200) {
      // File(s) uploaded.
      loadFiles();
      // delete filesselect.files;
    } else {
      console.log(xhr);
      alert('An error occurred!');
    }
  };

  // Send the Data.
  xhr.send(formData);
}

// progress on transfers from the server to the client (downloads)
function updateProgress (event, file) {
  if (event.lengthComputable) {
    var percentComplete = event.loaded / event.total * 100;
    $('.progress-bar[file-name="'+file.hash+'"]').width(percentComplete+'%');
  } else {
    // TODO ERROR HANDLER Unable to compute progress information since the total size is unknown
  }
}

function transferComplete(event, file, callback) {
  setTimeout(function(){
    $('.progress-bar[file-name="'+file.hash+'"]').parent().hide(1000).remove();
    callback();
  }, 1500);
}

//creates a unique hashcode for each uploaded file
String.prototype.hashCode = function(){
  var hash = 0;

  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function toggleActions(itemsNr) {
  if ($("#files > tbody > tr").length > 1 || itemsNr > 0) {
    $('.file-actions').css("display", 'block');
  } else {
    $('.file-actions').css("display", 'none');
    $('.file-remove').css("display", 'none');
  }
}

function deleteFile(fileId) {
  $.ajax({
    type: "POST",
    data: {fileId: fileId},
    url: "api/files/remove",
    success: function(result){
      if (result.result) {
        if ($("#files > tbody > tr").length > 1) {
          $('#files tr[data-file="'+fileId+'"]').remove();
        } else {
          //TODO AVOID ANOTHER API CALL FOR EMPTY LIST
          loadFiles();
        }
      } else {
        //TODO API ERROR HANDLER
      }
    },
    error: function(result) {
      //TODO AJAX ERROR HANDLER
    }
  });
}

function shareFiles(elem) {
  var fileId = $(elem).attr('data-file');
  var dataAction = $(elem).attr('data-action');
  var action;

  if (dataAction === 'share') {
    action = 1;
  } else {
    action = 0;
  }

  $.ajax({
    type: "POST",
    data: {fileId: fileId,
    action: action},
    url: "api/files/share",
    success: function(result){
      if (result.result) {
        loadFiles();
      } else {
        //TODO API ERROR HANDLER
      }
    },
    error: function(result) {
      //TODO AJAX ERROR HANDLER
    }
  });
}

function getLink(elem) {
  $('.link-box').hide();

  var link = $(elem).attr('data-link');
  var currentElem = $(elem).parent();

  if (currentElem.find('.link-box').length == 0) {
    $(currentElem).append('' +
      '<div class="link-box">' +
        '<span class="label label-info">Link to your file</span>'+
        '<input type="url" readonly class="form-control share-link" value="'+link+'">' +
      '</div>' +
    '').find('input').select();
  } else {
    currentElem.find('.link-box').show().find('input').select();
  }
}