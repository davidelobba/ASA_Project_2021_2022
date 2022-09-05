const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const Door = require('..\\devices\\Door');



class SenseDoorGoal extends Goal {

    constructor (door = []) {
        super()

        /** @type {Array<Door>} door */
        this.door = door

    }

}

class SenseDoorIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Door>} door */
        this.door = this.goal.door
    }
    
    static applicable (goal) {
        return goal instanceof SenseDoorGoal
    }

    *exec () {
        var doorGoals = []
        for (let c of this.door) {     
            let doorGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await c.notifyChange('status')
                    this.log('sense: door ' + c.name + ' ' + status)
                    this.agent.beliefs.declare('door_locked '+c.name, status=='locked')
                    this.agent.beliefs.declare('door_unlocked '+c.name, status=='unlocked')
                }
            });

            doorGoals.push(doorGoalPromise)
        }
        yield Promise.all(doorGoals)
    }

}

module.exports = {SenseDoorGoal, SenseDoorIntention}