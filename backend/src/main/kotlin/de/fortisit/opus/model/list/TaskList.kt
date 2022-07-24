package de.fortisit.opus.model.list

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document
data class TaskList (
    @Id val id: UUID = UUID.randomUUID(),
    @Indexed(unique = true) val name: String,
){
    init {
        require(name.isNotBlank())
    }
}