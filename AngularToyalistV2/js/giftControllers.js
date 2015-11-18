var giftControllersModule = angular.module('giftControllersModule', []);

giftControllersModule.controller('GiftListCtrl', function ($scope, GiftDTO, CrawlerService) {
   
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


    //$scope.urlToGet = 'http://www.banggood.com/fr/Digital-Laser-Distance-Meter-Rangefinder-Measure-Diastimeter-40m-50m-60m-70m-80m-100m-optional-p-1009122.html';
    //$scope.urlToGet = 'http://reactor.fr';
    //$scope.urlToGet = "http://www.amazon.fr/gp/product/B013GRHYUW/ref=br_asw_pdt-2/280-3197474-9607032?pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=desktop-2&pf_rd_r=1M50WC1QENGB466P8Q9X&pf_rd_t=36701&pf_rd_p=722563887&pf_rd_i=desktop";
    $scope.urlToGet = 'http://livre.fnac.com/a8858480/Christophe-Felder-Gateaux#int=S:Nos meilleures ventes|Cuisine et vins|845|8858480|BL2|L1';

    $scope.crawlURL = function () {

        CrawlerService.crawlerTask($scope.urlToGet)
        .then(            
            function( data ) {
                //console.log(data);
                MakeNewGift(data);
            },
            function (errorMessage) {
                console.warn(errorMessage);
            }
        );

        function MakeNewGift(crawlerdata)
        {
            var htmlContent = crawlerdata;

            //console.log(decodeEntities(htmlContent.title));
            //console.log(decodeEntities(htmlContent.description));

            var myNewgift = new GiftDTO();
            myNewgift.id = 0;
            myNewgift.name = htmlContent.title;
            myNewgift.price = '0';
            myNewgift.currency = '£';
            myNewgift.description = htmlContent.description;
            myNewgift.imageURL = 'http://toyalist.reactor.fr/Tests/Toyalist/images/no-thumb.png';
            myNewgift.imagesURL = htmlContent.imagesURL;


            if (htmlContent.ogtitle)
                myNewgift.name = htmlContent.ogtitle;

            if (htmlContent.ogdescription)
                myNewgift.description = htmlContent.ogdescription;

            if (htmlContent.ogimage)
                myNewgift.imageURL = htmlContent.ogimage;


            var giftDTOCreated = GiftDTO.create(myNewgift, function () {
                myNewgift.id = giftDTOCreated.id;
                $scope.gifts.push(myNewgift);
            });


        }

        //Utilise une passerelle web qui accepte CORS et fait notre requete a notre place, une sorte de proxy
        //$.getJSON("http://alloworigin.com/get?url=" + encodeURIComponent("http://reactor.fr") + "&callback=?", function (data) {
        //    console.log(data.contents);
        //});

    };
    

    /******************************************************/
    /* LOAD de la liste complete des cadeaux depuis l'API */

    $scope.gifts = GiftDTO.query();

    
   

    /************************************/
    /* TEST */
   
    var fakeGift = new GiftDTO();
    fakeGift.id = 0;
    fakeGift.name = "Test";
    fakeGift.price = '0';
    fakeGift.currency = '£';
    fakeGift.description = "sdgs dqsf qdf qs";
    fakeGift.imageURL = "http://reactor.fr/images/logo/logo-reactor-400-92.png";
    fakeGift.imagesURL = [];
    fakeGift.imagesURL.push("http://reactor.fr/images/flags/france.gif");
    fakeGift.imagesURL.push("http://reactor.fr/images/flags/uk.gif");
    fakeGift.imagesURL.push("http://reactor.fr/images/CreativeJuice/window1.png");
    fakeGift.imagesURL.push("http://reactor.fr/images/CreativeJuice/window2.png");
    fakeGift.imagesURL.push("http://reactor.fr/images/CreativeJuice/window3.png");
    fakeGift.imagesURL.push("http://reactor.fr/images/CreativeJuice/third_phone.png");    

    //$scope.gifts = [];
    //$scope.gifts.push(fakeGift);

});




//Helpers

var decodeEntities = (function () {
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    function decodeHTMLEntities(str) {
        if (str && typeof str === 'string') {
            // strip script/html tags
            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }

    return decodeHTMLEntities;
})();