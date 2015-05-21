/**
 * Created by mihaisampalean on 5/21/2015.
 */

$(document).ready(function(){
  var action = getStudents();

  action.done(function(data){
    console.log(data);
  });
});

//get students data
function getStudents() {
  return $.ajax({
    url: 'api/students/get'
  });
}