var giftControllersModule = angular.module('giftControllersModule', []);

var defaultList = { 'id': 0, 'name': 'default', gifts: [] };

giftControllersModule.controller('GiftListCtrl', function ($scope, giftfactory, giftsservice, GiftDTO) {
    
    //$scope.thegiftlist = defaultList;
    
    //giftfactory.getlist(function (mygiftlist) {
    //    $scope.thegiftlist = mygiftlist;           
    //});  

    //$scope.thegiftlist.gifts = giftsservice.query();    

    //$scope.thegiftlist.gifts = giftsservice.query({}, function (data) { $scope.thegiftlist.gifts = data; });
    //$scope.thegiftlist.gifts = giftsservice.query({}).$promise
    //                            .then(function (data) { $scope.thegiftlist.gifts = data; })
    //                            .catch(function (response) { $scope.thegiftlist.gifts = []; });


    //$scope.gifts = giftsservice.query();
    
    //var giftDTO = GiftDTO.get({ id: 1 }, function () {
    //    //console.log(giftDTO);
    //    //$scope.gifts.push(giftDTO);
    //}); // get() returns a single entry
       


    var allGifts = GiftDTO.query(function () {
        //console.log(allGifts);
        $scope.gifts = allGifts;
    }); //query() returns all the entries
    
    
    $scope.deleteGift = function (index) {

        //$scope.thegiftlist.gifts.splice(index, 1);
        //$scope.gifts.splice(index, 1);

        //console.log($scope.gifts[index]);

        $scope.gifts[index].$delete(function () {
            //gone forever!

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


        //Ne fonctionne pas a liste chargée
        //$scope.gifts.push($scope.newgift);

        //Recharge la liste
        var allGifts = GiftDTO.query(function () {
            //console.log(allGifts);
            $scope.gifts = allGifts;
        }); //query() returns all the entries


    };

});

//giftControllersModule.controller('GiftAddCtrl', function ($scope, $routeParams, gifts) {
//    $scope.addNewGift = function () {

//        console.log('addNewGift');

//        var i = $scope.gifts.length;

//        //var newgift = {
//        //    "name": "new item" + i,
//        //    "price": "0",
//        //    "currency": "€",
//        //    "description": "new item description",
//        //    "imageURL": "http://static.bbc.co.uk/history/img/ic/640/images/resources/histories/titanic.jpg"
//        //};

//        //console.log(newgift);
//        //$scope.gifts.push(newgift);

//        $scope.newgift = new GiftDTO();
//        //$scope.newgift.id = "new item" + i;
//        $scope.newgift.name = "new item" + i;
//        $scope.newgift.price = '33';
//        $scope.newgift.currency = '£';
//        $scope.newgift.description = 'new item description';
//        $scope.newgift.imageURL = 'http://static.bbc.co.uk/history/img/ic/640/images/resources/histories/titanic.jpg';

//        GiftDTO.save($scope.newgift, function () {
//            //data saved. do something here.
//        }); //saves an entry. Assuming $scope.entry is the Entry object  


//        ////refresh
//        //var allGifts = GiftDTO.query(function () {
//        //    //console.log(allGifts);
//        //    $scope.gifts = allGifts;
//        //}); //query() returns all the entries
//    };
//});



//giftControllers.controller('GiftDetailCtrl', function ($scope, $routeParams, gifts) {
//    gifts.find($routeParams.giftId, function (gift) {
//        $scope.gift = gift;
//    });
//});