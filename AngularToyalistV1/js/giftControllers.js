var giftControllersModule = angular.module('giftControllersModule', []);

var defaultList = { 'id': 0, 'name': 'default', gifts: [] };

giftControllersModule.controller('GiftListCtrl', function ($scope, GiftDTO) {
          

    var allGifts = GiftDTO.query(function () {
        //console.log(allGifts);
        $scope.gifts = allGifts;
    }); //query() returns all the entries
    
    
    $scope.deleteGift = function (index) {
        $scope.gifts[index].$delete(function () {
            //Remove the list on the view
            $scope.gifts.splice(index, 1);
        });
    };

    $scope.addNewGift = function () {

        var i = $scope.gifts.length;

        $scope.newgift = new GiftDTO();
        //$scope.newgift.id = "";
        $scope.newgift.name = "new item " + i;
        $scope.newgift.price = '0';
        $scope.newgift.currency = '£';
        $scope.newgift.description = 'new item description';
        $scope.newgift.imageURL = 'http://static.bbc.co.uk/history/img/ic/640/images/resources/histories/titanic.jpg';
        
        GiftDTO.create($scope.newgift);

        

        //Ne fonctionne pas a liste chargéen why ?
        //$scope.gifts.push($scope.newgift);

        //Recharge la liste
        var allGifts = GiftDTO.query(function () {
            //console.log(allGifts);
            $scope.gifts = allGifts;
        }); //query() returns all the entries


    };

});