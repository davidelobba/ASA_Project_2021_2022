

const Observable = require('..//utils//Observable');

class Dryer extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // observable
    }
    switchOnDryer(){
        this.status = 'on'
        this.house.utilities.electricity.consumption += 2000;
        console.log(this.name, ' turned on')
    }
    switchOffDryer(){
        this.status = 'off'
        this.house.utilities.electricity.consumption += 0;
        console.log(this.name, ' turned off')
    }
}

module.exports = Dryer;