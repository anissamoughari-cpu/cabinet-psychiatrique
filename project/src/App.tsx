import React, { useState, useEffect } from 'react';
import { Patient } from './types/patient';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import PatientView from './components/PatientView';
import PrescriptionTemplateManager from './components/PrescriptionTemplateManager';

// Mock doctor data - In a real app, this would come from authentication/context
const mockDoctor = {
  id: 'doctor-1',
  name: 'Benali',
  firstName: 'Ahmed',
  specialty: 'Psychiatre',
  address: '123 Rue de la Santé, Alger',
  phone: '021 XX XX XX',
  email: 'dr.benali@example.com',
  registrationNumber: '12345'
};

type ViewMode = 'list' | 'form' | 'view' | 'templates';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();

  // Load patients from localStorage on component mount
  useEffect(() => {
    const savedPatients = localStorage.getItem('psychiatric-patients');
    if (savedPatients) {
      try {
        setPatients(JSON.parse(savedPatients));
      } catch (error) {
        console.error('Error loading patients from localStorage:', error);
      }
    }
  }, []);

  // Save patients to localStorage whenever patients array changes
  useEffect(() => {
    localStorage.setItem('psychiatric-patients', JSON.stringify(patients));
  }, [patients]);

  const handleAddPatient = () => {
    setSelectedPatient(undefined);
    setCurrentView('form');
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('form');
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('view');
  };

  const handleSavePatient = (patientData: Patient) => {
    if (selectedPatient) {
      // Update existing patient
      setPatients(prev => 
        prev.map(p => 
          p.numeroDossierAuto === selectedPatient.numeroDossierAuto 
            ? patientData 
            : p
        )
      );
    } else {
      // Add new patient
      setPatients(prev => [...prev, patientData]);
    }
    setCurrentView('list');
    setSelectedPatient(undefined);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedPatient(undefined);
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedPatient(undefined);
  };

  const handleEditFromView = () => {
    setCurrentView('form');
  };

  const handleManageTemplates = () => {
    setCurrentView('templates');
  };

  return (
    <div className="App">
      {currentView === 'list' && (
        <PatientList
          patients={patients}
          onAddPatient={handleAddPatient}
          onEditPatient={handleEditPatient}
          onViewPatient={handleViewPatient}
          onManageTemplates={handleManageTemplates}
        />
      )}
      
      {currentView === 'form' && (
        <PatientForm
          patient={selectedPatient}
          onSave={handleSavePatient}
          onCancel={handleCancel}
        />
      )}
      
      {currentView === 'view' && selectedPatient && (
        <PatientView
          patient={selectedPatient}
          onBack={handleBack}
          onEdit={handleEditFromView}
        />
      )}
      
      {currentView === 'templates' && (
        <PrescriptionTemplateManager
          doctor={mockDoctor}
          onClose={handleBack}
        />
      )}
    </div>
  );
}

export default App;