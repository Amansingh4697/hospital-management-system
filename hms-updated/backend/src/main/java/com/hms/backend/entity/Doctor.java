package com.hms.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Document(collection = "doctors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Doctor {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    private String department;
    private String phone;
    private String email;

    @JsonIgnore
    private List<String> appointmentIds;
}
