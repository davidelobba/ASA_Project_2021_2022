

const Observable = require('..//utils//Observable');

class Thermostat extends Observable {
    constructor (house, name, room) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.room = room
        this.set('status', 'off')   // observable
        this.set('temp', '20')
    }
    switchOnThermostat () {
        this.status = 'on'
        console.log(this.name, ' turned on')
    }
    switchOffThermostat () {
        this.status = 'off'
        console.log(this.name, ' turned off')
    }
    setTemperature (tem) {
        this.temp = tem
        this.house.rooms[this.room].temp = tem
        console.log(this.name, ' temperature set to ' + tem)
    }
    
}

module.exports = Thermostat;