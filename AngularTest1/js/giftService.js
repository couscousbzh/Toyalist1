var giftServiceModule = angular.module('giftServiceModule', [])

giftServiceModule.factory('giftsservice', ['$resource',
    function ($resource) {
        return $resource('http://localhost:14463/api/gifts', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    }
]);

giftServiceModule.factory('GiftDTO', ['$resource',
    function ($resource) {
        return $resource('http://localhost:14463/api/gifts/:id', {}, {
            query: { method: 'GET', params: {}, isArray: true },
            delete: { method: 'DELETE', params: { id: '@id' } },
            create: { method: 'POST' }
        });
    }
]);



//angular.module('giftApp', ['ngResource'])
  //.factory('GiftService', ['$resource',
  //  function ($resource) {
  //      return $resource('http://localhost:14463/api/gifts/:giftId', { giftId: '@id' });
  //  }]
  //);



//angular.module('giftApp', ['ngResource'])
//    .factory('giftsService', ['$resource',
//        function ($resource) {
//            return $resource('http://localhost:14463/api/gifts', {}, {
//                query: { method: 'GET', params: {}, isArray: true }
//            });
//        }]
//    );