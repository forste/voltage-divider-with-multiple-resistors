var resistors = [
    220,
    560,
    1000,
    4700,
    10000,
    1000000,
    10000000
];
var voltage_in = 5;
var pull_up = 1000;
var numberOfResistors = 4;

console.log();
console.log('voltage in: '+voltage_in+' V');
console.log('pull up: '+pull_up+' ohm');
var resistors_str = '';
resistors = resistors.slice(0, numberOfResistors);
resistors_str = resistors.map(function(r) {
    return ' '+r+' ohm'
});
console.log('resistors: '+resistors_str);
console.log();


function getVoltageOut(numberOfResistors, resistorsTakenOut) {
    resistorsTakenOut = resistorsTakenOut || [];
    var sum = 0;
    for(var i=0; i<numberOfResistors; i++) {
        if(resistorsTakenOut.indexOf(i) === -1) {
            sum += 1/resistors[i];
        }
    };

    var r_1 = pull_up;
    var r_2 = 1/sum;
    return r_2 / (r_1+r_2) * voltage_in;
}

var getVoltageOutForResistors = getVoltageOut.bind(null, numberOfResistors);
var maxEncoding = Math.pow(2, numberOfResistors);

console.log('binary encoding for resistors, e.g. 1010 ... 4th and 2nd resistor not connected, 3nd and 1st resistor connected');

console.log();
console.log('encoding  -  voltage out');
for(var i = 0; i < maxEncoding; i++) {
    var resistorsTakenOut = [];
    var encoding = i; /* binary encoding for resistors, e.g. 1010 ... 4th and 2nd resistor not connected, 3nd and 1st resistor connected */
    var voltage;
    var strEncoding = '';

    //calculate resistors taken out
    for(var j = 0; j < resistors.length; j++) {
        if(encoding%2 == 1) {
            resistorsTakenOut.push(j);
            strEncoding = '1' + strEncoding;
        } else {
            strEncoding = '0' + strEncoding;
        }
        encoding = Math.floor(encoding / 2);
    }

    voltage = getVoltageOutForResistors(resistorsTakenOut);
    console.log(strEncoding+'      -  '+voltage+ ' V');
}
