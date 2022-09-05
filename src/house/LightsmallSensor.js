const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const Small_Light = require('..\\devices\\Small_Light');



class SenseSmall_LightsGoal extends Goal {

    constructor (small_lights = []) {
        super()

        /** @type {Array<Small_Light>} lights */
        this.small_lights = small_lights

    }

}

class SenseSmall_LightsIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Small_Light>} lights */
        this.small_lights = this.goal.small_lights
    }
    
    static applicable (goal) {
        return goal instanceof SenseSmall_LightsGoal
    }

    *exec () {
        var small_lightsGoals = []
        for (let l of this.small_lights) {
            // let lightGoalPromise = this.agent.postSubGoal( new SenseOneLightGoal(l) )
            // lightsGoals.push(lightGoalPromise)
            
            let small_lightGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await l.notifyChange('status')
                    this.log('sense: small:light ' + l.name + ' switched ' + status)
                    this.agent.beliefs.declare('small_light_on '+l.name, status=='on')
                    this.agent.beliefs.declare('small_light_off '+l.name, status=='off')
                }
            });

            small_lightsGoals.push(small_lightGoalPromise)
        }
        yield Promise.all(small_lightsGoals)
    }

}


module.exports = {SenseSmall_LightsGoal, SenseSmall_LightsIntention}