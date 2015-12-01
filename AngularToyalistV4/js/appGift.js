var giftApp = angular.module('giftApp', [
  'ngRoute',
  'ngResource',
  'LocalStorageModule',
  'myServiceModule',
  'userControllersModule',   
  'giftControllersModule', 
  'giftDirectiveModule',
  'giftFiltersModule'
]);


/***********************/
/*       ROUTES        */
/***********************/

giftApp.config(['$routeProvider', 
    function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html'
            })
            //.when('/lists/', {
            //    templateUrl: 'views/gift-list.html',
            //    controller: 'GiftListCtrl'
            //})
            .when('/lists/new', {
                templateUrl: 'views/gift-list-new.html',
                controller: 'GiftListNewCtrl'
            })
            .when('/lists/:giftlistid', {
                templateUrl: 'views/gift-list.html',
                controller: 'GiftListCtrl'
            })
            .when('/lists/edit/:giftlistid', {
                templateUrl: 'views/gift-list-edit.html',
                controller: 'GiftListEditCtrl'
            })
            .when('/gifts/edit/:giftid', {
                templateUrl: 'views/gift-edit.html',
                controller: 'GiftEditCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignUpCtrl',
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);

//giftApp.run(function ($http) {
//$http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w';
//});

giftApp.run(['authService', function (authService) {    
    authService.fillAuthData();
}]);

/***********************/
/*    INTERCEPTORS     */
/***********************/

giftApp.config(['$httpProvider',
  function ($httpProvider) {

      $httpProvider.interceptors.push(function ($q) {
          return {
              'response': function (response) {
                  // do something on success
                  return response || $q.when(response);
              },

              'responseError': function (rejection) {
                  // do something on error

                  //console.log(rejection.status);
                  //console.log(rejection.statusText);
                  //console.log(rejection.data);
                  //console.log(rejection.headers);
                  //console.log(rejection.config);

                  if (rejection.status == 401) {
                      $location.path('/login');
                      location.reload();
                  }

                  var txtMessage = 'Interceptor : ';
                  if (rejection.status)
                      txtMessage.concat('status  : ' + rejection.status + '\r\n');
                  if (rejection.statusText)
                      txtMessage.concat('statusText  : ' + rejection.statusText + '\r\n');
                  if (rejection.data)
                      txtMessage.concat('data  : ' + rejection.data.body + '\r\n');
                  if (rejection.headers)
                      txtMessage.concat('headers  : ' + rejection.headers + '\r\n');
                  if (rejection.config)
                      txtMessage.concat('config  : ' + rejection.config + '\r\n');

                  txtMessage = txtMessage.concat('status  : ' + rejection.status + '\r\n');


                  console.error(txtMessage);

                  swal({ title: "Error!", text: txtMessage, type: "error", confirmButtonText: "Ok" });

                  return $q.reject(rejection);
              }
          };
      });
  }
])


