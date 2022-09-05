;; domain file: domain-VacuumCleanerAgentFF.pddl
(define (domain VacuumCleanerAgentFF)
    (:requirements :strips)
    (:predicates
        (vacuum ?obj)
        (room ?before)
        (adj ?before ?after)
        (in_room ?obj ?before)
        (set_status ?obj ?status)
        (move ?obj ?after)
        (state ?status)
        (not_clean ?r)
        (not_people_in_room ?r)
        (suck ?r)
        (clean ?r)
        (not_suck ?r)              
    )
    
        (:action Move
            :parameters (?obj ?before ?after ?status)
            :precondition (and
                (vacuum ?obj)
                (room ?before)
                (room ?after)
                (adj ?before ?after)
                (in_room ?obj ?before)
                (adj ?after ?before)
                (set_status ?obj ?status)
            )
            :effect (and
                (move ?obj ?after)
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
            :parameters (?obj ?status)
            :precondition (and
                (vacuum ?obj)
                (state ?status)
            )
            :effect (and
                (set_status ?obj ?status)
            )
        )
        
        (:action Clean
            :parameters (?r ?obj)
            :precondition (and
                (room ?r)
                (not_clean ?r)
                (vacuum ?obj)
                (not_people_in_room ?r)
                (move ?obj ?r)
                (suck ?r)
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