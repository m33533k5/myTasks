package de.fortisit.opus.api.taskList

import de.fortisit.opus.model.list.TaskList
import de.fortisit.opus.model.list.TaskListService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.util.UriComponentsBuilder
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.*

@RestController
@RequestMapping("/lists")
class TaskListController(
    private val taskListService: TaskListService,
) {

    @GetMapping
    fun findAll(): Flux<TaskList> = taskListService.findAll()

    @GetMapping("/{id}")
    fun findById(@PathVariable id: UUID): Mono<ResponseEntity<TaskList>> =
        taskListService.findById(id)
            .map { ResponseEntity.ok(it) }
            .defaultIfEmpty(ResponseEntity.notFound().build())

    @GetMapping("/search/findByName")
    fun findByName(@RequestParam name: String): Mono<TaskList> = taskListService.findByName(name)

    @PostMapping
    fun addTaskList(
        @RequestBody taskList: Mono<TaskList>,
        uriComponentsBuilder: UriComponentsBuilder
    ): Mono<ResponseEntity<TaskList>> =
        taskList
            .flatMap { taskListService.saveTaskList(it) }
            .map {
                val location = uriComponentsBuilder.pathSegment("lists", "{id}").build(it.id)
                ResponseEntity.created(location).body(it)
            }

    @PutMapping("/{id}")
    fun updateTaskList(@PathVariable id: UUID, @RequestBody taskList: Mono<TaskList>): Mono<TaskList> =
        taskList.map { it.copy(id = id) }.flatMap { taskListService.saveTaskList(it) }

    @DeleteMapping("/{id}")
    fun deleteTaskList(@PathVariable id: UUID): Mono<ResponseEntity<Void>> =
        taskListService.deleteTaskList(id).thenReturn(ResponseEntity.noContent().build())
}