const { MessageDispatcher, Postman, PostmanAcceptAllRequest } = require('../utils/dispatcher');
const WashingMachine = require('../devices/WashingMachine');
const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const {SenseDryerGoal_dispatcher, SenseDryerIntention_dispatcher} = require('..\\house\\DryerSensor_dispatcher');



class SenseWashingmachine_dispatcherGoal extends Goal {

    constructor (washingmachine = [], house) {
        super()

        /** @type {Array<WashingMachine>} WashingMachine */
        this.washingmachine = washingmachine
        /** @type {myHouse} house */
        this.house = house;

    }

}

class SenseWashingmachineIntention_dispatcher extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<WashingMachine>} WashingMachine */
        this.washingmachine = this.goal.washingmachine
        /** @type {myHouse} house */
        this.house = this.goal.house;
    }
    
    static applicable (goal) {
        return goal instanceof SenseWashingmachine_dispatcherGoal
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

                    if (status == 'off') {
                        MessageDispatcher.authenticate(this.agent).sendTo('DryerAgent', new SenseDryerGoal_dispatcher([this.house.devices.laundry_dryer], this.house))
                    }
                }
            });

            washingmachineGoals.push(washingmachineGoalPromise)
        }
        yield Promise.all(washingmachineGoals)
    }

}

module.exports = {SenseWashingmachine_dispatcherGoal, SenseWashingmachineIntention_dispatcher}