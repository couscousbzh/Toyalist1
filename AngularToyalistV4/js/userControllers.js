var userControllersModule = angular.module('userControllersModule', []);



/***********************/
/*    LoginCtrl        */
/***********************/
userControllersModule.controller('LoginCtrl', function ($scope, $http, UserService) {
    scope.login = function () {
        // configuration object
        var config = { /* ... */ }

        console.log('login in...');

        $http(config)
        .success(function (data, status, headers, config) {
            console.log('login sucess');
            if (data.status) {
                // succefull login                
                User.isLogged = true;
                User.username = data.username;
            }
            else {
                User.isLogged = false;
                User.username = '';
            }
        })
        .error(function (data, status, headers, config) {
            console.log('login error');
            User.isLogged = false;
            User.username = '';
        });
    }

});



/***********************/
/*    SignUpCtrl     */
/***********************/
userControllersModule.controller('SignUpCtrl', function ($scope, $routeParams) {
    
   
});
