package com.hindalco.cpsms.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends CustomException {
    
    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
    
    public BadRequestException(String message, Throwable cause) {
        super(message, HttpStatus.BAD_REQUEST, cause);
    }
    
    public BadRequestException(String resource, String field, Object value) {
        super(String.format("Bad request for %s with %s: %s", resource, field, value), HttpStatus.BAD_REQUEST);
    }
}
