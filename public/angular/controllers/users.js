/**
 * Created by paulbrie on 26/04/15.
 */
var app = angular.module('myApp', []);
app.controller('usersCtrl', function($scope, $http) {
    $http.get("http://localhost:8080/api/users/get")
        .success(function(response) {
            if(response.result) {
                $scope.users = response.data;
            } else {
                $scope.errMsg = "Could not load the users";
            }
        });
});