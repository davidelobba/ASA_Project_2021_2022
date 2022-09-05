;; problem file: problem-VacuumCleanerAgentGF.pddl
(define (problem VacuumCleanerAgentGF)
    (:domain VacuumCleanerAgentGF)
    (:objects vacuum_cleaner_ground_floor off on wine_cellar laundry utility_room basement_room hallway garage)
	(:init (vacuum vacuum_cleaner_ground_floor) (state off) (state on) (set_status vacuum_cleaner_ground_floor off) (room wine_cellar) (room laundry) (room utility_room) (room basement_room) (room hallway) (room garage) (not_clean wine_cellar) (not_clean laundry) (not_clean utility_room) (not_clean basement_room) (not_clean hallway) (not_clean garage) (not_suck wine_cellar) (not_suck laundry) (not_suck utility_room) (not_suck basement_room) (not_suck hallway) (not_suck garage) (adj wine_cellar hallway) (adj hallway wine_cellar) (adj laundry hallway) (adj hallway laundry) (adj utility_room hallway) (adj hallway utility_room) (adj garage hallway) (adj hallway garage) (adj basement_room hallway) (adj hallway basement_room) (in_room vacuum_cleaner_ground_floor wine_cellar) (not_people_in_room wine_cellar) (not_people_in_room laundry) (not_people_in_room utility_room) (not_people_in_room basement_room) (not_people_in_room hallway) (not_people_in_room garage))
	(:goal (and (clean wine_cellar) (clean laundry) (clean utility_room) (clean garage) (clean basement_room) (clean hallway)))
)
