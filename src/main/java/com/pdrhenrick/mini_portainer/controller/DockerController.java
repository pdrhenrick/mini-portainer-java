package com.pdrhenrick.mini_portainer.controller;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.Container;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/docker")
public class DockerController {

    private final DockerClient dockerClient;

    // Injeção de Dependência: O Spring entrega o cliente pronto aqui
    public DockerController(DockerClient dockerClient) {
        this.dockerClient = dockerClient;
    }

    @GetMapping("/containers")
    public List<Container> listContainers() {
        // Comando equivalente ao "docker ps -a"
        return dockerClient.listContainersCmd()
                .withShowAll(true) 
                .exec();
    }
@GetMapping("/start/{id}")
    public String startContainer(@PathVariable String id) {
        dockerClient.startContainerCmd(id).exec();
        return "Container " + id + " iniciado com sucesso!";
    }

    @GetMapping("/stop/{id}")
    public String stopContainer(@PathVariable String id) {
        dockerClient.stopContainerCmd(id).exec();
        return "Container " + id + " parado com sucesso!";
    }
}