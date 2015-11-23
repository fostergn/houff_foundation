// js/services/todos.js
angular.module('grantsService', [])

    // super simple service
    // each function returns a promise object 
    .factory('Grants', function($http) {
        return {
            createApplication: function(application){
                console.log('http application post: ', application);
                return $http.post('/api/grant', application);
            }
        }
    });