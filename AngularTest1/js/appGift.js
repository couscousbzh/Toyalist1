var giftApp = angular.module('giftApp', [
  'ngRoute',
  'ngResource',
  'giftControllersModule',
  'giftFactoryModule',
  'giftDirectiveModule',
  'giftServiceModule'
]);

giftApp.config(function ($routeProvider) {
    //console.log('route');
    $routeProvider.
      when('/', {
          templateUrl: 'views/gift-list.html',
          controller: 'GiftListCtrl'
      }).
      when('/:giftId', {
          templateUrl: 'views/gift-detail.html',
          controller: 'GiftDetailCtrl'
      }).
      otherwise({
          redirectTo: '/'
      });
});

giftApp.run(function ($http) {

    //http://www.angulartutorial.net/2014/05/set-headers-for-all-http-calls-in.html

    //$http.defaults.headers.common.Authorization = 'login YmVlcDpi';
    ////or try this
    //$http.defaults.headers.common['Auth-Token'] = 'login YmVlcDpi';

});

