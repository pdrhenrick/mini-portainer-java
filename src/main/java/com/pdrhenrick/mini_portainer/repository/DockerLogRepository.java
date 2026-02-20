package com.pdrhenrick.mini_portainer.repository;

import com.pdrhenrick.mini_portainer.entity.DockerLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DockerLogRepository extends JpaRepository<DockerLog, Long> {
}