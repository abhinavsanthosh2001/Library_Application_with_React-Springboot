package com.project.springbootlobrary.config;

import com.project.springbootlobrary.entities.Book;
import com.project.springbootlobrary.entities.Message;
import com.project.springbootlobrary.entities.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class RestConfig implements RepositoryRestConfigurer {
    private String allowedOrigins = "http://localhost:3000";
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration configuration, CorsRegistry corsRegistry){
        HttpMethod[] unsupportedActions = {HttpMethod.POST, HttpMethod.DELETE,HttpMethod.PATCH,HttpMethod.PUT};
        configuration.exposeIdsFor(Book.class);
        configuration.exposeIdsFor(Review.class);
        configuration.exposeIdsFor(Message.class);
        disableHttpMethods(Book.class, configuration, unsupportedActions);
        disableHttpMethods(Review.class, configuration, unsupportedActions);
        disableHttpMethods(Message.class,configuration,unsupportedActions);
        corsRegistry.addMapping(configuration.getBasePath()+"/**")
                .allowedOrigins(allowedOrigins);
    }
    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration configuration, HttpMethod[] unsupportedActions) {
        configuration.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }
}
