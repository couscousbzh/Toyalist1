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


    $scope.urlToGet = "",
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
    };
    

    $scope.megaCrawlURL = function () {
        
        var urlList = [];

        //Parfait
        urlList.push('http://www.rueducommerce.fr/Jeux-Consoles/PS4/Console-PS4/SONY/4902797-PlayStation-4-500-Go.htm#moid:MO-F7C09M53554724');
        urlList.push('http://livre.fnac.com/a8858480/Christophe-Felder-Gateaux#int=S:Nos meilleures ventes|Cuisine et vins|845|8858480|BL2|L1');
        
        //Fonctionne presque bien 
        urlList.push('http://www.darty.com/nav/achat/accessoires/telephone_mobile_audio/kit_pieton_mains-libres/philips_she7005a.html');
        
        //Fonctionne mais manque le prix
        //urlList.push('http://www.amazon.fr/gp/product/B013GRHYUW/ref=br_asw_pdt-2/280-3197474-9607032?pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=desktop-2&pf_rd_r=1M50WC1QENGB466P8Q9X&pf_rd_t=36701&pf_rd_p=722563887&pf_rd_i=desktop');
        //urlList.push('http://www.cdiscount.com/auto/huiles-additifs/bardahl-nettoyant-injecteurs-diesel-1l/f-13373-bar3266720115517.html#mpos=1|cd');
        //urlList.push('http://www.decathlon.fr/vtt-rockrider-500-id_8293150.html');
        //urlList.push('http://www.leroymerlin.fr/v3/p/produits/pack-wc-a-poser-ideal-standard-exacto-sortie-horizontale-e4713');
        //urlList.push('http://www.ikea.com/fr/fr/catalog/products/50193256/');
        //urlList.push('http://www.laredoute.fr/ppdp/prod-324518205.aspx');
        //urlList.push('http://www.sarenza.com/pepe-jeans-game-jack-k-s814920-p0000127626');
        //urlList.push('https://www.zalando.fr/pier-one-chaussures-a-lacets-brown-pi912a0f1-o11.html');


        //plusieurs pbs, prix, images...
        //urlList.push('http://multimedia.e-leclerc.com/univers+multimedia/catalogue/produit/r%C3%A9flex-num%C3%A9rique,10241/');
        //urlList.push('http://www.castorama.fr/store/Coupe-branches--nettoyeur-prod6920177.html?isFeaturedProduct=true&navAction=jump&categoryId=cat_id_1418&navCount=0');
        
        //Marche pas
        //urlList.push('http://www.banggood.com/fr/Digital-Laser-Distance-Meter-Rangefinder-Measure-Diastimeter-40m-50m-60m-70m-80m-100m-optional-p-1009122.html');
        //urlList.push('http://www.boulanger.com/ref/1051658');

        
        
        //urlList.push('');
        //urlList.push('');

       


        for (i = 0 ; i < urlList.length ; i++) {

            console.log('Crawling : ' + urlList[i]);

            CrawlerService.crawlerTask(urlList[i])
               .then(
                   function (data) {
                       console.log('Crawl ok');
                       //console.log(data);
                       MakeNewGift(data);
                   },
                   function (errorMessage) {
                       console.warn('Error from crawl ==> ' +  errorMessage);
                   }
            );
        }


    };



    /******************************************************/
    /* LOAD de la liste complete des cadeaux depuis l'API */

    $scope.gifts = GiftDTO.query();

    /*************************************/
    /* HELPERS */

    function MakeNewGift(htmlContent) {
               
        var myNewgift = new GiftDTO();
        myNewgift.id = 0;
        myNewgift.url = htmlContent.urlcrawled;
        myNewgift.name = htmlContent.title;
        myNewgift.price = htmlContent.price;
        myNewgift.currency = htmlContent.currency;
        myNewgift.description = htmlContent.description;
        myNewgift.imageURL = htmlContent.mainImageURL;
        myNewgift.imagesURL = htmlContent.imagesURL;
       
        /*************************************/

       

        
        //Cree un objet giftDTO, Angular va gérer en Restfull la création grace a $resource.
        var giftDTOCreated = GiftDTO.create(myNewgift, function () {
            myNewgift.id = giftDTOCreated.id; //récupère l'id de l'objet créer par le serveur, indispensable pour le delete
            $scope.gifts.push(myNewgift);
        });


    }



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

//var decodeEntities = (function () {
//    // this prevents any overhead from creating the object each time
//    var element = document.createElement('div');

//    function decodeHTMLEntities(str) {
//        if (str && typeof str === 'string') {
//            // strip script/html tags
//            str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
//            str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
//            element.innerHTML = str;
//            str = element.textContent;
//            element.textContent = '';
//        }

//        return str;
//    }

//    return decodeHTMLEntities;
//})();