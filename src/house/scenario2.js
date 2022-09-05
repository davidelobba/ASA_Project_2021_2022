const Observable =  require('../utils/Observable')
const Clock =  require('../utils/Clock')

const Agent = require('../bdi/Agent')

const Person = require('../people/Person')

const Light = require('../devices/Light')
const Camera = require('../devices/Camera')
const Curtain = require('../devices/Curtain')
const Door = require('../devices/Door')
const Dryer = require('../devices/Dryer')
const Small_Light = require('../devices/Small_Light')
const SolarPanel = require('../devices/SolarPanel')
const Thermostat = require('../devices/Thermostat')
const VacuumCleaner = require('../devices/VacuumCleaner')
const WashingMachine = require('../devices/WashingMachine')

const { AlarmGoal, AlarmIntention} = require('.\\Alarm')

const {SenseDryerGoal_dispatcher, SenseDryerIntention_dispatcher} = require('..\\house\\DryerSensor_dispatcher');
const {SenseWashingmachine_dispatcherGoal, SenseWashingmachineIntention_dispatcher} = require('..\\house\\WashingmachineSensor_dispatcher');
const { SenseVacuumCleanerGoal, SenseVacuumCleanerIntention } = require('./VacuumSensor');

const { SensePeopleRoomGoal, SensePeopleRoomIntention } = require('./PeopleRoomSensor');

const {Postman, PostmanAcceptAllRequest} = require('../utils/dispatcher')



class House {
    constructor () {
        this.people = { Jack: new Person(this, 'Jack', 'undefined' ,'bedroom_1') ,
                        John: new Person(this, 'John', 'undefined', 'bedroom_1') ,
                        Mary: new Person(this, 'Mary', 'undefined', 'bedroom_1') }
        this.rooms_FF = {
            kitchen: { name: 'kitchen', doors_to: ['living_room', 'bedroom_1', 'bedroom_2', 'pantry'], in_room: false, temp: 20 },
            living_room: { name: 'living_room', doors_to: ['kitchen', 'bathroom', 'hallway'], in_room: false , temp: 20 },
            bathroom: { name: 'bathroom', doors_to: ['living_room'], in_room: false, temp: 20 },
            bedroom_1: { name: 'bedroom_1', doors_to: ['walk_in_closet', 'kitchen'], in_room: false , temp: 20 },
            walk_in_closet: { name: 'walk_in_closet', doors_to: ['bedroom_1'], in_room: false},
            bedroom_2: { name: 'bedroom_2', doors_to: ['kitchen'] , in_room: false, temp: 20},
            pantry: { name: 'pantry', doors_to: ['kitchen'], in_room: false, temp: 18 },
        }
        this.rooms_GF = {
            wine_cellar: { name: 'wine_cellar', doors_to: ['hallway'], in_room: false},
            laundry: { name: 'laundry', doors_to: ['hallway'], in_room: false},
            utility_room: { name: 'utility_room', doors_to: ['hallway'], in_room: false},
            garage: { name: 'garage', doors_to: ['hallway'], in_room: false},
            basement_room: { name: 'basement_room', doors_to: ['hallway'], in_room: false, temp: 18 },
            hallway: { name: 'hallway', doors_to: ['wine_cellar', 'laundry', 'utility_room', 'garage', 'basement_room', 'living_room'], in_room: false}
        }
        this.devices = {
            basement_room_light: new Light(this, 'basement_room_light'),
            basement_room_curtains_1: new Curtain(this, 'basement_room_curtains_1'),
            basement_room_curtains_2: new Curtain(this, 'basement_room_curtains_2'),
            basement_room_door: new Door(this, 'basement_room_door'),
            basement_room_thermostat: new Thermostat(this, 'basement_room_thermostat'),

            laundry_light: new Light(this, 'laundry_light'),
            laundry_door: new Door(this, 'laundry_door'),
            laundry_washing_machine: new WashingMachine(this, 'laundry_washing_machine'),
            laundry_dryer: new Dryer(this, 'laundry_dryer'),

            utility_room_small_light: new Small_Light(this, 'utility_room_small_light'),
            utility_room_door: new Door(this, 'utility_room_door'),

            garage_light: new Light(this, 'garage_light'),
            garage_door: new Door(this, 'garage_door'),

            wine_cellar_light: new Light(this, 'wine_cellar_light'),
            wine_cellar_door: new Door(this, 'wine_cellar_door'),

            hallway_light: new Light(this, 'hallway_light'),

            living_room_light: new Light(this, 'living_room_light'),
            living_room_curtains: new Curtain(this, 'living_room_curtains'),
            living_room_door: new Door(this, 'living_room_door'),
            living_room_thermostat: new Thermostat(this, 'living_room_thermostat'),

            bathroom_light: new Light(this, 'bathroom_light'),
            bathroom_door: new Door(this, 'bathroom_door'),
            bathroom_thermostat: new Thermostat(this, 'bathroom_thermostat'),
            bathroom_curtains: new Curtain(this, 'bathroom_curtains'),

            bedroom_1_light: new Light(this, 'bedroom_1_light'),
            bedroom_1_curtains: new Curtain(this, 'bedroom_1_curtains'),
            bedroom_1_door: new Door(this, 'bedroom_1_door'),
            bedroom_1_thermostat: new Thermostat(this, 'bedroom_1_thermostat'),

            bedroom_2_light: new Light(this, 'bedroom_2_light'),
            bedroom_2_curtains: new Curtain(this, 'bedroom_2_curtains'),
            bedroom_2_door: new Door(this, 'bedroom_2_door'),
            bedroom_2_thermostat: new Thermostat(this, 'bedroom_2_thermostat'),

            kitchen_light: new Light(this, 'kitchen_light'),
            kitchen_curtains_1: new Curtain(this, 'kitchen_curtains_1'),
            kitchen_curtains_2: new Curtain(this, 'kitchen_curtains_2'),
            kitchen_curtains_3: new Curtain(this, 'kitchen_curtains_3'),
            kitchen_door: new Door(this, 'kitchen_door'),
            kitchen_thermostat: new Thermostat(this, 'kitchen_thermostat'),

            walk_in_closet_light: new Light(this, 'walk_in_closet_light'),
            walk_in_closet_door: new Door(this, 'walk_in_closet_door'),

            pantry_small_light: new Small_Light(this, 'pantry_small_light'),
            pantry_door: new Door(this, 'pantry_door'),
            pantry_thermostat: new Thermostat(this, 'pantry_thermostat'),

            SolarPanel_1 : new SolarPanel(this, 'SolarPanel_1'),
            SolarPanel_2 : new SolarPanel(this, 'SolarPanel_2'),

            Camera_nord : new Camera(this, 'Camera_nord'),
            Camera_sud : new Camera(this, 'Camera_sud'),
            Camera_ovest : new Camera(this, 'Camera_ovest'),
            Camera_est : new Camera(this, 'Camera_est'),
            
            VacuumCleaner_first_floor : new VacuumCleaner(this, 'VacuumCleaner_first_floor', 'undefined' ,'living_room'),
            VacuumCleaner_ground_floor : new VacuumCleaner(this, 'VacuumCleaner_ground_floor', 'undefined' ,'living_room'),

        }

        this.utilities = {
            electricity: new Observable( { consumption: 0 } )
        }
    }
}




