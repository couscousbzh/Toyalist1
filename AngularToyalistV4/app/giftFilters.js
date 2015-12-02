var giftFiltersModule = angular.module('giftFiltersModule', []);


giftFiltersModule.filter('filterMaxTitleLength', function ($filter) {
        
    return function (input, places) {
        /*Return only the n first caracters*/
        
        var maxTitleCaracterLenght = places;
        if (input.length > maxTitleCaracterLenght)
            input = input.substring(0, maxTitleCaracterLenght) + '(...)';

        return input;
    };
});

giftFiltersModule.filter('filterDomain', function ($filter) {

    return function (input) {
     
        /*Return only the domain of a url*/
        //console.log(input);

        var domain;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (input.indexOf("://") > -1) {
            domain = input.split('/')[2];
        }
        else {
            domain = input.split('/')[0];
        }

        //find & remove port number
        domain = domain.split(':')[0];

        return domain;
    };
});