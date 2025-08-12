package com.hindalco.cpsms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permit_id")
    private Permit permit;
    
    @Column(nullable = false, length = 50)
    private String type;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null) {
            isRead = false;
        }
    }
    
    // Constructors
    public Notification() {}
    
    public Notification(User user, String type, String title, String message) {
        this.user = user;
        this.type = type;
        this.title = title;
        this.message = message;
        this.isRead = false;
    }
    
    public Notification(User user, Permit permit, String type, String title, String message) {
        this.user = user;
        this.permit = permit;
        this.type = type;
        this.title = title;
        this.message = message;
        this.isRead = false;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Permit getPermit() {
        return permit;
    }
    
    public void setPermit(Permit permit) {
        this.permit = permit;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Helper methods
    public void markAsRead() {
        this.isRead = true;
    }
    
    public void markAsUnread() {
        this.isRead = false;
    }
    
    public boolean isUnread() {
        return !isRead;
    }
    
    // Notification type constants
    public static class NotificationType {
        public static final String PERMIT_CREATED = "PERMIT_CREATED";
        public static final String PERMIT_APPROVED = "PERMIT_APPROVED";
        public static final String PERMIT_REJECTED = "PERMIT_REJECTED";
        public static final String PERMIT_EXPIRING = "PERMIT_EXPIRING";
        public static final String PERMIT_EXPIRED = "PERMIT_EXPIRED";
        public static final String VISITOR_REQUEST_CREATED = "VISITOR_REQUEST_CREATED";
        public static final String VISITOR_REQUEST_APPROVED = "VISITOR_REQUEST_APPROVED";
        public static final String VISITOR_REQUEST_REJECTED = "VISITOR_REQUEST_REJECTED";
    }
}