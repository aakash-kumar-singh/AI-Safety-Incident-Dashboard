import React, { useState } from "react";
import { useTheme } from "./Theme";
import { FaTrashAlt } from 'react-icons/fa';

const IncidentCard = ({ incident, formatDate, onDelete }) => {
  const { darkMode, theme, getSeverityColor } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [hoveredConfirm, setHoveredConfirm] = useState(false);
  const [hoveredCancel, setHoveredCancel] = useState(false);
  // Track hover state for View Details button
  const [hoveredDetails, setHoveredDetails] = useState(false);

  const severityColor = getSeverityColor(incident.severity);

  const styles = {
    cardContainer: {
      position: "relative",
      marginBottom: "1.5rem",
      cursor: "pointer",
    },
    glossyBorder: {
      position: "absolute",
      top: "-1px",
      left: "-1px",
      right: "-1px",
      bottom: "-1px",
      borderRadius: "12px",
      padding: "1px",
      background: `linear-gradient(135deg, ${severityColor}66, ${severityColor}22, ${severityColor}66)`,
      content: '""',
      zIndex: 0,
      opacity: hoveredCard ? 1 : 0.8,
      boxShadow: hoveredCard 
        ? `0 0 20px 0 ${severityColor}33, inset 0 0 10px 0 ${severityColor}55`
        : `0 0 15px 0 ${severityColor}22, inset 0 0 6px 0 ${severityColor}44`,
      transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    glossyCard: {
      background: theme.contentBg,
      borderRadius: "12px",
      padding: "0",
      position: "relative",
      overflow: "hidden",
      transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      boxShadow: hoveredCard
        ? `0 12px 0 ${severityColor}55, 0 16px 30px rgba(0,0,0,0.3)`
        : `0 6px 0 ${severityColor}33, 0 10px 20px rgba(0,0,0,0.2)`,
      transform: hoveredCard ? "translateY(-6px)" : "translateY(0)",
    },
    cardContent: {
      position: "relative",
      zIndex: 1,
      background: theme.contentBg,
      borderRadius: "11px",
      height: "100%",
      padding: "1.5rem",
      transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "1rem",
      flexWrap: "wrap",
      gap: "0.5rem",
    },
    cardTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: theme.headerText,
      margin: 0,
      lineHeight: "1.2",
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    severityBadge: {
      background: `${severityColor}22`,
      color: severityColor,
      padding: "0.25rem 0.75rem",
      borderRadius: "999px",
      fontSize: "0.8rem",
      fontWeight: "600",
      border: `1px solid ${severityColor}44`,
    },
    cardMeta: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "1.5rem",
      color: theme.subtext,
      fontSize: "0.9rem",
      fontWeight: "500",
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    cardDescription: {
      color: theme.text,
      fontSize: "1rem",
      lineHeight: "1.7",
      marginBottom: "1.5rem",
      opacity: isExpanded ? 1 : 0,
      maxHeight: isExpanded ? "500px" : "0",
      marginTop: isExpanded ? "1rem" : 0,
      overflow: "hidden",
      transition: "all 300ms ease-in-out",
      fontFamily: "'Georgia', 'Times New Roman', serif",
    },
    cardActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "1rem",
    },
    deleteButton: {
      background: darkMode 
        ? "linear-gradient(135deg, #cc0000, #990000)" 
        : "linear-gradient(135deg, #ff3333, #cc0000)",
      color: "#FFFFFF",
      border: "none",
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.3rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 6px 10px rgba(0,0,0,0.2)",
      transform: hoveredButton === "delete" ? "translateY(-2px)" : "translateY(0)",
    },
    detailsButton: {
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
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translateY(0)",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: theme.contentBg,
      padding: "2rem",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      maxWidth: "400px",
      width: "100%",
    },
    modalButtonGroup: {
      marginTop: "1.5rem",
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
    },
    modalButton: {
      padding: "0.8rem 1.5rem",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      border: "none",
      fontSize: "0.95rem",
    },
    confirmButton: {
      background: "#DC3545",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "8px",
      padding: "0.8rem 2rem",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      position: "relative",
      boxShadow: "0 6px 0 #b52a37, 0 8px 10px rgba(0,0,0,0.2)",
      transform: "translateY(0)",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    cancelButton: {
      background: "#CCCCCC",
      color: "#111111",
      border: "none",
      borderRadius: "8px",
      padding: "0.8rem 2rem",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      position: "relative",
      boxShadow: "0 6px 0 #999999, 0 8px 10px rgba(0,0,0,0.2)",
      transform: "translateY(0)",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  };

  return (
    <div style={styles.cardContainer}>
      
      <div style={styles.glossyBorder} />
      
      <div
        style={styles.glossyCard}
        onMouseEnter={() => setHoveredCard(true)}
        onMouseLeave={() => {
          setHoveredCard(false);
          setAnimating(false);
        }}
      >
        <div style={styles.cardContent}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>{incident.title}</h3>
            <div style={styles.severityBadge}>
              {incident.severity}
            </div>
          </div>
          
          <div style={styles.cardMeta}>
            <span>ID: {incident.id}</span>
            <span>Reported: {formatDate(incident.reported_at)}</span>
          </div>

          <div style={styles.cardDescription}>
            {incident.description}
          </div>

          <div style={styles.cardActions}>
            <button
              style={{
                ...styles.detailsButton,
                transform: hoveredDetails ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hoveredDetails
                  ? darkMode
                    ? "0 6px 0 #CCCCCC, 0 8px 15px rgba(0,0,0,0.3)"
                    : "0 6px 0 #444444, 0 8px 15px rgba(0,0,0,0.3)"
                  : darkMode
                    ? "0 4px 0 #CCCCCC, 0 6px 10px rgba(0,0,0,0.3)"
                    : "0 4px 0 #444444, 0 6px 10px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={() => setHoveredDetails(true)}
              onMouseLeave={() => setHoveredDetails(false)}
              onMouseDown={() => setAnimating(true)}
              onMouseUp={() => setAnimating(false)}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Hide Details" : "View Details"}
            </button>

            <button
              style={styles.deleteButton}
              onClick={() => setConfirmDelete(true)}
              onMouseEnter={() => setHoveredButton("delete")}
              onMouseLeave={() => {
                setHoveredButton(null);
                setAnimating(false);
              }}
              onMouseDown={() => setAnimating(true)}
              onMouseUp={() => setAnimating(false)}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>

      
      {confirmDelete && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: "1rem" }}>Confirm Deletion</h2>
            <p>Are you sure you want to delete this incident?</p>
            <div style={styles.modalButtonGroup}>
              <button
                style={{
                  ...styles.modalButton,
                  ...styles.confirmButton,
                  transform: hoveredConfirm ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: hoveredConfirm 
                    ? "0 8px 0 #b52a37, 0 10px 15px rgba(0,0,0,0.3)"
                    : "0 6px 0 #b52a37, 0 8px 10px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={() => setHoveredConfirm(true)}
                onMouseLeave={() => setHoveredConfirm(false)}
                onClick={() => {
                  onDelete(incident.id);
                  setConfirmDelete(false);
                }}
              >
                Yes, Delete
              </button>
              <button
                style={{
                  ...styles.modalButton,
                  ...styles.cancelButton,
                  transform: hoveredCancel ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: hoveredCancel 
                    ? "0 8px 0 #999999, 0 10px 15px rgba(0,0,0,0.3)"
                    : "0 6px 0 #999999, 0 8px 10px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={() => setHoveredCancel(true)}
                onMouseLeave={() => setHoveredCancel(false)}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentCard;