import React, { useState, useEffect } from "react";
import { Patient } from "./types/patient";
import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import PatientView from "./components/PatientView";
import PrescriptionTemplateManager from "./components/PrescriptionTemplateManager";
import { getPatients, addPatient, updatePatient } from "./services/patientService";
import MaladieTable from "./components/MaladieTable";
import ProfessionTable from "./components/ProfessionTable";
import WilayaTable from "./components/WilayaTable";
import CommuneTable from "./components/CommuneTable";
import SimplePrescriptionEditor from './components/SimplePrescriptionEditor';

// Étendre le type ViewMode pour inclure toutes les vues
type ViewMode = "list" | "form" | "view" | "templates" | "maladies" | "professions" | "wilayas" | "communes" | "prescription-editor";

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();

  // Charger les patients depuis la base MySQL
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Erreur lors du chargement des patients:", error);
    }
  };

  const handleAddPatient = () => {
    setSelectedPatient(undefined);
    setCurrentView("form");
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView("form");
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView("view");
  };

  const handleSavePatient = async (patientData: Patient) => {
    try {
      if (selectedPatient) {
        await updatePatient(selectedPatient.id, patientData);
      } else {
        await addPatient(patientData);
      }
      await loadPatients();
      setCurrentView("list");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleBack = () => {
    setCurrentView("list");
  };

  const handleManageTemplates = () => {
    setCurrentView("templates");
  };

  const handleManageMaladies = () => {
    setCurrentView("maladies");
  };

  const handleManageProfessions = () => {
    setCurrentView("professions");
  };

  const handleManageWilayas = () => {
    setCurrentView("wilayas");
  };

  const handleManageCommunes = () => {
    setCurrentView("communes");
  };
const handleManagePrescriptionTemplates = () => {
  setCurrentView("prescription-editor");
};

  // Navigation principale
  // Dans App.tsx - Remplacer la fonction renderNavigation par :
const renderNavigation = () => (
  <nav style={{
    backgroundColor: '#2c3e50',
    padding: '15px 20px',
    color: 'white',
    marginBottom: '20px'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1400px',
      margin: '0 auto',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>🏥 Système Médical</h1>
      
      <div style={{ 
        display: 'flex', 
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {/* Patients */}
        <button
          onClick={() => setCurrentView("list")}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === "list" ? '#3498db' : '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          👥 Patients
        </button>

        {/* Maladies */}
        <button
          onClick={handleManageMaladies}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === "maladies" ? '#3498db' : '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🦠 Maladies
        </button>

        {/* Professions */}
        <button
          onClick={handleManageProfessions}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === "professions" ? '#3498db' : '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          💼 Professions
        </button>

        {/* Wilayas */}
        <button
          onClick={handleManageWilayas}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === "wilayas" ? '#3498db' : '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🗺️ Wilayas
        </button>

        {/* Communes */}
        <button
          onClick={handleManageCommunes}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === "communes" ? '#3498db' : '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🏘️ Communes
        </button>

        {/* Templates Ordonnance */}
        <button
          onClick={handleManagePrescriptionTemplates}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === "prescription-editor" ? '#3498db' : '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📝 Templates Ordonnance
        </button>

        {/* Templates Prescriptions (ancien) */}
        <button
          onClick={handleManageTemplates}
          style={{
            padding: '8px 16px',
            backgroundColor: currentView === "templates" ? '#3498db' : '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📋 Prescriptions
        </button>
      </div>
    </div>
  </nav>
);
  return (
    <div className="App" style={{ minHeight: '100vh', backgroundColor: '#ecf0f1' }}>
      {renderNavigation()}
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Vue Patients */}
        {currentView === "list" && (
          <PatientList
            patients={patients}
            onAddPatient={handleAddPatient}
            onEditPatient={handleEditPatient}
            onViewPatient={handleViewPatient}
            onManageTemplates={handleManageTemplates}
          />
        )}

        {/* Vue Maladies */}
        {currentView === "maladies" && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#2c3e50', margin: 0 }}>Gestion des Maladies</h2>
              <button
                onClick={handleBack}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#7f8c8d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ← Retour aux patients
              </button>
            </div>
            <MaladieTable />
          </div>
        )}

        {/* Vue Professions */}
        {currentView === "professions" && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#2c3e50', margin: 0 }}>Gestion des Professions</h2>
              <button
                onClick={handleBack}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#7f8c8d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ← Retour aux patients
              </button>
            </div>
            <ProfessionTable />
          </div>
        )}

        {/* Vue Wilayas */}
        {currentView === "wilayas" && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#2c3e50', margin: 0 }}>Gestion des Wilayas</h2>
              <button
                onClick={handleBack}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#7f8c8d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ← Retour aux patients
              </button>
            </div>
            <WilayaTable />
          </div>
        )}

        {/* Vue Communes */}
        {currentView === "communes" && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#2c3e50', margin: 0 }}>Gestion des Communes</h2>
              <button
                onClick={handleBack}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#7f8c8d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ← Retour aux patients
              </button>
            </div>
            <CommuneTable />
          </div>
        )}

        {/* Vue Formulaire Patient */}
        {currentView === "form" && (
          <PatientForm
            patient={selectedPatient}
            onSave={handleSavePatient}
            onCancel={handleBack}
          />
        )}

        {/* Vue Détails Patient */}
        {currentView === "view" && selectedPatient && (
          <PatientView
            patient={selectedPatient}
            onBack={handleBack}
            onEdit={() => setCurrentView("form")}
          />
        )}
// Ajouter dans la section des vues, après les autres vues :

{currentView === "prescription-editor" && (
  <div>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <h2 style={{ color: '#2c3e50', margin: 0 }}>Éditeur de Templates d'Ordonnance</h2>
      <button
        onClick={handleBack}
        style={{
          padding: '8px 16px',
          backgroundColor: '#7f8c8d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Retour aux patients
      </button>
    </div>
    <SimplePrescriptionEditor onClose={handleBack} />
  </div>
)}
        {/* Vue Templates */}
        {currentView === "templates" && (
          <PrescriptionTemplateManager onClose={handleBack} />
        )}
      </div>
    </div>
  );
}

export default App;