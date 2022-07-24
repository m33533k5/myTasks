package de.fortisit.opus

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class OpusApplication

fun main(args: Array<String>) {
    runApplication<OpusApplication>(args = args)
}
