var giftControllersModule = angular.module('giftControllersModule', []);



//console.log('log');
//console.warn('warn');
//console.debug('debug');
//console.error('error');
//console.info('info');




/**************************/
/*    GiftListNewCtrl     */
/**************************/
giftControllersModule.controller('GiftListNewCtrl', function ($scope, $routeParams, $location, GiftListDTO) {

    $scope.addNewGiftList = function () {

        var myNewGiftList = new GiftListDTO();
        myNewGiftList.name = giftlistForm.name.value;
        myNewGiftList.isOwnerTheBeneficary = giftlistForm.isOwnerTheBeneficary.checked;

        //console.log(myNewGiftList);

        var giftListDTOCreated = GiftListDTO.create(myNewGiftList,
            function (success) {
                //console.log('success : ' + success);
                $location.path("/lists/edit/" + giftListDTOCreated.id);
            },
            function (error) {
                //console.log('error : ' + error.status);
                //swal({ title: "Error!", text: "Here's my error message!", type: "error", confirmButtonText: "Ok" });
            }
        );
    }

});


/***********************/
/*    GiftListCtrl     */
/***********************/
giftControllersModule.controller('GiftListCtrl', function ($scope, $routeParams, GiftListDTO, GiftDTO) {
    
    /******************************************************/
    /* LOAD de la liste principale puis la liste complete des cadeaux depuis l'API */
    //console.log($routeParams.giftlistsid);

    //$scope.list = GiftListDTO.get({ id: $routeParams.giftlistid });
    
    $scope.list = GiftListDTO.get({ id: $routeParams.giftlistid },
            function (success) {
                console.log('success : ' + success);               
            },
            function (error) {
                console.log('error : ' + error);
                swal({ title: "Error!", text: "Cette liste n'existe pas ou n'existe plus.", type: "error", confirmButtonText: "Ok" });
            }
        );

    $scope.gifts = GiftDTO.query({ giftlistid: $routeParams.giftlistid });
});


