var myServiceModule = angular.module('myServiceModule', [])

/***********************/
/*    CONFIG           */
/***********************/
var environnement = "DEV";

var domainAPI;
if (environnement == "PROD")
{
    domainAPI = "http://toyalist-api.reactor.fr/"
}
if (environnement == "DEV") {
    domainAPI = "http://localhost:8324/"
}
var ToyalistURlWebAPI_Gifts = domainAPI + 'api/gifts/:giftId';
var ToyalistURlWebAPI_Lists = domainAPI + 'api/giftlists/:giftlistid';
var ToyalistURlWebAPI_Crawler = domainAPI + 'api/Crawler';


/***********************/
/*    GIFT SERVICE     */
/***********************/

myServiceModule.factory('GiftDTO', ['$resource',
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

myServiceModule.factory('GiftListDTO', ['$resource',
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

myServiceModule.service("CrawlerService",
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



/***********************/
/*    AUTHSERVICE     */
/***********************/

myServiceModule.factory('authService', ['$http', '$q', 'localStorageService', function ($http, $q, localStorageService) {

    var serviceBase = domainAPI;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""
    };

    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });

    };

    var _login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

        var deferred = $q.defer();

        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });

            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationData');

        _authentication.isAuth = false;
        _authentication.userName = "";

    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
        }

    }

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;

    return authServiceFactory;
}]);
