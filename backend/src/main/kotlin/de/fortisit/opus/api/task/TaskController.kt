package de.fortisit.opus.api.task

import de.fortisit.opus.model.task.Task
import de.fortisit.opus.model.task.TaskService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.util.UriComponentsBuilder
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.*

@RestController
@RequestMapping("/tasks")
class TaskController(
    private val taskService: TaskService,
) {

    @GetMapping
    fun findAll(): Flux<Task> = taskService.findAll()

    @GetMapping("/{id}")
    fun findById(@PathVariable id: UUID): Mono<ResponseEntity<Task>> =
        taskService.findById(id).map { ResponseEntity.ok(it) }.defaultIfEmpty(ResponseEntity.notFound().build())

    @GetMapping("/search/findByTitle")
    fun findByTitle(@RequestParam title: String): Flux<Task> = taskService.findByTitle(title)

    @PostMapping
    fun addTask(@RequestBody task: Mono<Task>, uriComponentsBuilder: UriComponentsBuilder): Mono<ResponseEntity<Task>> =
        task
            .flatMap { taskService.saveTask(it) }
            .map {
                val location = uriComponentsBuilder.pathSegment("tasks", "{id}").build(it.id)
                ResponseEntity.created(location).body(it)
            }

    @PutMapping("/{id}")
    fun updateTask(@PathVariable id: UUID, @RequestBody task: Mono<Task>): Mono<Task> =
        task.map { it.copy(id = id) }.flatMap { taskService.saveTask(it) }

    @DeleteMapping("/{id}")
    fun deleteTask(@PathVariable id: UUID): Mono<ResponseEntity<Void>> =
        taskService.deleteTask(id).thenReturn(ResponseEntity.noContent().build())
}


