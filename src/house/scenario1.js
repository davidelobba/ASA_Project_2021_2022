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

const { AlarmGoal, AlarmIntention} = require('./Alarm')
const { SenseLightsGoal, SenseLightsIntention} = require('./LightSensor')
const { SenseSmall_LightsGoal, SenseSmall_LightsIntention} = require('./LightsmallSensor')
const { SenseCurtainGoal,  SenseCurtainIntention } = require('./CurtainSensor')
const { SenseSolarpanelGoal,  SenseSolarpanelIntention } = require('./SolarPanelSensor')
const { SenseCameraGoal,  SenseCameraIntention } = require('./CameraSensor')
const { SenseDoorGoal,  SenseDoorIntention } = require('./DoorSensor')
const { SenseDryerGoal,  SenseDryerIntention } = require('./DryerSensor')
const { SenseWashingmachineGoal, SenseWashingmachineIntention } = require('./WashingmachineSensor')
const { SenseThermostatGoal, SenseThermostatIntention } = require('./ThermostatSensor')
const { SensePeopleRoomGoal, SensePeopleRoomIntention } = require('./PeopleRoomSensor');
const { SenseVacuumCleanerGoal, SenseVacuumCleanerIntention } = require('./VacuumSensor');



class House {
    constructor () {
        this.people = { Jack: new Person(this, 'Jack', 'undefined' ,'bedroom_1') ,
                        John: new Person(this, 'John', 'undefined', 'bedroom_1') ,
                        Mary: new Person(this, 'Mary', 'undefined', 'bedroom_1') }
        this.rooms = {
            kitchen: { name: 'kitchen', doors_to: ['living_room', 'bedroom_1', 'bedroom_2', 'pantry'], temp: 20, door_status : 'unlocked' },
            living_room: { name: 'living_room', doors_to: ['kitchen', 'bathroom', 'hallway'], temp: 20, door_status : 'unlocked' },
            bathroom: { name: 'bathroom', doors_to: ['living_room'], temp: 20, door_status : 'unlocked' },
            bedroom_1: { name: 'bedroom_1', doors_to: ['walk_in_closet', 'kitchen'], temp: 20, door_status : 'unlocked' },
            walk_in_closet: { name: 'walk-in-closet', doors_to: ['bedroom_1'], door_status : 'unlocked' },
            bedroom_2: { name: 'bedroom_2', doors_to: ['kitchen'] , temp: 20, door_status : 'unlocked'},
            pantry: { name: 'pantry', doors_to: ['kitchen'], temp: 18, door_status : 'unlocked' },
            wine_cellar: { name: 'wine_cellar', doors_to: ['hallway'], door_status : 'unlocked' },
            laundry: { name: 'laundry', doors_to: ['hallway'], door_status : 'unlocked' },
            utility_room: { name: 'utility_room', doors_to: ['hallway'], door_status : 'unlocked' },
            garage: { name: 'garage', doors_to: ['hallway'], door_status : 'unlocked' },
            basement_room: { name: 'basement_room', doors_to: ['hallway'], temp: 18, door_status : 'unlocked' },
            hallway: { name: 'hallway', doors_to: ['wine_cellar', 'laundry', 'utility_room', 'garage', 'basement_room', 'living_room'] }
                    }
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
            basement_room_door: new Door(this, 'basement_room_door', 'basement_room'),
            basement_room_thermostat: new Thermostat(this, 'basement_room_thermostat', 'basement_room'),

            laundry_light: new Light(this, 'laundry_light'),
            laundry_door: new Door(this, 'laundry_door', 'laundry'),
            laundry_washing_machine: new WashingMachine(this, 'laundry_washing_machine'),
            laundry_dryer: new Dryer(this, 'laundry_dryer'),

            utility_room_small_light: new Small_Light(this, 'utility_room_small_light'),
            utility_room_door: new Door(this, 'utility_room_door', 'utility_room'),

            garage_light: new Light(this, 'garage_light'),
            garage_door: new Door(this, 'garage_door', 'garage'),

            wine_cellar_light: new Light(this, 'wine_cellar_light'),
            wine_cellar_door: new Door(this, 'wine_cellar_door', 'wine_cellar'),

            hallway_light: new Light(this, 'hallway_light'),

            living_room_light: new Light(this, 'living_room_light'),
            living_room_curtains: new Curtain(this, 'living_room_curtains'),
            living_room_door: new Door(this, 'living_room_door', 'living_room'),
            living_room_thermostat: new Thermostat(this, 'living_room_thermostat', 'living_room'),

            bathroom_light: new Light(this, 'bathroom_light'),
            bathroom_door: new Door(this, 'bathroom_door', 'bathroom'),
            bathroom_thermostat: new Thermostat(this, 'bathroom_thermostat', 'bathroom'),
            bathroom_curtains: new Curtain(this, 'bathroom_curtains'),

            bedroom_1_light: new Light(this, 'bedroom_1_light'),
            bedroom_1_curtains: new Curtain(this, 'bedroom_1_curtains'),
            bedroom_1_door: new Door(this, 'bedroom_1_door', 'bedroom_1'),
            bedroom_1_thermostat: new Thermostat(this, 'bedroom_1_thermostat', 'bedroom_1'),

            bedroom_2_light: new Light(this, 'bedroom_2_light'),
            bedroom_2_curtains: new Curtain(this, 'bedroom_2_curtains'),
            bedroom_2_door: new Door(this, 'bedroom_2_door', 'bedroom_2'),
            bedroom_2_thermostat: new Thermostat(this, 'bedroom_2_thermostat', 'bedroom_2'),

            kitchen_light: new Light(this, 'kitchen_light'),
            kitchen_curtains_1: new Curtain(this, 'kitchen_curtains_1'),
            kitchen_curtains_2: new Curtain(this, 'kitchen_curtains_2'),
            kitchen_curtains_3: new Curtain(this, 'kitchen_curtains_3'),
            kitchen_door: new Door(this, 'kitchen_door', 'kitchen'),
            kitchen_thermostat: new Thermostat(this, 'kitchen_thermostat', 'kitchen'),

            walk_in_closet_light: new Light(this, 'walk_in_closet_light'),
            walk_in_closet_door: new Door(this, 'walk_in_closet_door', 'walk_in_closet'),

            pantry_small_light: new Small_Light(this, 'pantry_small_light'),
            pantry_door: new Door(this, 'pantry_door', 'pantry'),
            pantry_thermostat: new Thermostat(this, 'pantry_thermostat', 'pantry'),

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
var myAgent = new Agent('HouseAgent')
myAgent.intentions.push(AlarmIntention)
myAgent.postSubGoal( new AlarmGoal({hh:7, mm:0}) )

var WashingMachineAgent = new Agent('WashingMachineAgent')
WashingMachineAgent.intentions.push(SenseWashingmachineIntention)
WashingMachineAgent.postSubGoal(new SenseWashingmachineGoal([myHouse.devices.laundry_washing_machine]))

var DryerAgent = new Agent('DryerAgent')
DryerAgent.intentions.push(SenseDryerIntention)
DryerAgent.postSubGoal(new SenseDryerGoal([myHouse.devices.laundry_dryer]))

myAgent.intentions.push(SenseLightsIntention, SenseSmall_LightsIntention, SenseCurtainIntention, SenseSolarpanelIntention, SenseCameraIntention, SenseDoorIntention, SenseThermostatIntention, SensePeopleRoomIntention)

myAgent.postSubGoal( new SensePeopleRoomGoal( [myHouse.people.John, myHouse.people.Mary, myHouse.people.Jack], myHouse ) )
myAgent.postSubGoal( new SenseLightsGoal( [myHouse.devices.kitchen_light, myHouse.devices.bedroom_1_light, myHouse.devices.bedroom_2_light, myHouse.devices.living_room_light, myHouse.devices.basement_room_light, myHouse.devices.laundry_light, myHouse.devices.garage_light, myHouse.devices.wine_cellar_light, myHouse.devices.hallway_light, myHouse.devices.bathroom_light, myHouse.devices.walk_in_closet_light] ) )
myAgent.postSubGoal( new SenseSmall_LightsGoal([myHouse.devices.utility_room_small_light, myHouse.devices.pantry_small_light]) )
myAgent.postSubGoal( new SenseCurtainGoal( [myHouse.devices.bedroom_1_curtains, myHouse.devices.bedroom_2_curtains, myHouse.devices.basement_room_curtains_1, myHouse.devices.basement_room_curtains_2, myHouse.devices.living_room_curtains, myHouse.devices.bathroom_curtains, myHouse.devices.kitchen_curtains_1, myHouse.devices.kitchen_curtains_2, myHouse.devices.kitchen_curtains_3] ) )
myAgent.postSubGoal( new SenseSolarpanelGoal( [myHouse.devices.SolarPanel_1, myHouse.devices.SolarPanel_2] ) )
myAgent.postSubGoal( new SenseCameraGoal( [myHouse.devices.Camera_nord, myHouse.devices.Camera_est, myHouse.devices.Camera_ovest, myHouse.devices.Camera_sud] ) )
myAgent.postSubGoal( new SenseDoorGoal( [myHouse.devices.bedroom_1_door, myHouse.devices.bedroom_2_door, myHouse.devices.bathroom_door, myHouse.devices.garage_door, myHouse.devices.basement_room_door, myHouse.devices.laundry_door, myHouse.devices.pantry_door, myHouse.devices.utility_room_door, myHouse.devices.wine_cellar_door, myHouse.devices.kitchen_door, myHouse.devices.walk_in_closet_door, myHouse.devices.living_room_door] ) )

myAgent.postSubGoal( new SenseThermostatGoal( [myHouse.devices.bedroom_1_thermostat, myHouse.devices.bedroom_2_thermostat, myHouse.devices.bathroom_thermostat, myHouse.devices.kitchen_thermostat, myHouse.devices.living_room_thermostat, myHouse.devices.basement_room_thermostat, myHouse.devices.pantry_thermostat] ) )

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


// Simulated two days schedule
Clock.global.observe('mm', (mm) => {
    var time = Clock.global
    if(time.hh==0 && time.mm==15){
        console.log('\n' + Clock.format() + '\t');
        myHouse.devices.bedroom_1_light.switchOffLight()
        myHouse.devices.bedroom_2_light.switchOffLight()

        myHouse.devices.bedroom_1_door.closeDoor()
        myHouse.devices.bedroom_2_door.closeDoor()
        myHouse.devices.bathroom_door.closeDoor()
        myHouse.devices.kitchen_door.closeDoor()
        myHouse.devices.walk_in_closet_door.closeDoor()
        myHouse.devices.laundry_door.closeDoor()
        myHouse.devices.garage_door.closeDoor()
        myHouse.devices.utility_room_door.closeDoor()
        myHouse.devices.basement_room_door.closeDoor()
        myHouse.devices.wine_cellar_door.closeDoor()
        myHouse.devices.pantry_door.closeDoor()
        myHouse.devices.living_room_door.closeDoor()


        myHouse.devices.Camera_nord.switchOnCamera()
        myHouse.devices.Camera_sud.switchOnCamera()
        myHouse.devices.Camera_est.switchOnCamera()
        myHouse.devices.Camera_ovest.switchOnCamera()

        myHouse.devices.Camera_nord.recordVideo()
        myHouse.devices.Camera_sud.recordVideo()
        myHouse.devices.Camera_est.recordVideo()
        myHouse.devices.Camera_ovest.recordVideo()

        myHouse.devices.kitchen_thermostat.switchOffThermostat()
        myHouse.devices.bedroom_1_thermostat.switchOffThermostat()
        myHouse.devices.bedroom_2_thermostat.switchOffThermostat()
        myHouse.devices.bathroom_thermostat.switchOffThermostat()
        myHouse.devices.basement_room_thermostat.switchOffThermostat()

        myHouse.devices.bedroom_1_curtains.closeCurtain()
        myHouse.devices.bedroom_2_curtains.closeCurtain()
        myHouse.devices.bathroom_curtains.closeCurtain()
        myHouse.devices.kitchen_curtains_1.closeCurtain()
        myHouse.devices.kitchen_curtains_2.closeCurtain()
        myHouse.devices.kitchen_curtains_3.closeCurtain()
        myHouse.devices.living_room_curtains.closeCurtain()
        myHouse.devices.basement_room_curtains_1.closeCurtain()
        myHouse.devices.basement_room_curtains_2.closeCurtain()


    }
    if(time.hh==6 && time.mm==30){

        console.log('\n' + Clock.format() + '\t');

        myHouse.devices.kitchen_thermostat.switchOnThermostat()
        myHouse.devices.bedroom_1_thermostat.switchOnThermostat()
        myHouse.devices.bedroom_2_thermostat.switchOnThermostat()
        myHouse.devices.bathroom_thermostat.switchOnThermostat()

        myHouse.devices.kitchen_thermostat.setTemperature('21')
    }
    if(time.hh==7 && time.mm==0){
        
        console.log('\n' + Clock.format() + '\t');

        myHouse.devices.bedroom_1_light.switchOnLight()
        myHouse.devices.bedroom_2_light.switchOnLight()

        myHouse.devices.bedroom_1_curtains.openCurtain()
        myHouse.devices.bedroom_2_curtains.openCurtain()
        myHouse.devices.bathroom_curtains.openCurtain()
        myHouse.devices.kitchen_curtains_1.openCurtain()
        myHouse.devices.kitchen_curtains_2.openCurtain()
        myHouse.devices.kitchen_curtains_3.openCurtain()
        myHouse.devices.living_room_curtains.openCurtain()
        myHouse.devices.basement_room_curtains_1.openCurtain()
        myHouse.devices.basement_room_curtains_2.openCurtain()

        myHouse.devices.SolarPanel_1.switchOnSolarPanel()
        myHouse.devices.SolarPanel_2.switchOnSolarPanel()

        myHouse.devices.bedroom_1_door.openDoor()
        myHouse.devices.bedroom_2_door.openDoor()
        myHouse.devices.bathroom_door.openDoor()
        myHouse.devices.kitchen_door.openDoor()
        myHouse.devices.basement_room_door.openDoor()
        myHouse.devices.garage_door.openDoor()
        myHouse.devices.laundry_door.openDoor()
        myHouse.devices.pantry_door.openDoor()
        myHouse.devices.walk_in_closet_door.openDoor()
        myHouse.devices.utility_room_door.openDoor()
        myHouse.devices.wine_cellar_door.openDoor()
        myHouse.devices.living_room_door.openDoor()

        myHouse.devices.Camera_nord.not_recordVideo()
        myHouse.devices.Camera_sud.not_recordVideo()
        myHouse.devices.Camera_est.not_recordVideo()
        myHouse.devices.Camera_ovest.not_recordVideo()

        myHouse.devices.Camera_nord.switchOffCamera()
        myHouse.devices.Camera_sud.switchOffCamera()
        myHouse.devices.Camera_est.switchOffCamera()
        myHouse.devices.Camera_ovest.switchOffCamera()

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
        
    }
    if(time.hh==7 && time.mm==15){
        
        console.log('\n' + Clock.format() + '\t');
        
        myHouse.devices.kitchen_light.switchOnLight()

        myHouse.devices.SolarPanel_2.storeEnergy()
        myHouse.devices.SolarPanel_1.sellEnergy()

        myHouse.devices.bedroom_1_light.switchOffLight()
        myHouse.devices.bedroom_2_light.switchOffLight()

        myHouse.devices.kitchen_thermostat.setTemperature('22')
        
        myHouse.people.Jack.moveTo('kitchen')   
        myHouse.people.John.moveTo('kitchen')
        myHouse.people.Mary.moveTo('kitchen')
        myHouse.people.Mary.moveTo('living_room')
        myHouse.people.Mary.moveTo('bathroom')
    }
    if(time.hh==7 && time.mm==30){

        console.log('\n' + Clock.format() + '\t');
        
        myHouse.people.Jack.moveTo('living_room')
        myHouse.people.Jack.moveTo('hallway')
        myHouse.people.Jack.moveTo('laundry')
        myHouse.people.John.moveTo('living_room')

        myHouse.devices.kitchen_light.switchOffLight()

        myHouse.devices.laundry_washing_machine.switchOnWashingMachine()
        
    }
    if(time.hh==7 && time.mm==45){
        
        console.log('\n' + Clock.format() + '\t');
        
        myHouse.people.Jack.moveTo('hallway')
        myHouse.people.Jack.moveTo('garage')
        
    }
    if(time.hh==8 && time.mm==15){
        
        console.log('\n' + Clock.format() + '\t');
        
        myHouse.people.Mary.moveTo('living_room')
        myHouse.people.Mary.moveTo('hallway')
        myHouse.people.Mary.moveTo('laundry')

        myHouse.devices.laundry_washing_machine.switchOffWashingMachine()
        myHouse.devices.laundry_dryer.switchOnDryer()

    }
    if(time.hh==9 && time.mm==00){

        console.log('\n' + Clock.format() + '\t');
        
        myHouse.people.John.moveTo('hallway')
        myHouse.people.John.moveTo('garage')
        myHouse.people.Mary.moveTo('hallway')
        myHouse.people.Mary.moveTo('garage')
    }

    if(time.hh==10 && time.mm==0){

        console.log('\n' + Clock.format() + '\t');
        
        myHouse.devices.laundry_dryer.switchOffDryer()
  
    }
    if(time.hh==12 && time.mm==0){

        console.log('\n' + Clock.format() + '\t');
        
        myHouse.devices.SolarPanel_1.storeEnergy()
        myHouse.devices.SolarPanel_2.sellEnergy()

    }
    if(time.hh==14 && time.mm==15){

        console.log('\n' + Clock.format() + '\t');
        
        myHouse.devices.basement_room_thermostat.switchOnThermostat()
        myHouse.devices.basement_room_thermostat.setTemperature('22')
        
    }
    if(time.hh==16 && time.mm==00){

        console.log('\n' + Clock.format() + '\t');
        
        myHouse.people.Mary.moveTo('hallway')
        myHouse.people.Mary.moveTo('basement_room')
        myHouse.people.John.moveTo('hallway')
        myHouse.people.John.moveTo('basement_room')

        myHouse.devices.basement_room_light.switchOnLight()

    }
    if(time.hh==17 && time.mm==0){
        
        console.log('\n' + Clock.format() + '\t');
        
        myHouse.people.John.moveTo('hallway')
        myHouse.people.John.moveTo('living_room')
        myHouse.people.John.moveTo('kitchen')

        myHouse.devices.kitchen_light.switchOnLight()
        
    }
    if(time.hh==18 && time.mm==0){
        
        console.log('\n' + Clock.format() + '\t');
        
        myHouse.people.Mary.moveTo('hallway')
        myHouse.people.Mary.moveTo('living_room')
        myHouse.people.Jack.moveTo('hallway')
        myHouse.people.Jack.moveTo('living_room')
        myHouse.people.John.moveTo('living_room')

        myHouse.devices.basement_room_light.switchOffLight()
        myHouse.devices.kitchen_light.switchOffLight()
        myHouse.devices.living_room_light.switchOnLight()

    }
    if(time.hh==20 && time.mm==0){

        console.log('\n' + Clock.format() + '\t');
        
        myHouse.people.Jack.moveTo('kitchen')
        myHouse.people.Mary.moveTo('kitchen')
        myHouse.people.John.moveTo('kitchen')

        myHouse.devices.kitchen_light.switchOnLight()

        myHouse.devices.SolarPanel_1.switchOffSolarPanel()
        myHouse.devices.SolarPanel_2.switchOffSolarPanel()
    }
    if(time.hh==21 && time.mm==0){

        console.log('\n' + Clock.format() + '\t');
        
        myHouse.people.Jack.moveTo('bedroom_1')
        myHouse.people.Mary.moveTo('bedroom_1')
        myHouse.people.John.moveTo('bedroom_2')


        myHouse.devices.bedroom_1_light.switchOnLight()
        myHouse.devices.bedroom_2_light.switchOnLight()
        myHouse.devices.kitchen_light.switchOffLight()

    }
    if(time.hh==23 && time.mm==45){
        console.log('Electricity consumed by devices of the house: ', myHouse.utilities.electricity.consumption, 'W') 
    }
    if(time.dd == 1 && time.hh==0 && time.mm==0)
        Clock.stopTimer()
})

// Start clock
Clock.startTimer()