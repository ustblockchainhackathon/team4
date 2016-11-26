app.controller("viewCandidatesCtrl",['$http', function($http){
	var vm = this;
	vm.candidates = [];
	var url = 'http://usthackathon.mybluemix.net/getCandidates';

	vm.funciones = {

		getCandidates : function() {
			$http.get(url)
			.then(function(respuesta) {
				console.log("Obteniendo candidatos");
				vm.candidates = respuesta;
			}).catch(error => {
				console.log("Error obteniendo candidatos");
			})	
		}
	}
	
	vm.funciones.getCandidates();
}]);