/***************************/
/*    GiftListEditCtrl     */
/***************************/
/*Edit de liste de cadeau */
giftControllersModule.controller('GiftListEditCtrl', function ($scope, $routeParams, $location, GiftListDTO, GiftDTO, CrawlerService) {

    //TODO : faire le check d'un code d'une liste qui n'existe pas. 

    /******************************************************/
    /* LOAD de la liste complete des cadeaux depuis l'API */
    //$scope.list = GiftListDTO.get({ id: $routeParams.giftlistid });

    $scope.list = GiftListDTO.get({ id: $routeParams.giftlistid },
           function (success) {
               //console.log('success : ' + success.status);
               if (!$scope.list.name)
                   swal({ title: "Error!", text: "Cette liste n'existe pas ou n'existe plus.", type: "error", confirmButtonText: "Ok" },
                        function () {
                            //$location.path("/"); //Ne fonctionne pas car swal est en dehors de angular
                            window.location = '/';
                        }
                   );
               else
                   $scope.gifts = GiftDTO.query({ giftlistid: $routeParams.giftlistid });
           }
       );
    
    $scope.tasks = [];
    $scope.urlToGet = "";
    
    $scope.deleteGift = function (giftId, index) {
        GiftDTO.delete({ id: giftId }, function () {
            //Remove the gift on the view
            $scope.gifts.splice(index, 1);
        });
    };

    $scope.addNewGift = function () {      

        //console.log(formAddGift.name.value);

        //console.log($scope.list.giftlistid);
        //console.log($routeParams.giftlistid);
        
        var myNewgift = new GiftDTO();
        myNewgift.id = "";
        myNewgift.giftListId = $routeParams.giftlistid;
        myNewgift.url = '';
        myNewgift.name = formAddGift.name.value;
        myNewgift.price = '0';
        myNewgift.currency = '£';
        myNewgift.description = 'new item description';
        myNewgift.imageURL = 'http://static.bbc.co.uk/history/img/ic/640/images/resources/histories/titanic.jpg';

        var giftDTOCreated = GiftDTO.create(myNewgift, function () {
            $scope.gifts.push(giftDTOCreated);
        });
        

    };


    $scope.crawlURL = function () {
        TaskCrawler($scope.urlToGet);
    };   
    
    $scope.addPredifinedGift = function (url) {

        TaskCrawler(url);
    };

    $scope.megaCrawlURL = function () {        

        for (i = 0 ; i < urlList.length ; i++) {                        
            TaskCrawler(urlList[i]);
        }
    };


    $scope.removeAll = function () {

        for (i = 0 ; i < $scope.gifts.length ; i++) {   
            console.log('removing ' + $scope.gifts[i].name)
            GiftDTO.delete({ id: $scope.gifts[i].id }, function () {                
            });
        }
        $scope.gifts = [];
    };
    

    /*************************************/
    /* HELPERS */

    function TaskCrawler(url) {
       
        $scope.tasks.push(url.toLowerCase());
        console.log('Crawling : ' + url.toLowerCase() );

        CrawlerService.crawlerTask(url.toLowerCase())
        .then(
            function (data) {
                console.log('crawl ok for ' + data.urlcrawled);
                MakeNewGift(data);
                RemoveItemInArray($scope.tasks, data.urlcrawled.toLowerCase());
            },
            function (error) {
                console.warn('crawl failed : ' + error.message + ' for url ' + error.urlcrawled);
                RemoveItemInArray($scope.tasks, error.urlcrawled.toLowerCase());
            }
        );            
    }
    
    


    function MakeNewGift(htmlContent) {
               
        var myNewgift = new GiftDTO();
        myNewgift.id = 0;
        myNewgift.giftListId = $routeParams.giftlistid;
        myNewgift.url = htmlContent.urlcrawled;
        myNewgift.name = htmlContent.title;
        myNewgift.price = htmlContent.price;
        myNewgift.currency = htmlContent.currency;
        myNewgift.description = htmlContent.description;
        myNewgift.imageURL = htmlContent.mainImageURL;
        myNewgift.imagesURL = htmlContent.imagesURL;

        /*************************************/

        //console.log(myNewgift);

        //Cree un objet giftDTO, Angular va gérer en Restfull la création grace a $resource.
        var giftDTOCreated = GiftDTO.create(myNewgift, function () {
            myNewgift.id = giftDTOCreated.id; //récupère l'id de l'objet créer par le serveur, indispensable pour le delete
            $scope.gifts.push(myNewgift);
        });
    }



    /************************************/
    /* TEST */


    var urlList = [];

    //Parfait
    urlList.push('http://www.rueducommerce.fr/Jeux-Consoles/PS4/Console-PS4/SONY/4902797-PlayStation-4-500-Go.htm#moid:MO-F7C09M53554724');
    urlList.push('http://livre.fnac.com/a8858480/Christophe-Felder-Gateaux#int=S:Nos meilleures ventes|Cuisine et vins|845|8858480|BL2|L1');
    urlList.push('http://www.banggood.com/fr/Digital-Laser-Distance-Meter-Rangefinder-Measure-Diastimeter-40m-50m-60m-70m-80m-100m-optional-p-1009122.html');

    //Fonctionne presque bien 
    urlList.push('http://www.darty.com/nav/achat/accessoires/telephone_mobile_audio/kit_pieton_mains-libres/philips_she7005a.html');

    //Fonctionne mais manque le prix
    urlList.push('http://www.amazon.fr/gp/product/B013GRHYUW/ref=br_asw_pdt-2/280-3197474-9607032?pf_rd_m=A1X6FK5RDHNB96&pf_rd_s=desktop-2&pf_rd_r=1M50WC1QENGB466P8Q9X&pf_rd_t=36701&pf_rd_p=722563887&pf_rd_i=desktop');
    urlList.push('http://www.cdiscount.com/auto/huiles-additifs/bardahl-nettoyant-injecteurs-diesel-1l/f-13373-bar3266720115517.html#mpos=1|cd');
    urlList.push('http://www.decathlon.fr/vtt-rockrider-500-id_8293150.html');
    urlList.push('http://www.leroymerlin.fr/v3/p/produits/pack-wc-a-poser-ideal-standard-exacto-sortie-horizontale-e4713');
    urlList.push('http://www.ikea.com/fr/fr/catalog/products/50193256/');
    urlList.push('http://www.laredoute.fr/ppdp/prod-324518205.aspx');
    urlList.push('http://www.sarenza.com/pepe-jeans-game-jack-k-s814920-p0000127626');
    urlList.push('https://www.zalando.fr/pier-one-chaussures-a-lacets-brown-pi912a0f1-o11.html');
    urlList.push('http://www.cultura.com/monopoly-star-wars-5010994880316.html');
    urlList.push('http://www.auchan.fr/mattel-barbie-robe-de-mariee/p-c377746');
    urlList.push('http://www.conforama.fr/chambre-literie/chambre-adulte/armoire/porte-bi-color-50-cm-no-limit-coloris-chene-taupe/p/471086');

    //plusieurs pbs, prix, images...
    urlList.push('http://multimedia.e-leclerc.com/univers+multimedia/catalogue/produit/r%C3%A9flex-num%C3%A9rique,10241/');
    urlList.push('http://www.castorama.fr/store/Coupe-branches--nettoyeur-prod6920177.html?isFeaturedProduct=true&navAction=jump&categoryId=cat_id_1418&navCount=0');
    urlList.push('http://www.joueclub.fr/jeux-et-jouets/lexibook/ma-1ere-guitare-reine-des-neiges/34020950.aspx');
    urlList.push('http://www.boulanger.com/ref/1051658');

    //Marche pas
   

    //A tester

    urlList.push('http://www.oxybul.com/jeux-d-imagination/circuits-voitures-et-trains/circuits/circuit-de-voiture-3d-infrarouge-frequence-a/produit/313117');
    urlList.push('http://www.toysrus.fr/product/index.jsp?productId=32179701&camp=ppc_esv_google-c-42020-67037075940-136292-E&esvcid=S1448024149_ADOGOE_AGI42020_CRE67037075940_TID136292_DVCc_RFDd3d3Lmdvb2dsZS5mcg%3D%3D');
    urlList.push('http://www.priceminister.com/offer/buy/223727295/baby-foot-calcio.html?gclid=CJ_20baGn8kCFU-3GwodAtIHUA#sort=0&filter=10&bbaid=652942720&xtatc=PUB-%5Bggp%5D-%5BEnfant%5D-%5Bjeux-cafe%5D-%5B223727295%5D-%5Bneuf%5D-%5Brdvdeco%5D&t=&ptnrid=s9V1S5FxD_dc|pcrid|53687075363|pkw||pmt|&ja1=tsid:67590|cid:287443283|agid:14497925483|tid:kwd-90083637443|crid:53687075363|nw:g|rnd:11301557471419984015|dvc:c|adp:1o2');

    urlList.push('http://reactor.fr');

    //urlList.push('');
    //urlList.push('');

    
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


/***********************/
/*    GiftEditCtrl     */
/***********************/
/*Edition d'un cadeau */
giftControllersModule.controller('GiftEditCtrl', function ($scope, $routeParams, $location, GiftDTO, CrawlerService)
{
    //Load data from API
    $scope.gift = GiftDTO.get({ id: $routeParams.giftid },
        function () {
            //For debug
            $scope.gift.tempImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/290px-Grosser_Panda.JPG';
        }
    );

    $scope.update = function () {
        //console.log('saving');
        //console.warn('giftForm.$valid  :' + $scope.giftForm.$valid);
        //console.warn('giftForm.newImageUrl.$valid  :' + $scope.giftForm.newImageUrl.$valid);
        
        if ($scope.giftForm.$valid) {
            GiftDTO.update({ giftId: $scope.gift.id }, $scope.gift, function () {
                //console.log('saved');
                $location.path("/lists/edit/" + $scope.gift.giftListId);
            });
        }
        else {
            console.warn('$scope.giftForm.$error : ' + $scope.giftForm.$error);



            swal({ title: "Error!", text: "Il semblerait que certain champs soit mal renseigner : ", type: "error", confirmButtonText: "Ok" });
        }
    }


    $scope.removeImage = function (imageurl) {
        //console.log('removeImage');
        RemoveItemInArray($scope.gift.imagesURL, imageurl);
    }


    $scope.makeDefaultImage = function (imageurl) {
        //console.log('makeDefaultImage');
        var oldMainImage = $scope.gift.imageURL;
        $scope.gift.imageURL = imageurl;
        RemoveItemInArray($scope.gift.imagesURL, imageurl);
        $scope.gift.imagesURL.push(oldMainImage);
    }


   
    $scope.addNewImageUrl = function () {
        //console.log(giftForm.newImageUrl.value.length);
        
        if (giftForm.newImageUrl.value.length > 0)
        {
            //TODO : faire un controle de l'url et filtrer les site porno, nazi ou qui parle de tricot.

            //remplace directement l'image principale si absente
            if ($scope.gift.imageURL == 'http://toyalist.reactor.fr/images/no-thumb.png')
                $scope.gift.imageURL = giftForm.newImageUrl.value;
            else
                $scope.gift.imagesURL.push(giftForm.newImageUrl.value);
           
            giftForm.newImageUrl.value = "";
        }
        else {
            //affiche un msg d'erreur
            
        }
    }
    


});





/***********************/
/*    HELPERS          */
/***********************/


function RemoveItemInArray(array, search_term) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i] === search_term) {
            array.splice(i, 1);
            break;       //<-- Uncomment  if only the first term has to be removed
        }
    }
}












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