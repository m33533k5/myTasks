package de.fortisit.opus

import org.junit.jupiter.api.AfterEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.mongodb.core.ReactiveMongoTemplate
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.MongoMappingContext
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.reactive.server.WebTestClient
import org.testcontainers.containers.MongoDBContainer
import org.testcontainers.images.PullPolicy
import org.testcontainers.utility.DockerImageName
import reactor.kotlin.core.publisher.toFlux

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
open class IntegrationTest {

    @Autowired
    protected lateinit var webTestClient: WebTestClient

    @Autowired
    private lateinit var mongoMappingContext: MongoMappingContext

    @Autowired
    private lateinit var mongoTemplate: ReactiveMongoTemplate

    @AfterEach
    fun cleanupDatabase() {
        val collectionNames = mongoMappingContext.persistentEntities
            .filter { it.isAnnotationPresent(Document::class.java) }
            .map { it.typeInformation.type }
            .map { mongoTemplate.getCollectionName(it) }

        collectionNames.toFlux()
            .flatMap { mongoTemplate.getCollection(it) }
            .flatMap { it.deleteMany(org.bson.Document()) }
            .blockLast()
    }

    companion object {
        private const val MongoDbPort = 27017

        @JvmStatic
        val mongoDbContainer = MongoDBContainer(DockerImageName.parse("mongo")).apply {
            withImagePullPolicy(PullPolicy.alwaysPull())
            withExposedPorts(MongoDbPort)
        }

        init {
            mongoDbContainer.start()
        }

        @JvmStatic
        @DynamicPropertySource
        fun setupProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.data.mongodb.uri") {
                "mongodb://${mongoDbContainer.containerIpAddress}:${mongoDbContainer.getMappedPort(MongoDbPort)}/test"
            }
        }
    }
}
