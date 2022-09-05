

const Observable = require('..//utils//Observable');

class Small_Light extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // observable
    }
    switchOnLight () {
        this.status = 'on'
        this.house.utilities.electricity.consumption += 15;
        console.log(this.name, ' turned on')
    }
    switchOffLight () {
        this.status = 'off'
        this.house.utilities.electricity.consumption += 0;
        console.log(this.name, ' turned off')
    }
}

module.exports = Small_Light;