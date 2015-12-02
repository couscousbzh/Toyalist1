var userControllersModule = angular.module('userControllersModule', []);



/***********************/
/*    LoginCtrl        */
/***********************/
userControllersModule.controller('LoginCtrl', function ($scope, $http, $location, authService) {
    
    $scope.loginData = {
        userName: "",
        password: ""
    };

    $scope.message = "";

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {

            $location.path('/lists');

        },
         function (err) {
             $scope.message = err.error_description;
         });
    };


});



/***********************/
/*    SignUpCtrl     */
/***********************/
userControllersModule.controller('SignUpCtrl', function ($scope, $routeParams, $timeout, $location, authService) {
    
    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.registration = {
        userName: "",
        password: "",
        confirmPassword: ""
    };

    $scope.signUp = function () {

        authService.saveRegistration($scope.registration).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
            startTimer();

        },
         function (response) {
             var errors = [];
             for (var key in response.data.modelState) {
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }
             $scope.message = "Failed to register user due to:" + errors.join(' ');
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }
   
});
