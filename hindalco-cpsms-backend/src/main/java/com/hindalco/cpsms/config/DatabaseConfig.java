package com.hindalco.cpsms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories(basePackages = "com.hindalco.cpsms.repository")
@EnableTransactionManagement
public class DatabaseConfig {
    // JPA repositories will be automatically configured by Spring Boot
    // This class enables JPA repositories and transaction management
}