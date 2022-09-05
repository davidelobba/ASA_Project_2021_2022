const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const VacuumCleaner = require('..\\devices\\VacuumCleaner');



class SenseVacuumCleanerGoal extends Goal {

    constructor (vacuum = []) {
        super()

        /** @type {Array<VacuumCleaner>} vacuum */
        this.vacuum = vacuum

    }

}

class SenseVacuumCleanerIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<VacuumCleaner>} vacuum */
        this.vacuum = this.goal.vacuum
    }
    
    static applicable (goal) {
        return goal instanceof SenseVacuumCleanerGoal
    }

    *exec () {
        var vacuumGoals = []
        for (let v of this.vacuum) {     
            let vacuumGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await v.notifyChange('status')
                    this.log('sense: vacuum cleaner ' + v.name + ' ' + status)
                    this.agent.beliefs.declare('vacuum cleaner '+ v.name, status=='on')
                    this.agent.beliefs.declare('vacuum cleaner '+ v.name, status=='off')

                    let room_after = await v.notifyChange('in_room')
                    this.log('sense: person' + v.name + ' moved to ' + room_after)
                    this.agent.beliefs.undeclare('in_room ' + v.name + ' ' + v.room_before)
                    this.agent.beliefs.declare('in_room ' + v.name + ' ' + room_after)
                    this.house.people[v.name].room = room_after

                }
            });

            vacuumGoals.push(vacuumGoalPromise)
        }
        yield Promise.all(vacuumGoals)
    }

}

module.exports = {SenseVacuumCleanerGoal, SenseVacuumCleanerIntention}