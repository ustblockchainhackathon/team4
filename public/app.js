var app = angular.module('SecureVoteApp', [ "ngRoute" ]).config(function($routeProvider) {
	$routeProvider.when("/", {
		controller : "viewCandidatesCtrl",
		controllerAs : "vm",
		templateUrl : "viewCandidates.html",
		resolve : {
			delay : function($q, $timeout) {
				var delay = $q.defer();
				$timeout(delay.resolve, 100);
				return delay.promise;
			}
		}
	})

	.when("/selectCandidate", {    			
		controller: "viewCandidatesCtrl",           
		controllerAs: "vm",           
		templateUrl: "autentication.html"        
	})
})	