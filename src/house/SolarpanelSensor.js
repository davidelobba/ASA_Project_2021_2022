const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const SolarPanel = require('..\\devices\\SolarPanel');



class SenseSolarpanelGoal extends Goal {

    constructor (solarpanel = []) {
        super()

        /** @type {Array<SolarPanel>} solarpanel */
        this.solarpanel = solarpanel

    }

}

class SenseSolarpanelIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<SolarPanel>} solarpanel */
        this.solarpanel = this.goal.solarpanel
    }
    
    static applicable (goal) {
        return goal instanceof SenseSolarpanelGoal
    }

    *exec () {
        var solarpanelGoals = []
        for (let c of this.solarpanel) {     
            let solarpanelGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await c.notifyChange('status')
                    this.log('sense: solarpanel ' + c.name + ' ' + status)
                    this.agent.beliefs.declare('solarpanel_on '+c.name, status=='on')
                    this.agent.beliefs.declare('solarpanel_off '+c.name, status=='off')

                    let function_ = await c.notifyChange('function_')
                    this.log('sense: solarpanel ' + c.name + ' ' + function_)
                    this.agent.beliefs.declare('solarpanel_sell '+c.name, function_=='sell')
                    this.agent.beliefs.declare('solarpanel_store '+c.name, function_=='store')
                }
            });

            solarpanelGoals.push(solarpanelGoalPromise)
        }
        yield Promise.all(solarpanelGoals)
    }

}

module.exports = {SenseSolarpanelGoal, SenseSolarpanelIntention}