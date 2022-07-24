package de.fortisit.opus.model.task

import de.fortisit.opus.IntegrationTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import reactor.kotlin.test.test
import java.util.*
import kotlin.NoSuchElementException

internal class TaskServiceTest(
    @Autowired private val taskService: TaskService,
) : IntegrationTest() {

    @Test
    fun `should require valid list ID`() {
        // Given
        val task = Task(
            title = "foo",
            listId = UUID.randomUUID(),
        )

        // When
        val result = taskService.saveTask(task)

        // Then
        result.test()
            .verifyErrorSatisfies {
                assertThat(it)
                    .isInstanceOf(NoSuchElementException::class.java)
                    .hasMessage("List ID does not exists")
            }
    }

}