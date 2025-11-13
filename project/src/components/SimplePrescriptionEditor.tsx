// src/components/SimplePrescriptionEditor.tsx
import React, { useState } from 'react';
import { PrescriptionTemplate, PrescriptionField } from '../types/prescription';
import { prescriptionTemplateService } from '../services/prescriptionTemplateService';

interface SimplePrescriptionEditorProps {
  onClose: () => void;
}

const SimplePrescriptionEditor: React.FC<SimplePrescriptionEditorProps> = ({ onClose }) => {
  // Template par défaut
  const [template, setTemplate] = useState<PrescriptionTemplate>({
    id: 'template-' + Date.now(),
    name: 'Nouveau Template',
    doctorName: '',
    doctorAddress: '',
    doctorPhone: '',
    doctorSpecialty: '',
    fields: [],
    createdAt: new Date().toISOString()
  });

  // Champs disponibles à ajouter
  const availableFields: PrescriptionField[] = [
    { id: 'patient-name', label: 'Nom du patient', type: 'text', required: true },
    { id: 'patient-age', label: 'Âge', type: 'text', required: false },
    { id: 'consultation-date', label: 'Date de consultation', type: 'date', required: true },
    { id: 'diagnosis', label: 'Diagnostic', type: 'textarea', required: false },
    { id: 'medications', label: 'Médicaments prescrits', type: 'medication', required: true },
    { id: 'instructions', label: 'Instructions', type: 'textarea', required: false },
    { id: 'next-appointment', label: 'Prochain rendez-vous', type: 'date', required: false }
  ];

  // Ajouter un champ au template
  const addField = (field: PrescriptionField) => {
    const newField: PrescriptionField = {
      ...field,
      id: field.id + '-' + Date.now() // ID unique
    };
    
    setTemplate({
      ...template,
      fields: [...template.fields, newField]
    });
  };

  // Supprimer un champ
  const removeField = (fieldId: string) => {
    setTemplate({
      ...template,
      fields: template.fields.filter(field => field.id !== fieldId)
    });
  };

  // Changer l'ordre des champs
  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const fields = [...template.fields];
    const index = fields.findIndex(f => f.id === fieldId);
    
    if (direction === 'up' && index > 0) {
      [fields[index], fields[index - 1]] = [fields[index - 1], fields[index]];
    } else if (direction === 'down' && index < fields.length - 1) {
      [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
    }
    
    setTemplate({ ...template, fields });
  };

  // Gérer l'upload du logo
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTemplate({ ...template, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Sauvegarder le template
  const handleSave = () => {
    prescriptionTemplateService.saveTemplate(template);
    alert('Template sauvegardé avec succès !');
    onClose();
  };

  return (
    // En haut du composant SimplePrescriptionEditor, modifiez le style du conteneur principal :
<div style={{ 
  padding: '20px', 
  backgroundColor: 'white',
  borderRadius: '8px',
  maxWidth: '1400px',
  margin: '0 auto',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}}>
  
      <h2>📝 Éditeur de Template d'Ordonnance</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        {/* Colonne de gauche - Paramètres du médecin */}
        <div style={{ flex: 1 }}>
          <h3>👨‍⚕️ Informations du médecin</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Nom du template:</label>
            <input
              type="text"
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Nom du médecin:</label>
            <input
              type="text"
              value={template.doctorName}
              onChange={(e) => setTemplate({ ...template, doctorName: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="Dr. Dupont"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Spécialité:</label>
            <input
              type="text"
              value={template.doctorSpecialty}
              onChange={(e) => setTemplate({ ...template, doctorSpecialty: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="Médecin Généraliste"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Adresse:</label>
            <textarea
              value={template.doctorAddress}
              onChange={(e) => setTemplate({ ...template, doctorAddress: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '60px' }}
              placeholder="123 Rue de la Santé, 75000 Paris"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Téléphone:</label>
            <input
              type="text"
              value={template.doctorPhone}
              onChange={(e) => setTemplate({ ...template, doctorPhone: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="01 23 45 67 89"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Logo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ width: '100%', marginTop: '5px' }}
            />
            {template.logo && (
              <img 
                src={template.logo} 
                alt="Logo" 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  objectFit: 'contain',
                  marginTop: '10px',
                  border: '1px solid #ddd'
                }}
              />
            )}
          </div>
        </div>

        {/* Colonne de droite - Champs de l'ordonnance */}
        <div style={{ flex: 1 }}>
          <h3>📋 Champs de l'ordonnance</h3>
          
          {/* Champs disponibles */}
          <div style={{ marginBottom: '20px' }}>
            <h4>Champs disponibles:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availableFields.map(field => (
                <button
                  key={field.id}
                  onClick={() => addField(field)}
                  style={{
                    padding: '10px',
                    border: '1px solid #007bff',
                    backgroundColor: '#f8f9fa',
                    color: '#007bff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  + {field.label} ({field.type})
                </button>
              ))}
            </div>
          </div>

          {/* Champs ajoutés */}
          <div>
            <h4>Champs dans l'ordonnance:</h4>
            {template.fields.length === 0 ? (
              <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                Aucun champ ajouté. Cliquez sur les boutons ci-dessus pour ajouter des champs.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {template.fields.map((field, index) => (
                  <div
                    key={field.id}
                    style={{
                      padding: '12px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong>{field.label}</strong>
                      <br />
                      <small style={{ color: '#6c757d' }}>
                        Type: {field.type} • {field.required ? 'Obligatoire' : 'Optionnel'}
                      </small>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => moveField(field.id, 'up')}
                        disabled={index === 0}
                        style={{ 
                          padding: '5px',
                          backgroundColor: index === 0 ? '#ccc' : '#6c757d',
                          color: 'white',
                          border: 'none',
                          cursor: index === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === template.fields.length - 1}
                        style={{ 
                          padding: '5px',
                          backgroundColor: index === template.fields.length - 1 ? '#ccc' : '#6c757d',
                          color: 'white',
                          border: 'none',
                          cursor: index === template.fields.length - 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeField(field.id)}
                        style={{ 
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Aperçu */}
      <div style={{ 
        border: '2px dashed #dee2e6',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>👁️ Aperçu du template</h3>
        
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #ddd',
          minHeight: '400px'
        }}>
          {/* En-tête */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '30px',
            borderBottom: '2px solid #000',
            paddingBottom: '20px'
          }}>
            {template.logo && (
              <img 
                src={template.logo} 
                alt="Logo" 
                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
              />
            )}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h2 style={{ margin: 0 }}>{template.doctorName || 'Dr. Nom'}</h2>
              <p style={{ margin: '5px 0' }}>{template.doctorSpecialty || 'Spécialité'}</p>
              <p style={{ margin: '5px 0' }}>{template.doctorAddress || 'Adresse'}</p>
              <p style={{ margin: '5px 0' }}>Tel: {template.doctorPhone || 'Téléphone'}</p>
            </div>
            <div style={{ width: '80px' }}></div>
          </div>

          {/* Champs */}
          <div>
            <h3>Ordonnance Médicale</h3>
            {template.fields.map(field => (
              <div key={field.id} style={{ marginBottom: '15px' }}>
                <strong>{field.label}:</strong>
                {field.required && <span style={{ color: 'red' }}> *</span>}
                <div style={{ 
                  height: '24px', 
                  borderBottom: '1px solid #999',
                  marginTop: '5px'
                }}></div>
              </div>
            ))}
          </div>

          {/* Signature */}
          <div style={{ marginTop: '50px' }}>
            <p>Signature et cachet:</p>
            <div style={{ 
              height: '50px', 
              borderBottom: '1px solid #000', 
              width: '200px' 
            }}></div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          💾 Sauvegarder le Template
        </button>
      </div>
    </div>
  );
};

export default SimplePrescriptionEditor;