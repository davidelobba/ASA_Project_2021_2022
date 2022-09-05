const WashingMachine = require('../devices/WashingMachine');
const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');



class SenseWashingmachineGoal extends Goal {

    constructor (washingmachine = []) {
        super()

        /** @type {Array<WashingMachine>} WashingMachine */
        this.washingmachine = washingmachine

    }

}

class SenseWashingmachineIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<WashingMachine>} WashingMachine */
        this.washingmachine = this.goal.washingmachine
    }
    
    static applicable (goal) {
        return goal instanceof SenseWashingmachineGoal
    }

    *exec () {
        var washingmachineGoals = []
        for (let c of this.washingmachine) {     
            let washingmachineGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await c.notifyChange('status')
                    this.log('sense: washingmachine ' + c.name + ' ' + status)
                    this.agent.beliefs.declare('washingmachine_on '+c.name, status=='on')
                    this.agent.beliefs.declare('washingmachine_off '+c.name, status=='off')
                }
            });

            washingmachineGoals.push(washingmachineGoalPromise)
        }
        yield Promise.all(washingmachineGoals)
    }

}

module.exports = {SenseWashingmachineGoal, SenseWashingmachineIntention}