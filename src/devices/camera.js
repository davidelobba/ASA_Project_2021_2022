

const Observable = require('../utils/Observable');

class Camera extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'off')   // observable
        this.set('function_','record')
    }
    switchOnCamera () {
        this.status = 'on'
        this.house.utilities.electricity.consumption += 10;
        console.log(this.name, ' is on')
    }
    switchOffCamera () {
        this.status = 'off'
        this.house.utilities.electricity.consumption += 0;
        console.log(this.name, ' is off')
    }
    recordVideo () {
        if(this.status == 'on'){
            this.function_ = 'record'
            console.log(this.name, ' is recording')
        }
    }
    not_recordVideo () {
        if(this.status == 'on'){
            this.function_ = 'not_record'
            console.log(this.name, ' is not recording')
        }
    }
}

module.exports = Camera;