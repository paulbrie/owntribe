/**
 * Created by Mihai Sampaleanu on 5/21/2015.
 */

$(document).ready(function(){
  load();
});

function load() {
  var students = getStudents();

  students.done(function (result) {
    var data = result.data;
    renderStudents(data);
  });
}

function renderStudents(data) {
  var dataTable = {
    data: data,
    columns: [
      { data: 'first_name' },
      { data: 'last_name' },
      { data: 'email' },
      { data: 'created' }
    ]
  }
  var studentsList = $('#students').DataTable(dataTable);

  $('#students tbody tr').on( 'click', 'td:first', function () {
    var studentData = studentsList.row($(this).parent()).data();
    getCertificate(studentData);
  });
}

function getCertificate(data) {
  var baseUrl = window.location.origin;
  window.open(baseUrl+'/certificates/?fn='+data.first_name.toUpperCase()+'&ln='+data.last_name.toUpperCase()+'&c=Web');
}

//get students data
function getStudents() {
  return $.ajax({
    url: 'api/students/get'
  });
}