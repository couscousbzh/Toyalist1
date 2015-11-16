var giftServiceModule = angular.module('giftServiceModule', [])

giftServiceModule.factory('GiftDTO', ['$resource',
    function ($resource) {
        return $resource('http://localhost:14463/api/gifts/:giftId', { giftId: '@id' }, {
            query: { method: 'GET', params: {}, isArray: true },
            delete: { method: 'DELETE', params: { id: '@id' } },
            create: { method: 'POST' }
        });
    }
]);

