;; domain file: domain-VacuumCleaner_first_floor.pddl
(define (domain VacuumCleaner_first_floor)
    (:requirements :strips)
    (:predicates
        (vacuum ?obj)
        (room ?before)
        (adj ?before ?after)
        (in_room ?obj ?before)
        (suck ?after)
        (clean ?after)
        (state ?status)
        (set_status ?obj ?status)
        (suck_and_clean ?obj ?after)
        (set_status_ ?obj ?status_)
        (not_clean ?r)
        (not_people_in_room ?r)
        (not_suck ?r)              
    )
    
        (:action SuckAndClean
            :parameters (?obj ?before ?after ?status)
            :precondition (and
                (vacuum ?obj)
                (room ?before)
                (room ?after)
                (adj ?before ?after)
                (in_room ?obj ?before)
                (adj ?after ?before)
                (suck ?after)
                (clean ?after)
                (state ?status)
                (set_status ?obj ?status)
            )
            :effect (and
                (suck_and_clean ?obj ?after)
                (in_room ?obj ?after)
                (not (in_room ?obj ?before))
            )
        )
        
        (:action switchOnVacuumCleaner
            :parameters (?obj ?status)
            :precondition (and
                (vacuum ?obj)
                (state ?status)
            )
            :effect (and
                (set_status ?obj ?status)
            )
        )
        
        (:action switchOffVacuumCleaner
            :parameters (?obj ?status_)
            :precondition (and
                (vacuum ?obj)
                (state ?status_)
            )
            :effect (and
                (set_status_ ?obj ?status_)
            )
        )
        
        (:action Clean
            :parameters (?r ?obj)
            :precondition (and
                (room ?r)
                (not_clean ?r)
                (vacuum ?obj)
                (not_people_in_room ?r)
            )
            :effect (and
                (clean ?r)
            )
        )
        
        (:action Suck
            :parameters (?r ?obj)
            :precondition (and
                (room ?r)
                (not_suck ?r)
                (vacuum ?obj)
                (not_people_in_room ?r)
            )
            :effect (and
                (suck ?r)
            )
        )
)