package de.fortisit.opus.model.list

import de.fortisit.opus.model.task.TaskRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.*

@Service
class TaskListService(
    private val taskListRepository: TaskListRepository,
    private val taskRepository: TaskRepository
) {
    fun findAll(): Flux<TaskList> = taskListRepository.findAll()
    fun findById(id: UUID): Mono<TaskList> = taskListRepository.findById(id)
    fun saveTaskList(taskList: TaskList): Mono<TaskList> = taskListRepository.save(taskList)

    //fun deleteTaskList(id: UUID): Mono<Void> = taskListRepository.deleteById(id)

    fun deleteTaskList(id: UUID): Mono<Void> = taskRepository.existsByListId(id)
        .flatMap { hasTasks ->
            require(!hasTasks) { "List has Tasks" }
            taskListRepository.deleteById(id)
        }

    fun findByName(name: String): Mono<TaskList> = taskListRepository.findByName(name)
}