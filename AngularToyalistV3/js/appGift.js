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
    $routeProvider
        .when('/', {
            templateUrl: 'views/gift-list.html',
            controller: 'GiftListCtrl'
        })
        .when('/listedit', {
            templateUrl: 'views/gift-list-edit.html',
            controller: 'GiftListEditCtrl'
        })
        .when('/gifts/:giftId', {
            templateUrl: 'views/gift-edit.html',
            controller: 'GiftEditCtrl'
        })
        .when('/login', { 
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            access: {
                isFree: true
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});


