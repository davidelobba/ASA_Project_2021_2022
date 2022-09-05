const Goal = require('..\\bdi\\Goal');
const Intention = require('..\\bdi\\Intention');
const Person = require('..\\people\\Person');



class SensePeopleRoomGoal extends Goal {

    constructor (people = [], house) {
        super()

        /** @type {Array<Person>} people */
        this.people = people
        /** @type {myHouse} house */
        this.house = house;

    }

}

class SensePeopleRoomIntention extends Intention {
    
    constructor (agent, goal) {
        super(agent, goal)
        
        /** @type {Array<Person>} people */
        this.people = this.goal.people
        /** @type {myHouse} house */
        this.house = this.goal.house;
    }
    
    static applicable (goal) {
        return goal instanceof SensePeopleRoomGoal
    }

    *exec() {
        let peopleGoals = [];
        for (let p of this.people) {
            let peopleGoalPromise = new Promise(async (res) => {
                while (true) {
                    let room_after = await p.notifyChange('in_room')
                    this.log('sense: person' + p.name + ' moved to ' + room_after)
                    this.agent.beliefs.undeclare('in_room ' + p.name + ' ' + p.room_before)
                    this.agent.beliefs.declare('in_room ' + p.name + ' ' + room_after)
                    this.house.people[p.name].room = room_after
                }
            });

            peopleGoals.push(peopleGoalPromise);
        }
        yield Promise.all(peopleGoals);
    }

}

module.exports = {SensePeopleRoomGoal, SensePeopleRoomIntention}