// House, which includes rooms and devices
var myHouse = new House()

// Agents
var myAgent = new Agent('myAgent')
myAgent.intentions.push(AlarmIntention)
myAgent.postSubGoal( new AlarmGoal({hh:7, mm:0}) )

myAgent.intentions.push(SensePeopleRoomIntention)
myAgent.postSubGoal( new SensePeopleRoomGoal( [myHouse.people.John, myHouse.people.Mary, myHouse.people.Jack], myHouse ) )

myAgent.intentions.push(PostmanAcceptAllRequest)
myAgent.postSubGoal( new Postman())

var WashingMachineAgent = new Agent('WashingMachineAgent')

WashingMachineAgent.intentions.push(PostmanAcceptAllRequest)
WashingMachineAgent.intentions.push(SenseWashingmachineIntention_dispatcher)
WashingMachineAgent.postSubGoal( new Postman())
WashingMachineAgent.postSubGoal( new SenseWashingmachine_dispatcherGoal([myHouse.devices.laundry_washing_machine], myHouse) )

var DryerAgent = new Agent('DryerAgent')
DryerAgent.intentions.push(PostmanAcceptAllRequest)
DryerAgent.intentions.push(SenseDryerIntention_dispatcher)
DryerAgent.postSubGoal( new Postman())
DryerAgent.postSubGoal(new SenseDryerGoal_dispatcher([myHouse.devices.laundry_dryer], myHouse))



var VacuumCleanerAgentFF = new Agent('VacuumCleanerAgentFF')
VacuumCleanerAgentFF.intentions.push(SenseVacuumCleanerIntention)
VacuumCleanerAgentFF.postSubGoal(new SenseVacuumCleanerGoal([myHouse.devices.VacuumCleaner_first_floor]))

var VacuumCleanerAgentGF = new Agent('VacuumCleanerAgentGF')
VacuumCleanerAgentGF.intentions.push(SenseVacuumCleanerIntention)
VacuumCleanerAgentGF.postSubGoal(new SenseVacuumCleanerGoal([myHouse.devices.VacuumCleaner_ground_floor]))

