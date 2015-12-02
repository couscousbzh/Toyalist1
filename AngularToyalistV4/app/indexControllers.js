var indexControllersModule = angular.module('indexControllersModule', []);


indexControllersModule.controller('HeaderCtrl', function ($scope, authService) {

    $scope.authentication = authService.authentication;

    $scope.logOut = function () {
        authService.logOut();
        $location.path('/home');
    }
});
   