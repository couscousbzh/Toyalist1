var giftServiceModule = angular.module('giftServiceModule', [])


var ToyalistURlWebAPI_Gifts = 'http://toyalist.reactor.fr/api/gifts/:giftId';
var ToyalistURlWebAPI_Gifts_Local = 'http://localhost:14463/api/gifts/:giftId';

giftServiceModule.factory('GiftDTO', ['$resource',
    function ($resource) {
        return $resource(ToyalistURlWebAPI_Gifts, { giftId: '@id' }, {
            query: { method: 'GET', params: {}, isArray: true },
            delete: { method: 'DELETE', params: { id: '@id' } },
            create: { method: 'POST' }
        });
    }
]);


giftServiceModule.service(
    "CrawlerService",
    function ($http, $q) {

        // Return public API.
        return ({
            crawlerTask: crawlerTask
        });
        
        // ---
        // PUBLIC METHODS.
        // ---
        // I add a friend with the given name to the remote collection.
        function crawlerTask(url) {
                        
            var myUrl = 'http://toyalist.reactor.fr/api/Crawler?url=' + url;

            var request = $http({
                method: "get",
                url: myUrl,
                params: {
                    
                }
            });
            return (request.then(handleSuccess, handleError));
        }      
        // ---
        // PRIVATE METHODS.
        // ---
        // I transform the error response, unwrapping the application data from
        // the API response payload.
        function handleError(response) {
            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                !angular.isObject(response.data) ||
                !response.data.message
                ) {
                return ($q.reject("An unknown error occurred."));
            }
            // Otherwise, use expected error message.
            return ($q.reject(response.data.message));
        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess(response) {
            return (response.data);
        }
    }
);
