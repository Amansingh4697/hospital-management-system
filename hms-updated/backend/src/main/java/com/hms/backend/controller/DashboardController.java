package com.hms.backend.controller;

import com.hms.backend.repository.AppointmentRepository;
import com.hms.backend.repository.DoctorRepository;
import com.hms.backend.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardController(DoctorRepository doctorRepository,
                                PatientRepository patientRepository,
                                AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalDoctors", doctorRepository.count(),
                "totalPatients", patientRepository.count(),
                "totalAppointments", appointmentRepository.count(),
                "scheduledAppointments", appointmentRepository.countByStatus("SCHEDULED"),
                "completedAppointments", appointmentRepository.countByStatus("COMPLETED")
        ));
    }
}
