const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const Thermostat = require('..\\devices\\Thermostat');



class SenseThermostatGoal extends Goal {

    constructor (thermostat = []) {
        super()

        /** @type {Array<Thermostat>} Thermostat */
        this.thermostat = thermostat

    }

}

class SenseThermostatIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Thermostat>} dryer */
        this.thermostat = this.goal.thermostat
    }
    
    static applicable (goal) {
        return goal instanceof SenseThermostatGoal
    }

    *exec () {
        var thermostatGoals = []
        for (let c of this.thermostat) {     
            let thermostatGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await c.notifyChange('status')
                    this.log('sense: thermostat ' + c.name + ' ' + status)
                    this.agent.beliefs.declare('thermostat_on '+c.name, status=='on')
                    this.agent.beliefs.declare('thermostat_off '+c.name, status=='off')

                    let temp = await c.notifyChange('temp')
                    this.log('sense: thermostat ' + c.name + ' ' + temp)
                    this.agent.beliefs.declare('thermostat_changed_temperature '+c.name, temp!='20')
                    this.agent.beliefs.declare('thermostat_default_temp '+c.name, temp=='20')
                }
            });

            thermostatGoals.push(thermostatGoalPromise)
        }
        yield Promise.all(thermostatGoals)
    }

}

module.exports = {SenseThermostatGoal, SenseThermostatIntention}