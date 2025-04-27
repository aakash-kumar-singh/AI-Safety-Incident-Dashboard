import React, { useState } from "react";
import { ThemeProvider } from "./components/Theme";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [incidents, setIncidents] = useState([
    { 
      id: 1,
      title: "Biased Recommendation Algorithm",
      description: "Algorithm consistently favored certain demographics in a way that created unfair advantages for specific user groups. This bias was detected during routine fairness auditing and has since been mitigated through algorithmic adjustments and expanded training data.",
      severity: "Medium",
      reported_at: "2025-03-15T10:00:00Z" 
    },
    { 
      id: 2,
      title: "LLM Hallucination in Critical Info",
      description: "LLM provided incorrect safety procedure information when queried about emergency protocols. This hallucination could have led to dangerous physical outcomes if followed in a real emergency situation. The model has been retrained with safety-critical information and guardrails implemented.",
      severity: "High",
      reported_at: "2025-04-01T14:30:00Z" 
    },
    { 
      id: 3,
      title: "Minor Data Leak via Chatbot",
      description: "Chatbot inadvertently exposed non-sensitive user metadata in its responses. The leaked information included interaction timestamps and generic session identifiers but no personally identifiable information. The issue was patched within hours of discovery.",
      severity: "Low",
      reported_at: "2025-03-20T09:15:00Z" 
    }
  ]);

  const addIncident = (formData) => {
    const now = new Date().toISOString();
    const newId = Math.max(0, ...incidents.map(incident => incident.id)) + 1;
    
    const incidentToAdd = {
      ...formData,
      id: newId,
      reported_at: now
    };
    
    setIncidents([...incidents, incidentToAdd]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const deleteIncident = (id) => {
    setIncidents(incidents.filter(incident => incident.id !== id));
  };

  return (
    <ThemeProvider>
      <Dashboard 
        incidents={incidents}
        addIncident={addIncident}
        deleteIncident={deleteIncident}
        formatDate={formatDate}
      />
    </ThemeProvider>
  );
};

export default App;
