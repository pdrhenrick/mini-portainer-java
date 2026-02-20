package com.pdrhenrick.mini_portainer.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "docker_logs")
@Data 
public class DockerLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String containerId;
    private String action; // Ex: "START" ou "STOP"
    private LocalDateTime timestamp;
}