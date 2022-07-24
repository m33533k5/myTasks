package de.fortisit.opus.model.taskList

import de.fortisit.opus.IntegrationTest
import de.fortisit.opus.model.list.TaskList
import de.fortisit.opus.model.list.TaskListRepository
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import reactor.kotlin.test.test

class TaskListRepositoryTest(

    @Autowired
    private val taskListRepository: TaskListRepository,
    ) : IntegrationTest() {

        @Test
        fun `name should not duplicate` (){
            // Given
            val existingTasksList = TaskList(
                name = "list1",
            )
            taskListRepository.save(existingTasksList)
                .block()

            val newList = TaskList(
                name = existingTasksList.name,
            )

            // When
            val result = taskListRepository.save(newList)

            // Then
            result.test()
                .verifyError()
        }
}