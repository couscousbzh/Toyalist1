var giftApp = angular.module('giftApp', [
  'ngRoute',
  'giftControllers',
  'giftsFactory',
  'giftDirective'
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