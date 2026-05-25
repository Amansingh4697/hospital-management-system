package com.hms.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.*;

@Document(collection = "appointments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Appointment {

    @Id
    private String id;

    private String appointmentDate;
    private String appointmentTime;
    private String status = "SCHEDULED";
    private String notes;

    @DBRef
    private Doctor doctor;

    @DBRef
    private Patient patient;
}
