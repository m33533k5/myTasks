package de.fortisit.opus.model.task

import org.assertj.core.api.Assertions.assertThatIllegalArgumentException
import org.junit.jupiter.api.Test
import java.util.*

internal class TaskTest {

    @Test
    fun `should not allow empty title`() {
        // Given
        val title = ""

        // Then
        assertThatIllegalArgumentException().isThrownBy {
            Task(
                title = title,
                listId = UUID.randomUUID()
            )
        }
    }

}
