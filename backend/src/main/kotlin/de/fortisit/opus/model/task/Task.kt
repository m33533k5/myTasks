package de.fortisit.opus.model.task

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime
import java.util.*

@Document
data class Task(
    val title: String,
    @Id val id: UUID = UUID.randomUUID(),
    val beginDate: LocalDateTime = LocalDateTime.now(),
    val endDate: LocalDateTime = LocalDateTime.now(),
    val allDay: Boolean = false,
    val done: Boolean = false,
    val listId: UUID,
    ) {
    init {
        require(title.isNotBlank())
    }
}
