var giftFiltersModule = angular.module('giftFiltersModule', []);


giftFiltersModule.filter('setMaxTitleLength', function ($filter) {
        
    return function (input, places) {
        //if (isNaN(input)) return input; 

        /*Clean formate prepare*/
        var maxTitleCaracterLenght = 45;
        if (input.length > maxTitleCaracterLenght)
            input = input.substring(0, maxTitleCaracterLenght) + '(...)';

        return input;
    };
});