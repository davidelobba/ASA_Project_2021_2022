const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const Dryer = require('..\\devices\\Dryer');



class SenseDryerGoal extends Goal {

    constructor (dryer = []) {
        super()

        /** @type {Array<Dryer>} dryer */
        this.dryer = dryer

    }

}

class SenseDryerIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Dryer>} dryer */
        this.dryer = this.goal.dryer
    }
    
    static applicable (goal) {
        return goal instanceof SenseDryerGoal
    }

    *exec () {
        var dryerGoals = []
        for (let c of this.dryer) {     
            let dryerGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await c.notifyChange('status')
                    this.log('sense: dryer ' + c.name + ' ' + status)
                    this.agent.beliefs.declare('dryer_on '+c.name, status=='on')
                    this.agent.beliefs.declare('dryer_off '+c.name, status=='off')
                }
            });

            dryerGoals.push(dryerGoalPromise)
        }
        yield Promise.all(dryerGoals)
    }

}

module.exports = {SenseDryerGoal, SenseDryerIntention}