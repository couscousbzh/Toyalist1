angular.module('giftDirectiveModule', [])
       .directive('giftdirective', function () {
           return {
               scope: { gift: '=' },
               restrict: 'A',
               templateUrl: 'templates/gift.html',
               controller: function ($scope, giftfactory) {
                   $scope.name = 'tata';
               }
               //controller: function ($scope, giftfactory) {

               //    //gifts.find($scope.gift.id, function (gift) {
               //    //    //$scope.flagURL = gift.flagURL;
               //    //    $scope.name = gift.name;
               //    //    $scope.description = gift.description;
               //    //    $scope.price = gift.price;
               //    //    //$scope.currency = gift.currency;
               //    //});
               //}
           };
       });