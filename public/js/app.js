var app = angular.module("houffApp", ['ngRoute', 'workersService', 'grantsService', 'ngFileUpload', 'requestsService']);

app.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl : 'views/home.html',
			controller : 'homeController',
			controllerAs: 'home'
		})

		.when('/apply', {
			templateUrl : 'views/apply.html',
			controller : 'applyController',
			controllerAs: 'apply'
		})

		.when('/projects', {
			templateUrl : 'views/projects.html',
			controller : 'applyController',
			controllerAs: 'projects'
		})

		.when('/resources', {
			templateUrl : 'views/resources.html',
			controller : 'applyController',
			controllerAs: 'resources'
		})

		.when('/board', {
			templateUrl : 'views/board.html',
			controller : 'applyController',
			controllerAs: 'board'
		})

		.when('/success', {
			templateUrl : 'views/success.html',
			controller : 'successController',
			controllerAs: 'success'
		})

		.when('/temp', {
			templateUrl : 'views/temp-work.html',
			controller : 'tempController',
			controllerAs: 'temp'
		})

		.when('/temp-apply', {
			templateUrl : 'views/temp-apply.html',
			controller : 'tempApplyController',
			controllerAs: 'tempApply'
		})

		.when('/temp-search', {
			templateUrl : 'views/temp-search.html',
			controller : 'tempSearchController',
			controllerAs: 'search'
		})

		.when('/temp-request', {
			templateUrl : 'views/temp-request.html',
			controller : 'tempRequestController',
			controllerAs: 'request'
		})

		.when('/negative-hours', {
			templateUrl : 'views/negative-hours.html',
			controller : 'negativeHoursController',
			controllerAs: 'negative'
		})

		.otherwise('/');

		$locationProvider.html5Mode(true);

});

app.filter('bytes', function() {
	return function(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	}
});

app.service('ReqWorker', function ReqWorker(){
    var worker = this;

    worker.name = "Gavin Foster";
	});

app.service('Success', function Success(){
    var success = this;

    success.message = "Thank you for requesting work!";
	});


app.controller('mainController', function($location){
	var vm = this;
	vm.section = "";

	switch ($location.path()){
		case '/':
			vm.section = 'home';
			break;
		case '/apply':
			vm.section = 'apply';
			break;
		case '/board':
			vm.section = 'board';
			break;
		case '/resources':
			vm.section = 'resources';
			break;
		case 'projects':
			vm.section = 'projects';
			break;
	}

	vm.go = function(section, link){
		vm.section = section;
		$location.path(link);
	}

});

app.controller('homeController', function(){
	var vm = this;

	vm.message = "why don't you apply";
});

app.controller('applyController', function(){
	var vm = this;

	vm.message = "why don't you apply";
});

app.controller('tempController', function(){
	var vm = this;

	vm.message = "it's only for part of the time";
});

app.controller('tempApplyController', function(Workers, $compile, $scope, Upload, $location, Success){
	var vm = this;
	vm.skillCounter = 0;
	vm.formData = {};
	vm.formData.skill = [];
	vm.formData.department = "department";

	vm.addSkill = function(event){
		vm.skillCounter++;
		console.log('skill count: ', vm.skillCounter);
		var skillInput = '<div class="skill"><input class="temp-skill" name="skill" ng-model="tempApply.formData.skill['+ vm.skillCounter +'].name" placeholder="skill"><div class="line"></div><input class="temp-hr" ng-model="tempApply.formData.skill['+ vm.skillCounter +'].perHour" name="$/hr" placeholder="$/hr"><div ng-click="tempApply.removeSkill($event)" class="remove-skill">x</div></div>';
		var temp = $compile(skillInput)($scope);
		var newSkill = angular.element(temp);

		$(event.target).before(newSkill);
	}

	vm.removeSkill = function(event){
		if(vm.skillCounter == 0) {
			return
		}
		console.log('removing');
		vm.skillCounter--;
		$(event.target).parent().remove();
	}

	vm.submitWorker = function() {
        Upload.upload({
            url: 'api/workers',
            data: {
            	file: vm.file, 
            	'name': vm.formData.name, 
            	'email': vm.formData.email, 
            	'phone': vm.formData.phone, 
            	'department': vm.formData.department, 
            	'bio': vm.formData.bio, 
            	'skill': vm.formData.skill
            }
        });

        $location.path('/success');
	}

});

app.controller('tempSearchController', function(Workers, ReqWorker, $location){
	var vm = this;

	vm.searching = {};
	vm.workers = [];

	Workers.getAll()
    .success(function(data){
        vm.workers = data;
  });

  Workers.getSkills()
  	.success(function(data){
  		vm.skills = data;
  		console.log('skills: ', data);
  	});

  vm.filterSkill = function(event, skill){
  	if(angular.element(event.target).hasClass('highlight')){
  		console.log('has class');
  		vm.searchSkill = "";
  		angular.element(event.target).removeClass('highlight');
  	} else {
  		$('.search-skills .highlight').removeClass('highlight');
	  	vm.searchSkill = skill;
	  	angular.element(event.target).addClass('highlight');
	  }
  }

  vm.generalRequest = function(){
  	var vm = this;

  	ReqWorker.worker = {
  		image:"gavin.png",
  		name:"To Be Determined",
  		skills:[{name:"TBD"}]
  	}

  	$location.path('/temp-request');

  	vm.submitRequest = function(){

  	}


  }

  vm.requestWorker = function(worker){
  	ReqWorker.worker = worker;
  	$location.path('/temp-request');
  }

});

app.controller('tempRequestController', function(ReqWorker, Requests, $location, Success){
	var vm = this;
	vm.worker = ReqWorker.worker;
	vm.formData = {
		worker: vm.worker.name
	};


	vm.formData.department = "department";


	vm.submitRequest = function(){
		Requests.createRequest(vm.formData).success(function(data){
			console.log('return data : ', data);
			Success.message = "Thank you for requesting work! We will contact you shortly with more information and next steps."
			$location.path('/success');
		});
	}

});

app.controller('negativeHoursController', function(Grants, Upload, $location, Success){
	var vm = this;
	vm.formData = {};
	vm.formData.department = "department";

	vm.submitApplication = function(){
      if (vm.files && vm.files.length) {
        Upload.upload({
            url: 'api/grant',
            arrayKey: '',
            data: {
            	file: vm.files, 
            	'name': vm.formData.name, 
            	'email': vm.formData.email, 
            	'phone': vm.formData.phone, 
            	'department': vm.formData.department, 
            	'summary': vm.formData.summary, 
            	'timeline': vm.formData.timeline
            }
        });
      }
      Success.message = "Thank you for applying to our labor grant! We will contact you shortly with more information along with our final decision on the recipient.";
			$location.path('/success');

	}

	vm.message = "it's only for part of the time";
});

app.controller('successController', function(Success){
	var vm = this;
	vm.message = Success.message;
	console.log('success message: ', Success.message)
});