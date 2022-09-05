

const Observable = require('..//utils//Observable');

class SolarPanel extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // observable
        this.set('function_','sell')
    }
    switchOnSolarPanel () {
        this.status = 'on'
        this.house.utilities.electricity.consumption += 0;
        console.log(this.name, '\t turned on')
    }
    switchOffSolarPanel () {
        this.status = 'off'
        this.house.utilities.electricity.consumption += 0;
        console.log(this.name,'\t turned off')
    }
    sellEnergy () {
        if(this.status =='on'){
            this.function_ = 'sell'
            this.house.utilities.electricity.consumption -= 3000;
            console.log(this.name, '\t selling energy')
        }
    }
    storeEnergy () {
        if(this.status =='on'){
            this.function_ = 'store'
            this.house.utilities.electricity.consumption = 0;
            console.log(this.name, '\t storing energy')
        }
    }
}

module.exports = SolarPanel;