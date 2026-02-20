package com.pdrhenrick.mini_portainer.controller;

import com.pdrhenrick.mini_portainer.entity.DockerLog;
import com.pdrhenrick.mini_portainer.service.DockerService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

// IMPORTANTE: Liberamos tanto localhost quanto o IP 127.0.0.1 para matar o erro 403
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@RestController
@RequestMapping("/api/docker")
public class DockerController {

    private final DockerService dockerService;

    public DockerController(DockerService dockerService) {
        this.dockerService = dockerService;
    }

    @GetMapping("/containers")
    public List<Map<String, Object>> listContainers() {
        // Transformamos o objeto complexo do Docker em um Map simples 
        // Isso resolve o erro "HttpMessageNotWritableException" que apareceu no seu log
        return dockerService.listAllContainers().stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("names", c.getNames());
            map.put("status", c.getStatus());
            map.put("state", c.getState());
            map.put("image", c.getImage());
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/start/{id}")
    public String startContainer(@PathVariable String id) {
        dockerService.startContainer(id);
        return "Container " + id + " iniciado!";
    }

    @GetMapping("/stop/{id}")
    public String stopContainer(@PathVariable String id) {
        dockerService.stopContainer(id);
        return "Container " + id + " parado!";
    }
    
    @GetMapping("/logs")
    public List<DockerLog> getLogs() {
        return dockerService.getAllLogs();
    }
}