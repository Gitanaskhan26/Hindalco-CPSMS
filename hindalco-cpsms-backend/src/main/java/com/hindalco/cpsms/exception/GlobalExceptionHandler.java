package com.hindalco.cpsms.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.hindalco.cpsms.dto.ErrorResponseDto;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponseDto> handleCustomException(CustomException ex, WebRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(
            ex.getMessage(),
            ex.getHttpStatus().value(),
            ex.getHttpStatus().getReasonPhrase(),
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, ex.getHttpStatus());
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDto> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(
            "Invalid email or password",
            HttpStatus.UNAUTHORIZED.value(),
            "Unauthorized",
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseDto> handleRuntimeException(RuntimeException ex, WebRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(
            ex.getMessage() != null ? ex.getMessage() : "An error occurred",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGenericException(Exception ex, WebRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(
            "An unexpected error occurred",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            request.getDescription(false).replace("uri=", "")
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}