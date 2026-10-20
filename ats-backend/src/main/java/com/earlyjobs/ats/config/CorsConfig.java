
package com.earlyjobs.ats.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173",
                                "https://ats-frontend.ostead.tech",
                                "https://ats-frontend.ostead.tech/dashboard")
                        .allowedMethods(
                                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
                        )
                        .allowedHeaders("*");
            }
        };
    }
}
