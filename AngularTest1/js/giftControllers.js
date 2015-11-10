var giftControllers = angular.module('giftControllers', []);

var defaultList = { 'id': 0, 'name': 'default', gifts: [] };

giftControllers.controller('GiftListCtrl', function ($scope, giftfactory) {
    
    //$scope.thegiftlist = defaultList;
    
    giftfactory.getlist(function (mygiftlist) {
        $scope.thegiftlist = mygiftlist;           
    });  

    $scope.addNewGift = function () {

        console.log('addNewGift');

        var i = $scope.thegiftlist.gifts.length;

        var newgift = {
            "name": "new item" + i,
            "price": "0",
            "currency": "€",
            "description": "new item description",
            "imageURL": "http://static.bbc.co.uk/history/img/ic/640/images/resources/histories/titanic.jpg"
        };

        console.log(newgift);

        $scope.thegiftlist.gifts.push(newgift);
    };

    $scope.deleteGift = function (index) {
        $scope.thegiftlist.gifts.splice(index, 1);
    };

});


//giftControllers.controller('GiftDetailCtrl', function ($scope, $routeParams, gifts) {
//    gifts.find($routeParams.giftId, function (gift) {
//        $scope.gift = gift;
//    });
//});