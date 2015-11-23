// js/services/todos.js
angular.module('workersService', [])

    // super simple service
    // each function returns a promise object 
    .factory('Workers', function($http) {
        return {
            getAll : function() {
                return $http.get('/api/workers');
            },
            getSkills: function() {
                return $http.get('/api/skills');
            },
            createWorker: function(worker){
                console.log('http post: ', worker);
                return $http.post('/api/workers', worker);
            }
        }
    });