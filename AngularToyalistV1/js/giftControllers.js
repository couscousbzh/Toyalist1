var giftControllersModule = angular.module('giftControllersModule', []);

giftControllersModule.controller('GiftListCtrl', function ($scope, GiftDTO) {
   
    //$scope.$watch('gifts', function () {
    //    console.log('gifts changed');
    //    console.log($scope.gifts);
    //});

    
    $scope.deleteGift = function (giftId, index) {
        GiftDTO.delete({ id: giftId }, function () {
            //Remove the list on the view
            $scope.gifts.splice(index, 1);
        });
    };

    $scope.addNewGift = function () {      

        //console.log(formAddGift.name.value);
        //console.log($scope.newGiftName);
        
        var myNewgift = new GiftDTO();
        myNewgift.id = 0;
        myNewgift.name = formAddGift.name.value;
        myNewgift.price = '0';
        myNewgift.currency = '£';
        myNewgift.description = 'new item description';
        myNewgift.imageURL = 'http://static.bbc.co.uk/history/img/ic/640/images/resources/histories/titanic.jpg';

        var giftDTOCreated = GiftDTO.create(myNewgift, function () {
            $scope.gifts.push(giftDTOCreated);
        });
        

    };
    

    /******************************************************/
    /* LOAD de la liste complete des cadeaux depuis l'API */

    //$scope.gifts = [];

    $scope.gifts = GiftDTO.query();

   
    //var allGifts = GiftDTO.query(function () {
        
    //    //console.log(allGifts);

    //    $scope.gifts = allGifts;

    //    console.log('ca y est j ai fini d afficher la liste au load du controler');
    //}); //query() returns all the entries


});