var PlanningGoal = require('../pddl/PlanningGoal')
const {Move, switchOnVacuumCleaner, switchOffVacuumCleaner, Clean, Suck, RetryGoal, RetryFourTimesIntention} = require('./vacuumCleaner_pddl')
let {OnlinePlanning} = require('../pddl/OnlinePlanner')([Move, switchOnVacuumCleaner, switchOffVacuumCleaner, Clean, Suck])

VacuumCleanerAgentFF.intentions.push(OnlinePlanning)
VacuumCleanerAgentFF.intentions.push(RetryFourTimesIntention)

VacuumCleanerAgentGF.intentions.push(OnlinePlanning)
VacuumCleanerAgentGF.intentions.push(RetryFourTimesIntention)

VacuumCleanerAgentFF.beliefs.declare('vacuum vacuum_cleaner_first_floor')
VacuumCleanerAgentFF.beliefs.declare('state off')
VacuumCleanerAgentFF.beliefs.declare('state on')
VacuumCleanerAgentFF.beliefs.declare('set_status vacuum_cleaner_first_floor off')

VacuumCleanerAgentGF.beliefs.declare('vacuum vacuum_cleaner_ground_floor')
VacuumCleanerAgentGF.beliefs.declare('state off')
VacuumCleanerAgentGF.beliefs.declare('state on')
VacuumCleanerAgentGF.beliefs.declare('set_status vacuum_cleaner_ground_floor off')


VacuumCleanerAgentFF.beliefs.declare('room bedroom_1')
VacuumCleanerAgentFF.beliefs.declare('room bedroom_2')
VacuumCleanerAgentFF.beliefs.declare('room living_room')
VacuumCleanerAgentFF.beliefs.declare('room kitchen')
VacuumCleanerAgentFF.beliefs.declare('room walk_in_closet')
VacuumCleanerAgentFF.beliefs.declare('room bathroom')
VacuumCleanerAgentFF.beliefs.declare('room pantry')

VacuumCleanerAgentGF.beliefs.declare('room wine_cellar')
VacuumCleanerAgentGF.beliefs.declare('room laundry')
VacuumCleanerAgentGF.beliefs.declare('room utility_room')
VacuumCleanerAgentGF.beliefs.declare('room basement_room')
VacuumCleanerAgentGF.beliefs.declare('room hallway')
VacuumCleanerAgentGF.beliefs.declare('room garage')

VacuumCleanerAgentFF.beliefs.declare('not_clean bedroom_1')
VacuumCleanerAgentFF.beliefs.declare('not_clean bedroom_2')
VacuumCleanerAgentFF.beliefs.declare('not_clean living_room')
VacuumCleanerAgentFF.beliefs.declare('not_clean kitchen')
VacuumCleanerAgentFF.beliefs.declare('not_clean walk_in_closet')
VacuumCleanerAgentFF.beliefs.declare('not_clean bathroom')
VacuumCleanerAgentFF.beliefs.declare('not_clean pantry')

VacuumCleanerAgentGF.beliefs.declare('not_clean wine_cellar')
VacuumCleanerAgentGF.beliefs.declare('not_clean laundry')
VacuumCleanerAgentGF.beliefs.declare('not_clean utility_room')
VacuumCleanerAgentGF.beliefs.declare('not_clean basement_room')
VacuumCleanerAgentGF.beliefs.declare('not_clean hallway')
VacuumCleanerAgentGF.beliefs.declare('not_clean garage')

VacuumCleanerAgentFF.beliefs.declare('not_suck bedroom_1')
VacuumCleanerAgentFF.beliefs.declare('not_suck bedroom_2')
VacuumCleanerAgentFF.beliefs.declare('not_suck living_room')
VacuumCleanerAgentFF.beliefs.declare('not_suck kitchen')
VacuumCleanerAgentFF.beliefs.declare('not_suck walk_in_closet')
VacuumCleanerAgentFF.beliefs.declare('not_suck bathroom')
VacuumCleanerAgentFF.beliefs.declare('not_suck pantry')

VacuumCleanerAgentGF.beliefs.declare('not_suck wine_cellar')
VacuumCleanerAgentGF.beliefs.declare('not_suck laundry')
VacuumCleanerAgentGF.beliefs.declare('not_suck utility_room')
VacuumCleanerAgentGF.beliefs.declare('not_suck basement_room')
VacuumCleanerAgentGF.beliefs.declare('not_suck hallway')
VacuumCleanerAgentGF.beliefs.declare('not_suck garage')
   

VacuumCleanerAgentFF.beliefs.declare('adj bedroom_1 walk_in_closet')
VacuumCleanerAgentFF.beliefs.declare('adj walk_in_closet bedroom_1')

VacuumCleanerAgentFF.beliefs.declare('adj bedroom_1 kitchen')
VacuumCleanerAgentFF.beliefs.declare('adj kitchen bedroom_1')

