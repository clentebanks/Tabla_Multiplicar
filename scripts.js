//funcion para seleccionar que tabla de multiplicar quiere aprender
function multi() {

    num = document.getElementById("num").value;
    num = parseInt(num);

    for (var i = 1; i <= 10; i++) {
        multi = num * i;
        document.getElementById("multi").innerHTML+=num + "x" + i + "=" + multi + "<br>";
        //document.write(num + "x" + i + "=" + multi + "<br>");
        
    }
}

//script para juego de probar lo aprendido
var myObject = new Vue({
    el: '#app',
    data: {
        welcome: '¡Bienvenido al juego de las Tablas de Multiplicar!',
        description: 'Conforme aparecen las operaciones deberás escoger la respuesta correcta haciendo click sobre el numero. Tu misión es responder en el menor tiempo posible.',
        opHeaders: ["Reto", "(a)", "(b)", "(c)", "Tiempo"],
        cmdBegin_text: "Empezar a Jugar",
        operations: [],
        maxRounds: 10,
        totalTries: 0,
        totalErrors: 0,
        totalTimeMs: 0,
        averageTimeMs: 0,
        finalResultMessage: ""
    },
    methods: {
        /**
         * Inicia una partida
         * @return {undefined}
         */
        begin: function () {
            let vm = this;
            vm.resetData(vm);
            vm.createChallenge(vm);
            vm.cmdBegin_text = "Jugando...";
        },
        /**
         * Chequea y procesa la respuesta del usuario.
         * @param {type} operation
         * @param {type} response
         * @return {undefined}
         */
        checkResponse: function (operation, response) {
            let vm = this;
            vm.totalTries++;
            if (operation.rightAnswer === response) {
                operation.active = false;
                clearInterval(operation.timer);
                vm.totalTimeMs += operation.timerCounter;
                vm.averageTimeMs = vm.totalTimeMs / vm.operations.length;
                if ((vm.operations).length < vm.maxRounds) {
                    vm.createChallenge(vm);
                } else {
                    if (vm.totalTries > 0 && (vm.totalErrors / vm.totalTries) < 0.20) {
                        vm.finalResultMessage = `¡FELICITACIONES! Alana tu promedio de efectividad es ${(100 * (1 - (vm.totalErrors / vm.totalTries))).toFixed(2)}% con un tiempo promedio de ${(vm.averageTimeMs / 1000).toFixed(2)} segundos.`;
                    } else {
                        vm.finalResultMessage = `Hola Alana, Tu promedio de efectividad es bajo (${(100 * (1 - (vm.totalErrors / vm.totalTries))).toFixed(2)} %). Mejor suerte la próxima vez.`;
                    }
                    vm.cmdBegin_text = "Volver a Jugar";
                }
            } else {
                vm.totalErrors++;
            }
            console.log(operation, response);
        },
        resetData: function (vm) {
            vm.totalTries = 0;
            vm.totalErrors = 0;
            vm.totalTimeMs = 0;
            vm.averageTimeMs = 0;
            vm.finalResultMessage = "";
            vm.operations = [];
        },
        intervalProcessor: function (opToAdd) {
            opToAdd.timerCounter += 100;
            if (opToAdd.timerCounter < 1000) {
                opToAdd.result = opToAdd.timerCounter + " ms";
            } else {
                opToAdd.result = (opToAdd.timerCounter / 1000).toFixed(2) + " s";
            }
        },
        craftOptions: function (goodResult) {
            let options = [];
            const goodPosition = Math.floor(Math.random() * 3);
            for (let i = 0; i < 3; i++) {
                if (i === goodPosition) {
                    options.push(goodResult);
                } else {
                    let option = -1;
                    while (option === -1 || option === goodResult) {
                        option = Math.floor(Math.random() * 10 + 1) * Math.floor(Math.random() * 10 + 1);
                    }
                    options.push(option);
                }
            }
            return options;
        },
        /**
         * Inicializa una nueva operación
         * @param {type} vm
         * @return {undefined}
         */
        createChallenge: function (vm) {
            const operand1 = Math.floor(Math.random() * 10 + 1);
            const operand2 = Math.floor(Math.random() * 10 + 1);
            const goodResult = operand1 * operand2;
            const options = vm.craftOptions(goodResult);
            let opToAdd = {
                question: `${operand1} X ${operand2}`,
                op1: options[0],
                op2: options[1],
                op3: options[2],
                result: "0.00 ms",
                rightAnswer: goodResult
            };
            opToAdd.timerCounter = 0;
            opToAdd.active = true;
            opToAdd.timer = setInterval(function () {
                vm.intervalProcessor(opToAdd);
            }, 100);
            vm.operations.push(opToAdd);
            console.log(opToAdd);
        }
    }
});