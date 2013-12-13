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

var numberOfResistors = 4;
var getVoltageOutForResistors = getVoltageOut.bind(null, numberOfResistors);
var maxEncoding = Math.pow(2, 4);

for(var i = 0; i < maxEncoding; i++) {
    var resistorsTakenOut = [];
    var encoding = i; /* binary encoding for resistors, e.g. 1010 ... 4th and 2nd resistor not connected, 3nd and 1st resistor connected */
    var voltage;
    var strEncoding = '';

    if(encoding%2 == 1) {
        resistorsTakenOut.push(0);
        strEncoding += '1';
    } else {
        strEncoding += '0';
    }

    encoding = Math.floor(encoding / 2);
    if(encoding%2 == 1) {
        resistorsTakenOut.push(1);
        strEncoding = '1' + strEncoding;
    } else {
        strEncoding = '0' + strEncoding;
    }

    encoding = Math.floor(encoding / 2);
    if(encoding%2 == 1) {
        resistorsTakenOut.push(2);
        strEncoding = '1' + strEncoding;
    } else {
        strEncoding = '0' + strEncoding;
    }

    encoding = Math.floor(encoding / 2);
    if(encoding%2 == 1) {
        resistorsTakenOut.push(3);
        strEncoding = '1' + strEncoding;
    } else {
        strEncoding = '0' + strEncoding;
    }

    voltage = getVoltageOutForResistors(resistorsTakenOut);
    console.log(strEncoding+' :  '+voltage+ ' V');
}
