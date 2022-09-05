const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const Dryer = require('..\\devices\\Dryer');



class SenseDryerGoal_dispatcher extends Goal {

    constructor (dryer = [], house) {
        super()

        /** @type {Array<Dryer>} dryer */
        this.dryer = dryer
        /** @type {myHouse} house */
        this.house = house;

    }

}

class SenseDryerIntention_dispatcher extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Dryer>} dryer */
        this.dryer = this.goal.dryer
        /** @type {myHouse} house */
        this.house = this.goal.house;
    }
    
    static applicable (goal) {
        return goal instanceof SenseDryerGoal_dispatcher
    }

    *exec () {
        var dryerGoals = []
        for (let c of this.dryer) {     
            let dryerGoalPromise = new Promise( async res => {
                c.switchOnDryer()
            });

            dryerGoals.push(dryerGoalPromise)
        }
        yield Promise.all(dryerGoals)
    }

}

module.exports = {SenseDryerGoal_dispatcher, SenseDryerIntention_dispatcher}