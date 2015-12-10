var indexControllersModule = angular.module('indexControllersModule', []);


indexControllersModule.controller('HeaderCtrl', function ($scope, authService) {

    $scope.authentication = authService.authentication;

    $scope.logOut = function () {
        authService.logOut();
        console.log('tu me vois ?');
        $location.path('/home');
    }
});
   