app.controller("viewCandidatesCtrl",['$http', '$window', '$location', function($http, $window, $location ){
	var vm = this;
	vm.candidates = [];
	var urlGetCandidates = 'http://localhost:6001/getCandidates';
	var urlVote = 'http://localhost:6001/vote';

	vm.myVote = {};

	vm.funciones = {

		getCandidates : function() {
			$http.get(urlGetCandidates)
			.then(function(respuesta) {
				console.log("Obteniendo candidatos");
				vm.candidates = respuesta;
			}).catch(error => {
				console.log("Error obteniendo candidatos");
			})	
		},

		vote : function() {
			$http.post(urlVote, vm.myVote)
			.then(function(respuesta) {
				console.log("Obteniendo votos");

			vm.funciones.viewResults();
				
			}).catch(error => {
				console.log("Error votando");
			})	
		},

		viewResults : function() {

			$http.get(urlGetCandidates)
			.then(function(respuesta) {
				console.log("Viendo resultados");
				vm.candidates = respuesta;
				$window.location.href='#/results';
			}).catch(error => {
				console.log("Error viendo resultados");
			})
		}
	}
	
	vm.funciones.getCandidates();
}]);

