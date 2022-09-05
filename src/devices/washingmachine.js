

const Observable = require('..//utils//Observable');

class WashingMachine extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // observable
    }
    switchOnWashingMachine () {
        this.status = 'on'
        this.house.utilities.electricity.consumption += 1000;
        console.log(this.name, ' turned on')
    }
    switchOffWashingMachine () {
        this.status = 'off'
        this.house.utilities.electricity.consumption += 0;
        console.log(this.name, ' turned off')
    }
}

module.exports = WashingMachine;