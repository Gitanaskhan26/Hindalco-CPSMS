package com.hindalco.cpsms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class CpsmsApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CpsmsApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        System.out.println("=".repeat(60));
        System.out.println("✅ CPSMS Application started successfully!");
        System.out.println("✅ PostgreSQL database connection should be established!");
        System.out.println("🌐 Backend API available at: http://localhost:8080/api");
        System.out.println("🔗 Frontend URL: https://hindalco-cpsms.vercel.app");
        System.out.println("🧪 Test endpoints:");
        System.out.println("   - GET  /api/test/hello");
        System.out.println("   - GET  /api/test/health");
        System.out.println("   - GET  /api/test/connection");
        System.out.println("   - POST /api/test/echo");
        System.out.println("🔒 CORS enabled for Vercel deployment");
        System.out.println("=".repeat(60));
    }
}