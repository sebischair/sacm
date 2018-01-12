var input = `0, ninguna| 1, <1h dia | 2, de 1 a 3 h al dia | 3, de 3 a 5 horas al dia | 4, de 5 a 7 h al dia | 5, mas de 7 horas al dia`;

var id = '';

var split = input.split('|');

//var result = [];
split.forEach((el) => {
	let ires = el.split(',');
	//result.push('<EnumerationOption value="'+ires[0]+'" description="'+ires[1]+'"/>');
	console.log('<EnumerationOption value="'+ires[0].trim()+'" description="'+ires[1].trim()+'"/>'.trim());
});

return;

console.log('##########################');
console.log('##########################');
console.log('##########################');
console.log('##########################');


input = `YPASdipme
YPASti
YPASsdipme
YPASsti
YPASsactfi
YPASpdipme
YPASpti
YPASpsdipme
YPASpsti
YPASspas
YPAStiemov
YPASstiemov
YPASesdep
YPASsesdep
YPAStisen
YPASstisen`;

var descriptions = `¿Aproximadamente cuantas veces durante el ultimo mes ha participado en actividades intensas que duraron al menos 10 minutos, y provocaron importantes aumentos en su respiracion, pulso, cansancio de piernas o le hacían sudar?
¿Aproximadamente durante cuanto tiempo realizo cada vez esta actividad vigorosa?
Score actividad fisica intensa dias por mes
Score actividad fisica intensa tiempo
YPAS indice Act Vigorosa
¿Piense en los paseos que ha realizado durante el ultimo mes. Aproximadamente cuantas veces al mes fue a pasear al menos 10 minutos o más sin parar pero que no fue suficiente para causar grandes incrementos en la respiración, pulso, cansancio de piernas ni le hacía sudar?
¿Cuando fue a pasear asi, durante cuantos minutos camino?
Score Paseos dias por mes
Score Paseos tiempo
YPAS indice Pasear
Aproximadamente cuantas horas al dia pasa moviendose de un lado a otro mientras hace cosas?(Por favor, insistir sobre el tiempo realmente en movimiento)
YPAS indice Movimiento
¿Piense en cuanto tiempo paso de pie, como promedio, durante el ultimo mes.Aproximadamente cuantas horas al dia esta de pie?
YPAS indice Bipedestacion
¿Aproximadamente, en un día típico del último mes, cuantas horas paso sentado/a?
YPAS indice Sedestacion`;

var type = 'enumeration';
//type = "number";

split = input.split('\n');
descriptions = descriptions.split('\n');

console.log(split);

//return;

split.forEach((el, index) => {
	let ires = el.split('@');
	if(type=='enumeration') {
		console.log('<AttributeDefinition id="'+el.trim()+'" type="'+type+'" description="'+descriptions[index].trim()+'">'.trim() + '\n' + '</AttributeDefinition>');
	} else {
		console.log('<AttributeDefinition id="'+el.trim()+'" type="'+type+'" description="'+descriptions[index].trim()+'"/>'.trim());
	}
	
});
