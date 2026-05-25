package com.hms.backend.controller;

import com.hms.backend.entity.Doctor;
import com.hms.backend.repository.DoctorRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAll() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getById(@PathVariable String id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Doctor> create(@Valid @RequestBody Doctor doctor) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(doctorRepository.save(doctor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable String id,
                                         @Valid @RequestBody Doctor updated) {
        return doctorRepository.findById(id).map(doc -> {
            doc.setName(updated.getName());
            doc.setSpecialization(updated.getSpecialization());
            doc.setDepartment(updated.getDepartment());
            doc.setPhone(updated.getPhone());
            doc.setEmail(updated.getEmail());
            return ResponseEntity.ok(doctorRepository.save(doc));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!doctorRepository.existsById(id)) return ResponseEntity.notFound().build();
        doctorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
