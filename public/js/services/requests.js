// js/services/todos.js
angular.module('requestsService', [])

    // super simple service
    // each function returns a promise object 
    .factory('Requests', function($http) {
        return {
            createRequest: function(formData){
                console.log('http application post: ', formData);
                return $http.post('/api/request', formData);
            }
        }
    });