VacuumCleanerAgentFF.beliefs.declare('adj living_room kitchen')
VacuumCleanerAgentFF.beliefs.declare('adj kitchen living_room')

VacuumCleanerAgentFF.beliefs.declare('adj bedroom_2 kitchen')
VacuumCleanerAgentFF.beliefs.declare('adj kitchen bedroom_2')

VacuumCleanerAgentFF.beliefs.declare('adj pantry kitchen')
VacuumCleanerAgentFF.beliefs.declare('adj kitchen pantry')

VacuumCleanerAgentFF.beliefs.declare('adj bathroom living_room')
VacuumCleanerAgentFF.beliefs.declare('adj living_room bathroom')


VacuumCleanerAgentFF.beliefs.declare('in_room vacuum_cleaner_first_floor bathroom')


VacuumCleanerAgentGF.beliefs.declare('adj wine_cellar hallway')
VacuumCleanerAgentGF.beliefs.declare('adj hallway wine_cellar')

VacuumCleanerAgentGF.beliefs.declare('adj laundry hallway')
VacuumCleanerAgentGF.beliefs.declare('adj hallway laundry')

VacuumCleanerAgentGF.beliefs.declare('adj utility_room hallway')
VacuumCleanerAgentGF.beliefs.declare('adj hallway utility_room')

VacuumCleanerAgentGF.beliefs.declare('adj garage hallway')
VacuumCleanerAgentGF.beliefs.declare('adj hallway garage')

VacuumCleanerAgentGF.beliefs.declare('adj basement_room hallway')
VacuumCleanerAgentGF.beliefs.declare('adj hallway basement_room')

VacuumCleanerAgentGF.beliefs.declare('in_room vacuum_cleaner_ground_floor wine_cellar')

VacuumCleanerAgentFF.beliefs.declare('not_people_in_room bedroom_1')
VacuumCleanerAgentFF.beliefs.declare('not_people_in_room bedroom_2')
VacuumCleanerAgentFF.beliefs.declare('not_people_in_room living_room')
VacuumCleanerAgentFF.beliefs.declare('not_people_in_room kitchen')
VacuumCleanerAgentFF.beliefs.declare('not_people_in_room walk_in_closet')
VacuumCleanerAgentFF.beliefs.declare('not_people_in_room bathroom')
VacuumCleanerAgentFF.beliefs.declare('not_people_in_room pantry')

VacuumCleanerAgentGF.beliefs.declare('not_people_in_room wine_cellar')
VacuumCleanerAgentGF.beliefs.declare('not_people_in_room laundry')
VacuumCleanerAgentGF.beliefs.declare('not_people_in_room utility_room')
VacuumCleanerAgentGF.beliefs.declare('not_people_in_room basement_room')
VacuumCleanerAgentGF.beliefs.declare('not_people_in_room hallway')
VacuumCleanerAgentGF.beliefs.declare('not_people_in_room garage')

var goalFF = new Array();
var goalGF = new Array();

// Simulated Daily/Weekly schedule
Clock.global.observe('mm', (mm) => {
    var time = Clock.global
    if(time.hh==7 && time.mm==0){
        console.log('\n' + Clock.format() + '\t');

        for (let i in myHouse.rooms_FF) {
            if (myHouse.rooms_FF[i].in_room == false){
                goalFF.push('clean' + ' ' + myHouse.rooms_FF[i].name)
            }
        }
        for (let i in myHouse.rooms_GF) {
            if (myHouse.rooms_GF[i].in_room == false){
                goalGF.push('clean' + ' ' + myHouse.rooms_GF[i].name)
            }
        }
        VacuumCleanerAgentFF.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: goalFF } ) } ) )
        VacuumCleanerAgentGF.postSubGoal( new RetryGoal( { goal: new PlanningGoal( { goal: goalGF } ) } ) )
        
        myHouse.devices.laundry_dryer.switchOffDryer()   
    }
    if(time.hh==8 && time.mm==00){
        console.log('\n' + Clock.format() + '\t');

        myHouse.devices.laundry_washing_machine.switchOnWashingMachine()
    }
    if(time.hh==11 && time.mm==00){
        console.log('\n' + Clock.format() + '\t');

        DryerAgent.postSubGoal( new Postman())
        myHouse.devices.laundry_washing_machine.switchOffWashingMachine()  
    }

    if(time.hh==22 && time.mm==00){
        console.log('\n' + Clock.format() + '\t');
        myHouse.devices.laundry_dryer.switchOffDryer()

    }

    if(time.hh==23 && time.mm==45){

        console.log('\n' + Clock.format() + '\t')
        console.log('End of the scenario 2')
    }
    if(time.dd == 1 && time.hh==0 && time.mm==0)
        Clock.stopTimer()
})

// Start clock
Clock.startTimer()