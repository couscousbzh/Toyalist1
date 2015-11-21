var giftApp = angular.module('giftApp', [
  'ngRoute',
  'ngResource',
  'giftControllersModule',
  'giftServiceModule',
  'giftDirectiveModule',
  'giftFiltersModule'
]);

giftApp.config(function ($routeProvider) {
    //console.log('route');
    $routeProvider.
        when('/', {
            templateUrl: 'views/gift-list.html',
            controller: 'GiftListCtrl'
        }).
        when('/gifts/:giftId', {
            templateUrl: 'views/gift-edit.html',
            controller: 'GiftEditCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});


