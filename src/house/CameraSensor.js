const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const Camera = require('..\\devices\\Camera');



class SenseCameraGoal extends Goal {

    constructor (camera = []) {
        super()

        /** @type {Array<Camera>} camera */
        this.camera = camera

    }

}

class SenseCameraIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Camera>} camera */
        this.camera = this.goal.camera
    }
    
    static applicable (goal) {
        return goal instanceof SenseCameraGoal
    }

    *exec () {
        var cameraGoals = []
        for (let c of this.camera) {     
            let cameraGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await c.notifyChange('status')
                    this.log('sense: camera ' + c.name + ' ' + status)
                    this.agent.beliefs.declare('camera_on '+c.name, status=='on')
                    this.agent.beliefs.declare('camera_off '+c.name, status=='off')

                    let function_ = await c.notifyChange('function_')
                    this.log('sense: camera ' + c.name + ' ' + function_)
                    this.agent.beliefs.declare('camera_recording '+c.name, function_=='record')
                    this.agent.beliefs.declare('camera_not_recording '+c.name, function_=='not_record')
                }
            });

            cameraGoals.push(cameraGoalPromise)
        }
        yield Promise.all(cameraGoals)
    }

}

module.exports = {SenseCameraGoal, SenseCameraIntention}