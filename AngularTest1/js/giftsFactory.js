angular.module('giftFactoryModule', [])
    .factory('giftfactory', function ($http) {
           return {
               //list: function (callback) {
               //    $http({
               //        method: 'GET',
               //        url: 'data/gifts.json', 
               //        cache: true
               //    }).success(callback);
               //},
                getlist: function (callback) {
                    $http({
                        method: 'GET',
                        url: 'data/giftlist_1.json',
                        cache: false
                    }).success(callback);                   
                }                           

               //,
               //find: function (id, callback) {
               //    $http({
               //        method: 'GET',
               //        url: 'data/gift_' + id + '.json',
               //        cache: true
               //    }).success(callback);
               //}



           };
       });