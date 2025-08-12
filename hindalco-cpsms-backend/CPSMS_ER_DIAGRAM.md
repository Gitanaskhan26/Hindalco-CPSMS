# CPSMS Database ER Diagram

## Entity Relationship Diagram for Hindalco CPSMS

```mermaid
erDiagram
    %% Core Entities
    DEPARTMENTS {
        bigint id PK
        varchar name UK
        text description
        varchar location
        decimal budget
        bigint head_id FK
        timestamp created_at
        timestamp updated_at
    }

    ROLES {
        bigint id PK
        varchar name UK
        text description
        text permissions
        timestamp created_at
        timestamp updated_at
    }

    USERS {
        bigint id PK
        varchar employee_id UK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        bigint department_id FK
        varchar position
        varchar phone
        varchar status
        bigint role_id FK
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
    }

    LOCATIONS {
        bigint id PK
        varchar name UK
        text description
        decimal latitude
        decimal longitude
        varchar risk_level
        bigint safety_officer_id FK
        timestamp created_at
        timestamp updated_at
    }

    PERMIT_TYPES {
        bigint id PK
        varchar name UK
        text description
        text required_ppe
        text risk_assessment
        integer validity_hours
        boolean requires_approval
        timestamp created_at
        timestamp updated_at
    }

    PERMITS {
        bigint id PK
        varchar permit_number UK
        bigint permit_type_id FK
        varchar title
        text description
        bigint location_id FK
        varchar work_location
        timestamp start_date
        timestamp end_date
        varchar risk_level
        text risk_assessment_details
        text safety_measures
        text required_ppe
        varchar status
        bigint applicant_id FK
        bigint approved_by_id FK
        bigint rejected_by_id FK
        text rejection_reason
        timestamp submitted_at
        timestamp approved_at
        timestamp rejected_at
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        bigint permit_id FK
        varchar type
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }

    VISITOR_REQUESTS {
        bigint id PK
        varchar visitor_name
        varchar visitor_email
        varchar visitor_phone
        varchar visitor_company
        text purpose
        date visit_date
        time visit_time
        integer duration_hours
        bigint host_employee_id FK
        varchar status
        bigint approved_by FK
        timestamp approved_at
        timestamp check_in_time
        timestamp check_out_time
        text rejection_reason
        timestamp created_at
        timestamp updated_at
    }

    REFRESH_TOKENS {
        bigint id PK
        varchar token_hash UK
        bigint user_id FK
        timestamp expires_at
        boolean revoked
        timestamp created_at
    }

    PERMIT_STATUS_HISTORY {
        bigint id PK
        bigint permit_id FK
        varchar previous_status
        varchar new_status
        bigint changed_by_id FK
        text change_reason
        timestamp created_at
    }

    PERMIT_EQUIPMENT {
        bigint id PK
        bigint permit_id FK
        varchar equipment_name
        varchar equipment_type
        varchar serial_number
        date last_inspection_date
        timestamp created_at
    }

    PERMIT_WORKERS {
        bigint id PK
        bigint permit_id FK
        varchar worker_name
        varchar worker_id
        varchar competency_level
        varchar role_in_work
        timestamp created_at
    }

    SYSTEM_SETTINGS {
        bigint id PK
        varchar setting_key UK
        text setting_value
        text description
        bigint updated_by_id FK
        timestamp created_at
        timestamp updated_at
    }

    AUDIT_LOGS {
        bigint id PK
        bigint user_id FK
        varchar action
        varchar entity_type
        bigint entity_id
        text old_values
        text new_values
        varchar ip_address
        text user_agent
        timestamp created_at
    }

    %% Primary Relationships
    DEPARTMENTS ||--o{ USERS : "has employees"
    DEPARTMENTS ||--o| USERS : "has head"
    ROLES ||--o{ USERS : "assigned to"
    USERS ||--o{ LOCATIONS : "safety officer for"
    
    USERS ||--o{ PERMITS : "creates as applicant"
    USERS ||--o{ PERMITS : "approves"
    USERS ||--o{ PERMITS : "rejects"
    
    PERMIT_TYPES ||--o{ PERMITS : "categorizes"
    LOCATIONS ||--o{ PERMITS : "assigned to"
    
    PERMITS ||--o{ NOTIFICATIONS : "generates"
    USERS ||--o{ NOTIFICATIONS : "receives"
    
    USERS ||--o{ VISITOR_REQUESTS : "hosts"
    USERS ||--o{ VISITOR_REQUESTS : "approves"
    
    USERS ||--o{ REFRESH_TOKENS : "owns"
    
    PERMITS ||--o{ PERMIT_STATUS_HISTORY : "tracks changes"
    USERS ||--o{ PERMIT_STATUS_HISTORY : "makes changes"
    
    PERMITS ||--o{ PERMIT_EQUIPMENT : "requires"
    PERMITS ||--o{ PERMIT_WORKERS : "involves"
    
    USERS ||--o{ SYSTEM_SETTINGS : "updates"
    USERS ||--o{ AUDIT_LOGS : "performs actions"
```

