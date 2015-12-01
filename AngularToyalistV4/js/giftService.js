var giftServiceModule = angular.module('giftServiceModule', [])


var environnement = "PROD";


var domainAPI;
if (environnement == "PROD")
{
    domainAPI = "http://toyalist-api.reactor.fr/"
}
if (environnement == "DEV") {
    domainAPI = "http://localhost:11217/"
}
var ToyalistURlWebAPI_Gifts = domainAPI + 'api/gifts/:giftId';
var ToyalistURlWebAPI_Lists = domainAPI + 'api/giftlists/:giftlistid';
var ToyalistURlWebAPI_Crawler = domainAPI + 'api/Crawler';


giftServiceModule.factory('GiftDTO', ['$resource',
    function ($resource) {
        return $resource(ToyalistURlWebAPI_Gifts, { id: '@id' }, {
            query: { method: 'GET', params: {}, isArray: true },
            query: { method: 'GET', params: { giftlistid: '@id' }, isArray: true },
            get:    { method: 'GET' },
            delete: { method: 'DELETE', params: { id: '@id' } },
            create: { method: 'POST' },
            update: { method: 'PUT' }
        });
    }
]);

giftServiceModule.factory('GiftListDTO', ['$resource',
    function ($resource) {
        return $resource(ToyalistURlWebAPI_Lists, { id: '@id' }, {
            query: { method: 'GET', params: {}, isArray: true },
            get: { method: 'GET' },
            delete: { method: 'DELETE', params: { id: '@id' } },
            create: { method: 'POST' },
            update: { method: 'PUT' }
        });
    }
]);

giftServiceModule.factory('UserService', [function () {
    var sdo = {
        isLogged: false,
        username: ''
    };
    return sdo;
}])

giftServiceModule.service("CrawlerService",
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
                        
            var myUrl = ToyalistURlWebAPI_Crawler + '?url=' + url;

            var request = $http({
                method: "get",
                url: myUrl,
                params: {}
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
            // normalized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                !angular.isObject(response.data) ||
                !response.data.message
                ) {
                return ($q.reject("An unknown error occurred."));
            }
            // Otherwise, use expected error message.
            //return ($q.reject(response.data.message));
            return ($q.reject(response.data));

        }
        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess(response) {
            return (response.data);
        }
    }
);




