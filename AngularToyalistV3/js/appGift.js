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
            templateUrl: 'views/main.html'
        })
        //.when('/lists/', {
        //    templateUrl: 'views/gift-list.html',
        //    controller: 'GiftListCtrl'
        //})
        .when('/lists/new', {
            templateUrl: 'views/gift-list-new.html',
            controller: 'GiftListNewCtrl'
        })
        .when('/lists/:giftlistid', {
            templateUrl: 'views/gift-list.html',
            controller: 'GiftListCtrl'
        })
        .when('/lists/edit/:giftlistid', {
            templateUrl: 'views/gift-list-edit.html',
            controller: 'GiftListEditCtrl'
        })
        .when('/gifts/:giftid', {
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


