package de.fortisit.opus.model.task

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.UUID

interface TaskRepository : ReactiveCrudRepository<Task, UUID> {
    fun findByTitleContaining(name: String): Flux<Task>
    fun existsByListId(id: UUID): Mono<Boolean>
}
