app.controller("viewCandidatesCtrl",['cfactory', function(cfactory) {
	var vm = this;
	vm.candidates = [];

	vm.funciones = {

		getCandidates : function() {
			cfactory.getCandidates.then(function(respuesta) {
				console.log("Obteniendo candidatos");
				vm.candidates = respuesta;
			}, function(respuesta) {
				console.log("Error obteniendo candidatos");
			})
		}
	}
	
	//vm.funciones.getCandidates();
}]);