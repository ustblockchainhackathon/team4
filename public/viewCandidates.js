app.controller("viewCandidatesCtrl",['$http', '$window', '$location', function($http, $window, $location ){
	var vm = this;
	vm.candidates = [];
	var url = 'http://localhost:6001/getCandidates';

	vm.funciones = {

		getCandidates : function() {
			$http.get(url)
			.then(function(respuesta) {
				console.log("Obteniendo candidatos");
				vm.candidates = respuesta;
			}).catch(error => {
				console.log("Error obteniendo candidatos");
			})	
		},

		selectCandidate : function() {
			$window.location.href='#/selectCandidate';
		}
	}
	
	vm.funciones.getCandidates();
}]);