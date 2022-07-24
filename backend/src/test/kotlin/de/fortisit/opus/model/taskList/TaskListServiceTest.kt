package de.fortisit.opus.model.taskList

import de.fortisit.opus.IntegrationTest
import de.fortisit.opus.model.list.TaskList
import de.fortisit.opus.model.list.TaskListService
import de.fortisit.opus.model.task.Task
import de.fortisit.opus.model.task.TaskRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test

import org.springframework.beans.factory.annotation.Autowired
import reactor.kotlin.test.test
import java.util.*

internal class TaskListServiceTest(
    @Autowired private val taskListService: TaskListService,
    @Autowired private val taskRepository: TaskRepository,
) : IntegrationTest() {

    @Test
    fun `should not delete list if tasks are included`(){
        // Given
        val existingList = TaskList (
            id = UUID.randomUUID(),
            name = "sport"
                )
        val existingTask = Task (
            title = "title",
            listId = existingList.id
                )
        taskListService.saveTaskList(existingList)
            .then(taskRepository.save(existingTask))
            .block()

        // When
        val result = taskListService.deleteTaskList(existingList.id)

        // Then
        result.test()
            .verifyErrorSatisfies {
                Assertions.assertThat(it)
                    .isInstanceOf(IllegalArgumentException::class.java)
                    .hasMessage("List have tasks")
            }
    }
}