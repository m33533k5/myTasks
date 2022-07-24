package de.fortisit.opus.api

import org.springframework.hateoas.MediaTypes
import org.springframework.hateoas.mediatype.problem.Problem
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ExceptionHandler {

    @ExceptionHandler(RuntimeException::class)
    fun duplicateKeyException(ex: RuntimeException): ResponseEntity<Problem> = Problem.create()
        .withTitle("Error")
        .withDetail(ex.message)
        .withStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        .let {
            ResponseEntity
                .status(it.status!!)
                .contentType(MediaTypes.HTTP_PROBLEM_DETAILS_JSON)
                .body(it)
        }
}
