const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const Curtain = require('..\\devices\\Curtain');



class SenseCurtainGoal extends Goal {

    constructor (curtain = []) {
        super()

        /** @type {Array<Curtain>} curtain */
        this.curtain = curtain

    }

}



class SenseCurtainIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Curtain>} curtain */
        this.curtain = this.goal.curtain
    }
    
    static applicable (goal) {
        return goal instanceof SenseCurtainGoal
    }

    *exec () {
        var curtainGoals = []
        for (let c of this.curtain) {     
            let curtainGoalPromise = new Promise( async res => {
                while (true) {
                    let status = await c.notifyChange('status')
                    this.log('sense: curtain ' + c.name + ' ' + status)
                    this.agent.beliefs.declare('curtain_opened '+c.name, status=='opened')
                    this.agent.beliefs.declare('curtain_closed '+c.name, status=='closed')
                }
            });

            curtainGoals.push(curtainGoalPromise)
        }
        yield Promise.all(curtainGoals)
    }

}



class SenseOneCurtainGoal extends Goal {

    constructor (curtain) {
        super()

        /** @type {Curtain} curtain */
        this.curtain = curtain

    }

}



class SenseOneCurtainIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)

        /** @type {Curtain} curtain */
        this.curtain = this.goal.curtain
    }

    static applicable (goal) {
        return goal instanceof SenseOneCurtainGoal
    }

    *exec () {
        while (true) {
            let status = yield this.curtain.notifyChange('status')
            this.log('sense: curtain ' + this.curtain.name + ' ' + status)
            this.agent.beliefs.declare('curtain_opened '+this.curtain.name, status=='opened')
            this.agent.beliefs.declare('curtain_closed '+this.curtain.name, status=='closed')
        }
    }

}



module.exports = {SenseCurtainGoal, SenseCurtainIntention, SenseOneCurtainGoal, SenseOneCurtainIntention}