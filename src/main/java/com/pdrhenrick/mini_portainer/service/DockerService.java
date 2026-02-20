package com.pdrhenrick.mini_portainer.service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.model.Container;
import com.pdrhenrick.mini_portainer.entity.DockerLog;
import com.pdrhenrick.mini_portainer.repository.DockerLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DockerService {

    private final DockerClient dockerClient;
    private final DockerLogRepository repository;

    public DockerService(DockerClient dockerClient, DockerLogRepository repository) {
        this.dockerClient = dockerClient;
        this.repository = repository;
    }

    public List<Container> listAllContainers() {
        return dockerClient.listContainersCmd().withShowAll(true).exec();
    }

    // Método de Iniciar com proteção contra erros
    public void startContainer(String id) {
        try {
            dockerClient.startContainerCmd(id).exec();
            saveLog(id, "START");
        } catch (Exception e) {
            // Se der erro (ex: já está rodando), ele apenas registra a tentativa
            saveLog(id, "START_FAILED_OR_ALREADY_RUNNING");
        }
    }

    // Método de Parar com proteção contra erros (Onde estava dando Erro 500)
    public void stopContainer(String id) {
        try {
            dockerClient.stopContainerCmd(id).exec();
            saveLog(id, "STOP");
        } catch (Exception e) {
            // Evita que a aplicação trave se o container já estiver parado
            saveLog(id, "STOP_FAILED_OR_ALREADY_STOPPED");
        }
    }

    public List<DockerLog> getAllLogs() {
        return repository.findAll();
    }

    private void saveLog(String containerId, String action) {
        DockerLog log = new DockerLog();
        log.setContainerId(containerId);
        log.setAction(action);
        log.setTimestamp(LocalDateTime.now());
        repository.save(log);
    }
}