## Database Statistics

### **Table Count**: 14 core tables
### **Entity Distribution**:
- **Master Data**: 4 tables (departments, roles, locations, permit_types)
- **User Management**: 2 tables (users, refresh_tokens)
- **Permit Management**: 5 tables (permits, permit_status_history, permit_equipment, permit_workers, notifications)
- **Visitor Management**: 1 table (visitor_requests)
- **System Management**: 2 tables (system_settings, audit_logs)

### **Relationship Cardinality**:
- **One-to-Many**: 13 relationships
- **One-to-One**: 2 relationships (department head, location safety officer)

### **Key Features**:
- ✅ **Referential Integrity**: All foreign keys properly defined
- ✅ **Audit Trail**: Complete change tracking via audit_logs and permit_status_history
- ✅ **Hierarchical Structure**: Department heads, role-based permissions
- ✅ **Comprehensive Tracking**: Equipment, workers, status changes
- ✅ **Security**: JWT token management, user authentication
- ✅ **Notifications**: Event-driven notification system

## Entity Descriptions

### **Core Business Entities**

#### **DEPARTMENTS**
- Represents 23 plant departments
- Has hierarchical structure with department heads
- Tracks budget and location information

#### **USERS**
- 155+ employees across all departments
- Role-based access control
- Department association for organizational structure

#### **PERMITS**
- Work permit applications and approvals
- Complete workflow tracking (draft → submitted → approved/rejected)
- Links to locations, permit types, and involved personnel

#### **LOCATIONS**
- 10 plant locations with GPS coordinates
- Risk level classification (LOW/MEDIUM/HIGH/CRITICAL)
- Assigned safety officers

### **Support Entities**

#### **PERMIT_TYPES**
- 8 types of work permits
- PPE requirements and validity periods
- Risk assessment templates

#### **NOTIFICATIONS**
- Event-driven messaging system
- Links users to permit-related events
- Read/unread status tracking

#### **VISITOR_REQUESTS**
- External visitor management
- Host employee assignment
- Check-in/check-out tracking

### **Audit & Tracking Entities**

#### **PERMIT_STATUS_HISTORY**
- Complete audit trail for permit changes
- Tracks who changed what and when
- Reason codes for changes

#### **AUDIT_LOGS**
- System-wide audit logging
- User action tracking
- Data change history

#### **SYSTEM_SETTINGS**
- Configurable system parameters
- Admin-controlled settings
- Change tracking

## Key Relationships Explained

### **1. Department Structure**
- Users belong to departments (users.department_id → departments.id)
- Departments have heads (departments.head_id → users.id)
- Creates organizational hierarchy

### **2. Role-Based Access**
- Users have roles (users.role_id → roles.id)
- Roles define permissions for system access
- Supports hierarchical permission model

### **3. Permit Workflow**
- Users create permits (permits.applicant_id → users.id)
- Users approve/reject permits (permits.approved_by_id/rejected_by_id → users.id)
- Permits belong to types and locations

### **4. Safety Management**
- Locations have safety officers (locations.safety_officer_id → users.id)
- Permits require safety assessments
- Equipment and worker tracking for safety compliance

### **5. Audit & Compliance**
- All permit changes tracked in permit_status_history
- System actions logged in audit_logs
- Complete traceability for compliance

This ER diagram represents a comprehensive safety management system designed for industrial operations with proper separation of concerns, audit capabilities, and role-based security.
