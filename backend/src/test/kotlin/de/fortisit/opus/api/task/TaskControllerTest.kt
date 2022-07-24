package de.fortisit.opus.api.task

import de.fortisit.opus.IntegrationTest
import de.fortisit.opus.model.task.Task
import de.fortisit.opus.model.task.TaskRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.expectBody
import reactor.kotlin.test.test
import java.util.UUID
import java.util.function.Consumer

internal class TaskControllerTest(
    @Autowired private val taskRepository: TaskRepository,
) : IntegrationTest() {

    @Test
    fun `should get all tasks`() {
        // Given
        val tasks = List(3) {
            Task(
                title = it.toString(),
                listId = UUID.randomUUID()
            )
        }

        taskRepository.saveAll(tasks)
            .blockLast()

        // When
        val request = webTestClient.get()
            .uri("/tasks")

        // Then
        request.exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectBody<List<Task>>()
            .consumeWith {
                assertThat(it.responseBody).containsExactlyInAnyOrderElementsOf(tasks)
            }
    }

    @Test
    fun `should create new task`() {
        // Given
        val newTask = Task(
            title = "Test Title",
            listId = UUID.randomUUID()
        )

        // When
        val request = webTestClient.post()
            .uri("/tasks")
            .bodyValue(newTask)

        // Then
        lateinit var taskId: UUID

        request.exchange()
            .expectStatus().isCreated
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectHeader().value(HttpHeaders.LOCATION) {
                assertThat(it)
                    .startsWith("/tasks")
                    .satisfies(
                        Consumer { location ->
                            val id = location.substringAfter("/tasks/")
                            UUID.fromString(id)
                        }
                    )
            }
            .expectBody<Task>()
            .consumeWith {
                val task: Task? = it.responseBody

                requireNotNull(task)

                taskId = task.id

                assertThat(task)
                    .matches { it.title == newTask.title }
            }

        taskRepository.findById(taskId)
            .test()
            .expectNext(newTask.copy(id = taskId))
            .verifyComplete()
    }

    @Test
    fun `should delete task`() {
        // Given
        val task = Task(
            title = "Test Title",
            listId = UUID.randomUUID()
        )
        taskRepository.save(task)
            .block()

        // When
        val request = webTestClient.delete()
            .uri("/tasks/{id}", task.id)

        // Then
        request.exchange()
            .expectStatus().isNoContent

        taskRepository.findById(task.id)
            .test()
            .verifyComplete()
    }

    @Test
    fun `should find task for given id`() {
        // Given
        val task = Task(
            title = "Test Title",
            listId = UUID.randomUUID()
        )
        taskRepository.save(task)
            .block()

        // When
        val request = webTestClient.get()
            .uri("/tasks/{id}", task.id)

        // Then
        request.exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectBody<Task>()
            .isEqualTo(task)
    }

    @Test
    fun `should send status code 404 if id does not exist`() {
        // Given
        val unknownId: UUID = UUID.randomUUID()

        // When
        val request = webTestClient.get()
            .uri("/tasks/{id}", unknownId)

        // Then
        request.exchange()
            .expectStatus().isNotFound
    }

    @Test
    fun `should update task`() {
        // Given
        val task = Task(
            title = "Test Title",
            listId = UUID.randomUUID()
        )

        taskRepository.save(task)
            .block()

        val updatedTask = task.copy(title = "I'm an update!")

        // When
        val request = webTestClient.put()
            .uri("/tasks/{id}", task.id)
            .bodyValue(updatedTask)

        // Then
        request.exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectBody<Task>()
            .isEqualTo(updatedTask)

        taskRepository.findById(task.id)
            .test()
            .expectNext(updatedTask)
            .verifyComplete()
    }
}
