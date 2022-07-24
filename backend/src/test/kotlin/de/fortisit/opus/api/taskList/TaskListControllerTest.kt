package de.fortisit.opus.api.taskList

import de.fortisit.opus.IntegrationTest
import de.fortisit.opus.model.list.TaskList
import de.fortisit.opus.model.list.TaskListRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.expectBody
import reactor.kotlin.test.test
import java.util.UUID
import java.util.function.Consumer

internal class TaskListControllerTest(
    @Autowired private val taskListRepository: TaskListRepository,
) : IntegrationTest() {

    @Test
    fun `should get all lists`() {
        // Given
        val taskLists = List(3) {
            TaskList(
                id = UUID.randomUUID(),
                name = "sport"
            )
        }

        taskListRepository.saveAll(taskLists)
            .blockLast()

        // When
        val request = webTestClient.get()
            .uri("/lists")

        // Then
        request.exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectBody<List<TaskList>>()
            .consumeWith {
                assertThat(it.responseBody).containsExactlyInAnyOrderElementsOf(taskLists)
            }
    }

    @Test
    fun `should create new list`() {
        // Given
        val newList = TaskList(
            id = UUID.randomUUID(),
            name = "sport"
        )

        // When
        val request = webTestClient.post()
            .uri("/lists")
            .bodyValue(newList)

        // Then
        lateinit var listId: UUID

        request.exchange()
            .expectStatus().isCreated
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectHeader().value(HttpHeaders.LOCATION) {
                assertThat(it)
                    .startsWith("/lists")
                    .satisfies(
                        Consumer { location ->
                            val id = location.substringAfter("/lists/")
                            UUID.fromString(id)
                        }
                    )
            }
            .expectBody<TaskList>()
            .consumeWith {
                val taskList: TaskList? = it.responseBody

                requireNotNull(taskList)

                listId = taskList.id

                assertThat(taskList)
                    .matches { it.name == newList.name }
            }

        taskListRepository.findById(listId)
            .test()
            .expectNext(newList.copy(id = listId))
            .verifyComplete()
    }

    @Test
    fun `should delete list`() {
        // Given
        val taskList = TaskList(
            id = UUID.randomUUID(),
            name = "sport"
        )
        taskListRepository.save(taskList)
            .block()

        // When
        val request = webTestClient.delete()
            .uri("/lists/{id}", taskList.id)

        // Then
        request.exchange()
            .expectStatus().isNoContent

        taskListRepository.findById(taskList.id)
            .test()
            .verifyComplete()
    }

    @Test
    fun `should find list for given id`() {
        // Given
        val taskList = TaskList(
            id = UUID.randomUUID(),
            name = "sport"
        )
        taskListRepository.save(taskList)
            .block()

        // When
        val request = webTestClient.get()
            .uri("/lists/{id}", taskList.id)

        // Then
        request.exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectBody<TaskList>()
            .isEqualTo(taskList)
    }

    @Test
    fun `should send status code 404 if id does not exist`() {
        // Given
        val unknownId: UUID = UUID.randomUUID()

        // When
        val request = webTestClient.get()
            .uri("/lists/{id}", unknownId)

        // Then
        request.exchange()
            .expectStatus().isNotFound
    }

    @Test
    fun `should update list`() {
        // Given
        val taskList = TaskList(
            id = UUID.randomUUID(),
            name = "sport"
        )

        taskListRepository.save(taskList)
            .block()

        val updatedTaskList = taskList.copy(name = "I'm an update!")

        // When
        val request = webTestClient.put()
            .uri("/lists/{id}", taskList.id)
            .bodyValue(updatedTaskList)

        // Then
        request.exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_JSON)
            .expectBody<TaskList>()
            .isEqualTo(updatedTaskList)

        taskListRepository.findById(taskList.id)
            .test()
            .expectNext(updatedTaskList)
            .verifyComplete()
    }
}
