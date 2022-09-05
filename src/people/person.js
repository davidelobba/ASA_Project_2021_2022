

const Observable = require('../utils/Observable');



class Person extends Observable {
    constructor (house, name, room_prev, room_now) {
        super()
        this.house = house;             // reference to the house
        this.name = name;               // non-observable
        this.room = room_now;
        this.set('in_room', room_now);  // observable
        this.room_before = room_prev;
        
    }
    moveTo (to) {
        if ( this.house.rooms[this.in_room].doors_to.includes(to) ) {
            console.log(this.name, '\t moved from', this.in_room, 'to', to)
            this.room_before = this.in_room;
            this.in_room = to
            this.room = to
            return true
        }
        else {
            console.log(this.name, '\t failed moving from', this.in_room, 'to', to)
            return false
        }
    }
}



module.exports = Person;