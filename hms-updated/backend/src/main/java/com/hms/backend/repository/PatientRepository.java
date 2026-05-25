package com.hms.backend.repository;

import com.hms.backend.entity.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PatientRepository extends MongoRepository<Patient, String> {
    List<Patient> findByNameContainingIgnoreCase(String name);
}
