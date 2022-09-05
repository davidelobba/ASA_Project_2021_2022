

const Observable = require('..//utils//Observable');

class Door extends Observable {
    constructor (house, name, room) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.room = room
        this.set('status', 'unlocked')   // observable
    }
    openDoor() {
        this.status = 'unlocked'
        this.house.rooms[this.room].door_status = this.status
        console.log(this.name, ' is unlocked')
    }
    closeDoor() {
        this.status = 'locked'
        this.house.rooms[this.room].door_status = this.status
        console.log(this.name, ' is locked')
    }
}

module.exports = Door;