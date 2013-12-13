var voltage_in = 5;
var maximumResistor = 10000;
var resistorStep = 220;
var numberOfResistors = 4;

calculateVoltagesAndIssues([
    220,
    440,
    560,
    1000
], 220, true);

function calculateBestCombination() {
    var bestCombination = {
        issues : 9999999999999
    };
    var pull_up = resistorStep;
    while(pull_up < maximumResistor) {
        var base = resistorStep;
        while(base < maximumResistor) {
            var resistorStepMultiplicator = 1;
            while(resistorStepMultiplicator < 10) { //TODO
                var resistors = [];
                for(var i = 0; i < numberOfResistors; i++) {
                    var resistor = base + (i * resistorStep * resistorStepMultiplicator);
                    resistors.push(resistor);
                }
                var voltagesAndIssues = calculateVoltagesAndIssues(resistors, pull_up, false);
                if(voltagesAndIssues.issues < bestCombination.issues) {
                    bestCombination = {
                        voltages : voltagesAndIssues.voltages,
                        issues : voltagesAndIssues.issues,
                        resistors : resistors,
                        pull_up : pull_up
                    };
                }

                resistorStepMultiplicator++;
            }
            base += resistorStep;
        }
        pull_up += resistorStep;
    }
    console.log('bestCombination: \n'+
                '\nvoltages : \n'+voltagesToString(bestCombination.voltages),
                '\nissues : '+bestCombination.issues,
                '\nresistors : '+bestCombination.resistors,
                '\npull_up : '+bestCombination.pull_up
               );
}

function calculateVoltagesAndIssues(resistors, pull_up, logging) {
    var numberOfResistors = resistors.length;
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

    // console.log('binary encoding for resistors, e.g. 1010 ... 4th and 2nd resistor not connected, 3nd and 1st resistor connected');

    // console.log();
    // console.log('encoding  -  voltage out');
    var voltages = [];
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
        if(isNaN(voltage)) {
            voltage = voltage_in;
        }

        voltages.push({
            strEncoding : strEncoding,
            voltage : voltage
        });

    }
    voltages = voltages.sort(function(a, b) {
        return a.voltage - b.voltage;
    });

    var oldVoltage = 0;
    var voltagesThatNeedAdjustment = 0;
        voltages.forEach(function(voltage) {
            var voltageOK;
            var difference = voltage.voltage - oldVoltage;
                if(difference < 0.1) {
                    voltageOK = '  - voltage differs only by '+difference;
                    voltagesThatNeedAdjustment++;
                } else {
                    voltageOK = '  - voltage ok';
                }
            oldVoltage = voltage.voltage;
            // console.log(voltage.strEncoding+'      -  '+voltage.voltage+ ' V'+voltageOK);
        });

    if(logging) {
        console.log();
        console.log('voltage in: '+voltage_in+' V');
        console.log('pull up: '+pull_up+' ohm');
        console.log('resistors '+resistorsToString(resistors));
        console.log('voltages (issues '+voltagesThatNeedAdjustment+') \n'+voltagesToString(voltages));
    }
    return {
        voltages : voltages,
        issues : voltagesThatNeedAdjustment
    };
}

function voltagesToString(voltages) {
    var str = '';
    var oldVoltage = 0;
    voltages.forEach(function(voltage) {
        var voltageOK;
        var difference = voltage.voltage - oldVoltage;
        if(difference < 0.1) {
            voltageOK = '  - voltage differs only by '+difference;
        } else {
            voltageOK = '  - voltage ok';
        }
        oldVoltage = voltage.voltage;
        str += voltage.strEncoding+'      -  '+voltage.voltage+ ' V'+voltageOK+'\n';
    });
    return str;
}

function resistorsToString(resistors) {
    var str = '';
    str = resistors.map(function(r) {
        return ' '+r+' ohm'
    });
    return str;
}
