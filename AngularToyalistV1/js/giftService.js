var giftServiceModule = angular.module('giftServiceModule', [])


var ToyalistURlWebAPI = 'http://toyalist.reactor.fr/api/gifts/:giftId';

var ToyalistURlWebAPI_Local = 'http://localhost:14463/api/gifts/:giftId';

giftServiceModule.factory('GiftDTO', ['$resource',
    function ($resource) {
        return $resource(ToyalistURlWebAPI, { giftId: '@id' }, {
            query: { method: 'GET', params: {}, isArray: true },
            delete: { method: 'DELETE', params: { id: '@id' } },
            create: { method: 'POST' }
        });
    }
]);

