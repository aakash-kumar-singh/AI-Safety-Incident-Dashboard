import React, { useState, useRef, useEffect } from "react";
import { useTheme, adjustColor } from "./Theme";
import IncidentCard from "./IncidentCard";

const Dashboard = ({ 
  incidents, 
  addIncident,
  deleteIncident,
  formatDate
}) => {
  const { darkMode, theme, colors, toggleDarkMode } = useTheme();
  const particlesRef = useRef(null);
  
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Medium",
  });
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  
  const filteredIncidents = incidents.filter(incident => {
    if (severityFilter === "All") return true;
    return incident.severity === severityFilter;
  });

  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    const dateA = new Date(a.reported_at).getTime();
    const dateB = new Date(b.reported_at).getTime();
    return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    
    addIncident(formData);
    setFormData({
      title: "",
      description: "",
      severity: "Medium"
    });
    setIsFormVisible(false);
  };

  useEffect(() => {
    if (!particlesRef.current) return;

    const canvas = particlesRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = 80;
    const colors = ["#3EEAFB", "#FF7D54", "#FFC149", "#36F1CD", "#E45A84"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 0.15,
          y: (Math.random() - 0.5) * 0.15,
        },
        opacity: Math.random() * 0.2,
      });
    }

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const styles = {
    container: {
      minHeight: "100vh",
      background: theme.background,
      color: theme.text,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      position: "relative",
    },
    canvas: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 1,
    },
    vignette: darkMode ? {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
      background: "radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.3) 100%)",
      zIndex: 2,
    } : null,
    contentWrapper: {
      position: "relative",
      zIndex: 3,
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1rem",
      marginBottom: "2rem",
    },
    titleSection: {
      flex: 1,
    },
    headerTitle: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "1rem",
      color: darkMode ? "#CCCCCC" : "#000000",
      margin: 0,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    subheader: {
      fontSize: "1.25rem",
      fontWeight: "400",
      color: colors.amber,
      fontStyle: "italic",
      marginBottom: "0",
      marginTop: "1rem",
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    themeToggle: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      position: "relative",
      background: darkMode 
        ? "linear-gradient(145deg, #FFFFFF, #F0F0F0)" 
        : "linear-gradient(145deg, #1A1A1A, #000000)",
      color: darkMode ? "#000000" : "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      boxShadow: darkMode
        ? "5px 5px 10px rgba(0, 0, 0, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.1)"
        : "5px 5px 10px rgba(0, 0, 0, 0.5), -3px -3px 8px rgba(255, 255, 255, 0.05)",
      transition: "all 0.3s ease",
      transform: hoveredButton === "theme-toggle" 
        ? "scale(1.05)" 
        : "scale(1)",
    },
    
    controlsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      marginBottom: "2rem",
      alignItems: "center",
      justifyContent: "space-between",
    },
    filterSort: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
    },
    selectWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    selectLabel: {
      fontSize: "0.9rem",
      color: theme.subtext,
    },
    select: {
      background: theme.inputBg,
      color: theme.text,
      border: `1px solid ${theme.inputBorder}`,
      borderRadius: "8px",
      padding: "0.8rem 1rem",
      fontSize: "0.95rem",
      outline: "none",
      minWidth: "150px",
      boxShadow: darkMode
        ? "inset 4px 4px 8px rgba(0,0,0,0.5), inset -4px -4px 8px rgba(255,255,255,0.05)"
        : "4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)",
      appearance: "none",
      backgroundImage: darkMode
        ? `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`
        : `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      backgroundSize: "1rem",
    },
    formContainer: {
      padding: "2rem",
      backgroundColor: theme.formBg,
      borderRadius: "12px",
      marginBottom: "2rem",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      border: `1px solid ${theme.sectionBorder}`,
      display: isFormVisible ? "block" : "none",
    },
    formTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "1.5rem",
      color: theme.headerText,
      margin: 0,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    formLabel: {
      display: "block",
      marginBottom: "0.5rem",
      fontSize: "0.95rem",
      color: theme.text,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    formControl: {
      width: "100%",
      padding: "0.8rem 1rem",
      backgroundColor: theme.inputBg,
      border: `1px solid ${theme.inputBorder}`,
      borderRadius: "8px",
      color: theme.text,
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.2s",
    },
    formTextarea: {
      minHeight: "120px",
      resize: "vertical",
    },
    formButtonGroup: {
      display: "flex",
      gap: "1rem",
      justifyContent: "flex-end",
      marginTop: "2rem",
    },
    section: {
      marginBottom: "3rem",
    },
    sectionTitle: {
      fontSize: "1.8rem",
      marginBottom: "1.5rem",
      fontWeight: "600",
      color: theme.headerText,
      borderBottom: `1px solid ${theme.sectionBorder}`,
      paddingBottom: "0.5rem",
      display: "inline-block",
      margin: 0,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    incidentList: {
      display: "flex",
      flexDirection: "column", 
      marginTop: "1.5rem",
    },
    emptyMessage: {
      padding: "2rem",
      textAlign: "center",
      color: theme.subtext,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    button3D: {
      background: "#191919",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "8px",
      padding: "0.8rem 2rem",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      position: "relative",
      boxShadow: "0 6px 0 #0A0A0A, 0 8px 10px rgba(0, 0, 0, 0.2)",
      transform: "translateY(0)",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    
    colorButton: (color, textColor = "#FFFFFF") => {
      const baseColor = color || "#191919";
      const shadowDir = color === "#000000" ? 30 : -30;
      const shadowColor = adjustColor(baseColor, shadowDir);
      
      const style = {
        background: baseColor,
        color: textColor,
        boxShadow: `0 6px 0 ${shadowColor}, 0 8px 10px rgba(0, 0, 0, 0.2)`,
      };
      
      if (color === "#000000" && darkMode) {
        return {
          ...style,
          border: `1px solid ${theme.sectionBorder}`,
        };
      }
      
      if (color === "#FFFFFF" && !darkMode) {
        return {
          ...style,
          border: `1px solid ${theme.sectionBorder}`,
        };
      }
      
      return style;
    },
    secondaryButton: {
      background: darkMode
        ? "#FFFFFF"
        : "linear-gradient(to bottom, #000000 0%, #000000 60%, #333333 100%)",
      color: darkMode ? "#000000" : "#FFFFFF",
      border: `1px solid ${theme.sectionBorder}`,
      borderRadius: "8px",
      padding: "0.8rem 2rem",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      position: "relative",
      boxShadow: darkMode 
        ? "0 4px 0 #CCCCCC, 0 6px 10px rgba(0, 0, 0, 0.3)" 
        : "0 4px 0 #444444, 0 6px 10px rgba(0, 0, 0, 0.3)",
      transform: "translateY(0)",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  };

  const getButtonStyles = (buttonId, baseStyle, colorOption = null, textColor = null) => {
    let style = {...baseStyle};
    
    if (colorOption) {
      style = {...style, ...styles.colorButton(colorOption, textColor)};
    }
    
    if (hoveredButton === buttonId) {
      style = {
        ...style, 
        transform: "translateY(-2px)",
        boxShadow: colorOption 
          ? `0 8px 0 ${adjustColor(colorOption, colorOption === "#000000" ? 30 : -30)}, 0 10px 15px rgba(0, 0, 0, 0.3)`
          : style.boxShadow.replace("6px", "8px").replace("8px", "10px").replace("0.2)", "0.3)"),
      };
    }
    
    if (hoveredButton === buttonId && animating) {
      style = {
        ...style, 
        transform: "translateY(4px)",
        boxShadow: colorOption 
          ? `0 2px 0 ${adjustColor(colorOption, colorOption === "#000000" ? 30 : -30)}, 0 3px 6px rgba(0, 0, 0, 0.1)`
          : style.boxShadow.replace("8px", "2px").replace("10px", "3px").replace("0.3)", "0.1)"),
        transition: "all 50ms cubic-bezier(0.4, 0, 0.2, 1)",
      };
    }
    
    return style;
  };

  return (
    <div style={styles.container}>
      {/* Background elements */}
      <canvas ref={particlesRef} style={styles.canvas} />
      {darkMode && <div style={styles.vignette} />}

      <div style={styles.contentWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h1 style={styles.headerTitle}>AI Safety Incident Dashboard</h1>
            <p style={styles.subheader}>
              Monitor and track AI safety incidents across your organization
            </p>
          </div>
          <button 
            onClick={toggleDarkMode} 
            style={{
              width: "80px",
              height: "40px",
              borderRadius: "20px",
              background: darkMode 
                ? "linear-gradient(145deg, #1A1A1A, #000000)" 
                : "linear-gradient(145deg, #E0E0E0, #FFFFFF)",
              border: darkMode 
                ? "2px solid #888888" 
                : "2px solid #333333",
              display: "flex",
              alignItems: "center",
              padding: "5px",
              cursor: "pointer",
              position: "relative",
              boxShadow: darkMode
                ? "inset 4px 4px 8px rgba(0,0,0,0.6), inset -4px -4px 8px rgba(255,255,255,0.05)"
                : "4px 4px 8px rgba(0,0,0,0.15), -4px -4px 8px rgba(255,255,255,0.6)",
              transition: "all 300ms ease",
            }}
            onMouseEnter={() => setHoveredButton("theme-toggle")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: darkMode ? "#AAAAAA" : "#333333",
              transform: darkMode ? "translateX(0)" : "translateX(40px)",
              transition: "transform 300ms ease, background 300ms ease",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }} />
          </button>
        </div>
        
        {/* Controls */}
        <div style={styles.controlsContainer}>
          <div style={styles.filterSort}>
            <div style={styles.selectWrapper}>
              <label style={styles.selectLabel}>Filter by Severity</label>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  style={{
                    background: darkMode 
                      ? "linear-gradient(135deg, #1F1F1F, #0D0D0D)" 
                      : "linear-gradient(135deg, #F0F0F0, #FFFFFF)",
                    color: darkMode ? "#DDDDDD" : "#222222",
                    border: darkMode 
                      ? "1px solid #555555" 
                      : "1px solid #CCCCCC",
                    borderRadius: "8px",
                    padding: "0.8rem 1.5rem",
                    width: "200px",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    boxShadow: darkMode
                      ? "4px 4px 10px rgba(0,0,0,0.7)"
                      : "4px 4px 10px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  {severityFilter === "All" ? "All Incidents" : `${severityFilter} Severity`}
                </button>

                {filterDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      left: 0,
                      width: "100%",
                      background: theme.contentBg,
                      borderRadius: "8px",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                      zIndex: 10,
                      overflow: "hidden",
                    }}
                  >
                    {["All", "Low", "Medium", "High"].map((level) => (
                      <div
                        key={level}
                        onClick={() => {
                          setSeverityFilter(level);
                          setFilterDropdownOpen(false);
                        }}
                        onMouseEnter={() => setHoveredOption(level)}
                        onMouseLeave={() => setHoveredOption(null)}
                        style={{
                          padding: "0.8rem 1rem",
                          cursor: "pointer",
                          background:
                            hoveredOption === level
                              ? (darkMode ? "#333333" : "#E0E0E0")
                              : (severityFilter === level
                                  ? theme.inputBg
                                  : (darkMode ? "#222222" : "#F7F7F7")),
                          color: theme.text,
                          borderBottom: level !== "High" ? `1px solid ${theme.sectionBorder}` : "none",
                          fontWeight: "500",
                          transition: "background 0.15s",
                        }}
                      >
                        {level === "All" ? "All Incidents" : `${level} Severity`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={styles.selectWrapper}>
              <label style={styles.selectLabel}>Sort by Date</label>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  style={{
                    background: darkMode 
                      ? "linear-gradient(135deg, #1F1F1F, #0D0D0D)" 
                      : "linear-gradient(135deg, #F0F0F0, #FFFFFF)",
                    color: darkMode ? "#DDDDDD" : "#222222",
                    border: darkMode 
                      ? "1px solid #555555" 
                      : "1px solid #CCCCCC",
                    borderRadius: "8px",
                    padding: "0.8rem 1.5rem",
                    width: "200px",
                    textAlign: "left",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    boxShadow: darkMode
                      ? "4px 4px 10px rgba(0,0,0,0.7)"
                      : "4px 4px 10px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  {sortOrder === "Newest" ? "Newest First" : "Oldest First"}
                </button>

                {sortDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      left: 0,
                      width: "100%",
                      background: theme.contentBg,
                      borderRadius: "8px",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                      zIndex: 10,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onClick={() => {
                        setSortOrder("Newest");
                        setSortDropdownOpen(false);
                      }}
                      onMouseEnter={() => setHoveredOption("Newest")}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        padding: "0.8rem 1rem",
                        cursor: "pointer",
                        background:
                          hoveredOption === "Newest"
                            ? (darkMode ? "#333333" : "#E0E0E0")
                            : (sortOrder === "Newest"
                                ? theme.inputBg
                                : (darkMode ? "#222222" : "#F7F7F7")),
                        color: theme.text,
                        borderBottom: `1px solid ${theme.sectionBorder}`,
                        fontWeight: "500",
                        transition: "background 0.15s",
                      }}
                    >
                      Newest First
                    </div>
                    <div
                      onClick={() => {
                        setSortOrder("Oldest");
                        setSortDropdownOpen(false);
                      }}
                      onMouseEnter={() => setHoveredOption("Oldest")}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        padding: "0.8rem 1rem",
                        cursor: "pointer",
                        background:
                          hoveredOption === "Oldest"
                            ? (darkMode ? "#333333" : "#E0E0E0")
                            : (sortOrder === "Oldest"
                                ? theme.inputBg
                                : (darkMode ? "#222222" : "#F7F7F7")),
                        color: theme.text,
                        fontWeight: "500",
                        transition: "background 0.15s",
                      }}
                    >
                      Oldest First
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            style={getButtonStyles("report-btn", styles.button3D, colors.blue, "#FFFFFF")}
            onMouseEnter={() => setHoveredButton("report-btn")}
            onMouseLeave={() => {
              setHoveredButton(null);
              setAnimating(false);
            }}
            onMouseDown={() => setAnimating(true)}
            onMouseUp={() => setAnimating(false)}
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            {isFormVisible ? "Hide Form" : "Report New Incident"}
          </button>
        </div>
        
        {/* Form */}
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Report New AI Safety Incident</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                style={styles.formControl}
                placeholder="Enter incident title"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={{...styles.formControl, ...styles.formTextarea}}
                placeholder="Provide details about the incident"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Severity *</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                style={styles.formControl}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div style={styles.formButtonGroup}>
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                style={getButtonStyles("cancel-btn", styles.secondaryButton)}
                onMouseEnter={() => setHoveredButton("cancel-btn")}
                onMouseLeave={() => {
                  setHoveredButton(null);
                  setAnimating(false);
                }}
                onMouseDown={() => setAnimating(true)}
                onMouseUp={() => setAnimating(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={getButtonStyles("submit-btn", styles.button3D, colors.emerald, "#FFFFFF")}
                onMouseEnter={() => setHoveredButton("submit-btn")}
                onMouseLeave={() => {
                  setHoveredButton(null);
                  setAnimating(false);
                }}
                onMouseDown={() => setAnimating(true)}
                onMouseUp={() => setAnimating(false)}
              >
                Submit Incident
              </button>
            </div>
          </form>
        </div>
        
        {/* Incident List */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            {severityFilter === "All" ? "All Incidents" : `${severityFilter} Severity Incidents`} ({sortedIncidents.length})
          </h2>
          
          {sortedIncidents.length === 0 ? (
            <div style={styles.emptyMessage}>
              No incidents match your current filter.
            </div>
          ) : (
            <div style={styles.incidentList}>
              {sortedIncidents.map((incident) => (
                <IncidentCard 
                  key={incident.id} 
                  incident={incident}
                  formatDate={formatDate}
                  onDelete={deleteIncident}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;