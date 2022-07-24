package de.fortisit.opus.model.list

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono
import java.util.*

interface TaskListRepository : ReactiveCrudRepository<TaskList, UUID> {
    fun findByName(name: String): Mono<TaskList>
}