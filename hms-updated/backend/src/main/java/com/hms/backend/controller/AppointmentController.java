package com.hms.backend.controller;

import com.hms.backend.entity.Appointment;
import com.hms.backend.repository.AppointmentRepository;
import com.hms.backend.repository.DoctorRepository;
import com.hms.backend.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentController(AppointmentRepository appointmentRepository,
                                  DoctorRepository doctorRepository,
                                  PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAll() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        String doctorId = body.get("doctorId").toString();
        String patientId = body.get("patientId").toString();

        var doctor = doctorRepository.findById(doctorId);
        var patient = patientRepository.findById(patientId);

        if (doctor.isEmpty() || patient.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Doctor or Patient not found"));
        }

        Appointment a = new Appointment();
        a.setAppointmentDate(body.get("appointmentDate").toString());
        a.setAppointmentTime(body.get("appointmentTime").toString());
        a.setNotes(body.getOrDefault("notes", "").toString());
        a.setStatus("SCHEDULED");
        a.setDoctor(doctor.get());
        a.setPatient(patient.get());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appointmentRepository.save(a));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id,
                                           @RequestBody Map<String, String> body) {
        return appointmentRepository.findById(id).map(a -> {
            a.setStatus(body.get("status"));
            return ResponseEntity.ok(appointmentRepository.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!appointmentRepository.existsById(id)) return ResponseEntity.notFound().build();
        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
