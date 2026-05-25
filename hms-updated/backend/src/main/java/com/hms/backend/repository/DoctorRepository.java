package com.hms.backend.repository;

import com.hms.backend.entity.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DoctorRepository extends MongoRepository<Doctor, String> {
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
}
