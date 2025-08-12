package com.hindalco.cpsms.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://hindalco-cpsms.vercel.app", "https://*.vercel.app"})
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "CPSMS Backend");
        response.put("database", "H2 Connected");
        response.put("environment", "Development");
        response.put("cors", "Enabled for Vercel");
        response.put("timestamp", LocalDateTime.now());
        response.put("port", "8081");
        
        return ResponseEntity.ok(response);
    }
}
