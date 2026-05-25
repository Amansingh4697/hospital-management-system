package com.hms.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Document(collection = "patients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Patient {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    private Integer age;
    private String gender;
    private String disease;
    private String phone;
    private String email;
    private String address;

    @JsonIgnore
    private List<String> appointmentIds;
}
