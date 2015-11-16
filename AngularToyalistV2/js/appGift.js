var giftApp = angular.module('giftApp', [
  'ngRoute',
  'ngResource',
  'giftControllersModule',
  'giftServiceModule'
]);

giftApp.config(function ($routeProvider) {
    //console.log('route');
    $routeProvider.
      when('/', {
          templateUrl: 'views/gift-list.html',
          controller: 'GiftListCtrl'
      }).
      otherwise({
          redirectTo: '/'
      });
});


