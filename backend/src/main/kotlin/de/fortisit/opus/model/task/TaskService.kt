package de.fortisit.opus.model.task

import de.fortisit.opus.model.list.TaskListService
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import reactor.kotlin.core.publisher.toMono
import java.util.*
import kotlin.NoSuchElementException

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val taskListService: TaskListService,
) {

    fun findAll(): Flux<Task> = taskRepository.findAll()
    fun findById(id: UUID): Mono<Task> = taskRepository.findById(id)

    fun saveTask(task: Task): Mono<Task> = taskListService.findById(task.listId)
        .switchIfEmpty { NoSuchElementException("List ID does not exists").toMono() }
        .then(taskRepository.save(task))

    fun deleteTask(id: UUID): Mono<Void> = taskRepository.deleteById(id)
    fun findByTitle(title: String): Flux<Task> = taskRepository.findByTitleContaining(title)
}
