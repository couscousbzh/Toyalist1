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
        urlList.push('http://www.banggood.com/fr/Digital-Laser-Distance-Meter-Rangefinder-Measure-Diastimeter-40m-50m-60m-70m-80m-100m-optional-p-1009122.html');
        urlList.push('http://www.amazon.fr/gp/product/B013GRHYUW/ref=br_asw_pdt-2/280-3197474-9607032?pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=desktop-2&pf_rd_r=1M50WC1QENGB466P8Q9X&pf_rd_t=36701&pf_rd_p=722563887&pf_rd_i=desktop');
        urlList.push('http://livre.fnac.com/a8858480/Christophe-Felder-Gateaux#int=S:Nos meilleures ventes|Cuisine et vins|845|8858480|BL2|L1');
        urlList.push('http://www.boulanger.com/ref/1051658');
        urlList.push('http://www.darty.com/nav/achat/telephonie/telephone_mobile_seul/mobile_reconditionne/apple_iph_4s_16_reco_blanc.html#dartyclic=H_pdt-du-moment_2_4175301');
        urlList.push('http://www.rueducommerce.fr/Jeux-Consoles/PS4/Console-PS4/SONY/4902797-PlayStation-4-500-Go.htm#moid:MO-F7C09M53554724');
        urlList.push('');

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

        

        //Par defaut on prends les données meta de facebook
        //if (htmlContent.ogtitle)
        //    myNewgift.name = htmlContent.ogtitle;

        //if (htmlContent.ogdescription)
        //    myNewgift.description = htmlContent.ogdescription;

        //if (htmlContent.ogimage)
        //    myNewgift.imageURL = htmlContent.ogimage;


        ////Si on pas d'image principale, on lui attribut la premiere image du crawl (la plus lourde en taille)
        //if (myNewgift.imageURL == '')
        //{
        //    if (myNewgift.imagesURL.length > 0)
        //        myNewgift.imageURL = myNewgift.imagesURL[0];
        //    else
        //        myNewgift.imageURL = 'http://reactor.fr/Tests/Toyalist/images/no-thumb.png'; //Default image when none
        //}
        
        /*************************************/
        /*PATCH SPECIFIQUE : A Faire evoluer */

        //www.rueducommerce.fr
        // --> l'image og:image meta facebook n'est pas bonne. Fait coté client
        //if (htmlContent.urlcrawled.indexOf("www.rueducommerce.fr") > -1)
        //{
        //    if (myNewgift.imagesURL.length > 0)
        //        myNewgift.imageURL = myNewgift.imagesURL[0];
        //    else
        //        myNewgift.imageURL = 'http://reactor.fr/Tests/Toyalist/images/no-thumb.png'; //Default image when none
        //}

        /*************************************/

        /*Clean formate prepare*/
        //Devra faire parti d'une directive !
        var maxTitleCaracterLenght = 45;
        if (myNewgift.name.length > maxTitleCaracterLenght)
            myNewgift.name = myNewgift.name.substring(0, maxTitleCaracterLenght) + '(...)';


        console.log('prout ');
        //Cree un objet giftDTO, Angular va gérer en Restfull la création grace a $resource.
        var giftDTOCreated = GiftDTO.create(myNewgift, function () {

            console.log('prout ' + giftDTOCreated.id);

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