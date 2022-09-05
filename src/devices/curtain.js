

const Observable = require('../utils/Observable');

class Curtain extends Observable {
    constructor (house, name) {
        super()
        this.house = house;         // reference to the house
        this.name = name;           // non-observable
        this.set('status', 'opened')   // observable
    }
    openCurtain() {
        this.status = 'opened'
        this.house.utilities.electricity.consumption += 5;
        console.log(this.name, ' is opened')
    }
    closeCurtain() {
        this.status = 'closed'
        this.house.utilities.electricity.consumption += 0;
        console.log(this.name, ' is closed')
    }
}

module.exports = Curtain;