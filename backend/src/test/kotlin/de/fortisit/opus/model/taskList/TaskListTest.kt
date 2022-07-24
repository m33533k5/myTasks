package de.fortisit.opus.model.taskList

import de.fortisit.opus.model.list.TaskList
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import java.util.*

class TaskListTest {

    @Test
    fun `should not allow empty name`() {
        // Given
        val name = ""

        // Then
        Assertions.assertThatIllegalArgumentException().isThrownBy {
            TaskList(
                name = name,
                id = UUID.randomUUID()
            )
        }
    }
}