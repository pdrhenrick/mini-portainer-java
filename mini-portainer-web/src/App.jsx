import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play, Square, Activity, History, Clock } from 'lucide-react';

// Trocamos localhost por 127.0.0.1 para evitar bloqueios de resolução de nome do Windows
const API_URL = "http://127.0.0.1:8080/api/docker";

function App() {
  const [containers, setContainers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const t = new Date().getTime(); 
      // Adicionamos timeout e headers de cache para forçar a conexão
      const config = { 
        timeout: 2000,
        headers: { 'Cache-Control': 'no-cache' } 
      };

      const [resContainers, resLogs] = await Promise.all([
        axios.get(`${API_URL}/containers?t=${t}`, config),
        axios.get(`${API_URL}/logs?t=${t}`, config)
      ]);
      
      setContainers(resContainers.data);
      setLogs(resLogs.data.reverse());
      setError(null);
    } catch (err) {
      // Log detalhado no F12 para sabermos o motivo real da falha
      console.error("Falha na conexão com a API:", err.message);
      setError("Aguardando resposta do Backend Java (Porta 8080)...");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (action, id) => {
    try {
      await axios.get(`${API_URL}/${action}/${id}`);
      fetchData(); 
    } catch (err) {
      alert("Erro ao executar ação! Verifique se o Docker Desktop está aberto.");
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#121212', color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #333', marginBottom: '30px', paddingBottom: '10px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
          <Activity size={32} color="#4ade80" /> Mini-Portainer Dashboard
        </h1>
      </header>

      {error && (
        <div style={{ 
          color: '#121212', backgroundColor: '#fbbf24', fontWeight: 'bold',
          marginBottom: '20px', padding: '12px', borderRadius: '8px', textAlign: 'center' 
        }}>
          {error}
        </div>
      )}
      
      {/* TABELA DE CONTAINERS */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#4ade80' }}>
           Gerenciamento de Containers
        </h2>
        <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2d2d2d', textAlign: 'left' }}>
                <th style={{ padding: '16px' }}>Nome</th>
                <th>Status</th>
                <th>Imagem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {containers.length === 0 && !error && (
                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>Nenhum container encontrado.</td></tr>
              )}
              {containers.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{c.names[0].replace("/", "")}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                      backgroundColor: c.state === 'running' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: c.state === 'running' ? '#4ade80' : '#f87171', border: `1px solid ${c.state === 'running' ? '#4ade80' : '#f87171'}`
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ color: '#9ca3af', fontSize: '13px' }}>{c.image}</td>
                  <td>
                    <button 
                      onClick={() => handleAction(c.state === 'running' ? 'stop' : 'start', c.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.state === 'running' ? '#f87171' : '#4ade80', transition: 'transform 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {c.state === 'running' ? <Square size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TABELA DE LOGS */}
      <section>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa' }}>
          <History size={20} /> Histórico de Auditoria (PostgreSQL)
        </h2>
        <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', maxHeight: '300px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#2d2d2d', textAlign: 'left' }}>
                <th style={{ padding: '16px' }}>ID Container</th>
                <th>Ação</th>
                <th>Data / Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>Nenhum log registrado ainda.</td></tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #333', fontSize: '13px' }}>
                  <td style={{ padding: '12px 16px', color: '#60a5fa', fontFamily: 'monospace' }}>{log.containerId.substring(0, 12)}</td>
                  <td>
                    <b style={{ color: log.action.includes('START') ? '#4ade80' : '#f87171' }}>{log.action}</b>
                  </td>
                  <td style={{ color: '#9ca3af' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={12} />
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;