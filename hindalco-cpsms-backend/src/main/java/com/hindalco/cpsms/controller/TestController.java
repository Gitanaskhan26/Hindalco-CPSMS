package com.hindalco.cpsms.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = {"http://localhost:3000", "https://hindalco-cpsms.vercel.app", "https://*.vercel.app"})
public class TestController {

    @GetMapping("/hello")
    public ResponseEntity<Map<String, Object>> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello from CPSMS Backend!");
        response.put("timestamp", LocalDateTime.now());
        response.put("status", "success");
        response.put("backend", "Spring Boot");
        response.put("database", "PostgreSQL");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/echo")
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        response.put("received", data);
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Data received successfully from frontend");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/connection")
    public ResponseEntity<Map<String, Object>> testConnection() {
        Map<String, Object> response = new HashMap<>();
        response.put("connected", true);
        response.put("message", "Frontend-Backend connection successful!");
        response.put("timestamp", LocalDateTime.now());
        response.put("frontendUrl", "https://hindalco-cpsms.vercel.app");
        response.put("backendUrl", "http://localhost:8080/api");
        
        return ResponseEntity.ok(response);
    }
}
