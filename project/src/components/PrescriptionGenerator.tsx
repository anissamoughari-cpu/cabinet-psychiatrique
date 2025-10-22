import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Save, X, Plus, Trash2, CreditCard as Edit } from 'lucide-react';
import { Patient } from '../types/patient';
import { PrescriptionTemplate, Prescription, PrescriptionTreatment, Doctor } from '../types/prescription';

interface PrescriptionGeneratorProps {
  patient: Patient;
  doctor: Doctor;
  onClose: () => void;
}

const PrescriptionGenerator: React.FC<PrescriptionGeneratorProps> = ({ patient, doctor, onClose }) => {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PrescriptionTemplate | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [treatments, setTreatments] = useState<PrescriptionTreatment[]>([]);

  useEffect(() => {
    loadTemplates();
    initializeTreatments();
  }, []);

  const loadTemplates = () => {
    const savedTemplates = localStorage.getItem(`prescription-templates-${doctor.id}`);
    if (savedTemplates) {
      const templateList = JSON.parse(savedTemplates);
      setTemplates(templateList);
      
      // Sélectionner le modèle par défaut
      const defaultTemplate = templateList.find((t: PrescriptionTemplate) => t.isDefault);
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate);
      }
    }
  };

  const initializeTreatments = () => {
    // Convertir les traitements du patient en traitements d'ordonnance
    if (patient.selectedTreatments && patient.selectedTreatments.length > 0) {
      const prescriptionTreatments: PrescriptionTreatment[] = patient.selectedTreatments.map((treatment, index) => ({
        id: `treatment-${index}`,
        medication: treatment,
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      }));
      setTreatments(prescriptionTreatments);
    }
  };

  const generatePrescriptionId = () => {
    return `prescription-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addTreatment = () => {
    const newTreatment: PrescriptionTreatment = {
      id: `treatment-${Date.now()}`,
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setTreatments([...treatments, newTreatment]);
  };

  const updateTreatment = (id: string, field: keyof PrescriptionTreatment, value: string) => {
    setTreatments(treatments.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const removeTreatment = (id: string) => {
    setTreatments(treatments.filter(t => t.id !== id));
  };

  const generatePrescription = () => {
    if (!selectedTemplate) {
      alert('Veuillez sélectionner un modèle d\'ordonnance');
      return;
    }

    const newPrescription: Prescription = {
      id: generatePrescriptionId(),
      patientId: patient.numeroDossierAuto,
      templateId: selectedTemplate.id,
      doctorId: doctor.id,
      patientInfo: {
        name: patient.nom,
        firstName: patient.prenom,
        age: patient.age || 0,
        gender: patient.genre
      },
      diagnosis: patient.diagnosticText || '',
      antecedents: patient.antecedentText || '',
      treatments: treatments,
      recommendations: '',
      additionalNotes: '',
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    setPrescription(newPrescription);
    setIsPreview(true);
  };

  const savePrescription = () => {
    if (!prescription) return;

    const savedPrescriptions = localStorage.getItem('prescriptions') || '[]';
    const prescriptions = JSON.parse(savedPrescriptions);
    
    const updatedPrescription = {
      ...prescription,
      status: 'finalized' as const,
      updatedAt: new Date().toISOString()
    };

    prescriptions.push(updatedPrescription);
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
    
    alert('Ordonnance sauvegardée avec succès');
  };

  const exportToPDF = () => {
    if (!prescription || !selectedTemplate) return;

    // Créer le contenu HTML pour l'impression
    const printContent = generatePrintableHTML(prescription, selectedTemplate);
    
    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const generatePrintableHTML = (prescription: Prescription, template: PrescriptionTemplate) => {
    const replaceVariables = (text: string) => {
      return text
        .replace(/{doctorName}/g, template.header.doctorName)
        .replace(/{patientName}/g, `${prescription.patientInfo.firstName} ${prescription.patientInfo.name}`)
        .replace(/{patientAge}/g, prescription.patientInfo.age.toString())
        .replace(/{patientGender}/g, prescription.patientInfo.gender);
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Ordonnance - ${prescription.patientInfo.firstName} ${prescription.patientInfo.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .header-content { display: flex; justify-content: space-between; align-items: start; }
          .logo { max-width: 80px; max-height: 80px; }
          .doctor-info h2 { margin: 0; font-size: 24px; }
          .doctor-info p { margin: 5px 0; color: #666; }
          .date-info { text-align: right; color: #666; }
          .patient-info { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .section { margin: 20px 0; }
          .section h4 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .treatment-item { margin: 10px 0; padding: 10px; border-left: 3px solid #007bff; background: #f8f9fa; }
          .footer { border-top: 1px solid #ddd; padding-top: 20px; margin-top: 40px; }
          .signature { text-align: right; margin-top: 40px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-content">
            <div class="doctor-info">
              ${template.header.logo ? `<img src="${template.header.logo}" alt="Logo" class="logo">` : ''}
              <h2>${template.header.doctorName}</h2>
              <p><strong>${template.header.specialty}</strong></p>
              <p>${template.header.address}</p>
              <p>Tél: ${template.header.phone}</p>
              ${template.header.email ? `<p>Email: ${template.header.email}</p>` : ''}
            </div>
            <div class="date-info">
              <p>N° d'ordre: ${template.header.registrationNumber}</p>
              <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>

        <div class="patient-info">
          <h3>Patient: ${prescription.patientInfo.firstName} ${prescription.patientInfo.name}</h3>
          <p>Âge: ${prescription.patientInfo.age} ans | Sexe: ${prescription.patientInfo.gender}</p>
        </div>

        <p>${replaceVariables(template.body.introduction)}</p>

        ${template.sections.showDiagnosis && prescription.diagnosis ? `
          <div class="section">
            <h4>Diagnostic:</h4>
            <p>${prescription.diagnosis}</p>
          </div>
        ` : ''}

        ${template.sections.showAntecedents && prescription.antecedents ? `
          <div class="section">
            <h4>Antécédents:</h4>
            <p>${prescription.antecedents}</p>
          </div>
        ` : ''}

        ${template.sections.showTreatment && prescription.treatments.length > 0 ? `
          <div class="section">
            <h4>Traitement prescrit:</h4>
            ${prescription.treatments.map(treatment => `
              <div class="treatment-item">
                <strong>${treatment.medication}</strong><br>
                ${treatment.dosage ? `Dosage: ${treatment.dosage}<br>` : ''}
                ${treatment.frequency ? `Fréquence: ${treatment.frequency}<br>` : ''}
                ${treatment.duration ? `Durée: ${treatment.duration}<br>` : ''}
                ${treatment.instructions ? `Instructions: ${treatment.instructions}` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${template.sections.showRecommendations && prescription.recommendations ? `
          <div class="section">
            <h4>Recommandations:</h4>
            <p>${prescription.recommendations}</p>
          </div>
        ` : ''}

        ${prescription.additionalNotes ? `
          <div class="section">
            <h4>Notes supplémentaires:</h4>
            <p>${prescription.additionalNotes}</p>
          </div>
        ` : ''}

        <div class="section">
          <p>${template.body.instructions}</p>
        </div>

        <div class="footer">
          <p><em>${template.body.legalMentions}</em></p>
          ${template.footer.additionalInfo ? `<p>${template.footer.additionalInfo}</p>` : ''}
          <div class="signature">
            <p><strong>${template.footer.signature}</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  if (isPreview && prescription && selectedTemplate) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Aperçu de l'Ordonnance</h2>
              <div className="flex space-x-2">
                <button
                  onClick={savePrescription}
                  className="flex items-center space-x-2 bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-50"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
                <button
                  onClick={exportToPDF}
                  className="flex items-center space-x-2 bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Imprimer</span>
                </button>
                <button
                  onClick={() => setIsPreview(false)}
                  className="text-white hover:text-green-200 p-2 rounded-md hover:bg-green-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div dangerouslySetInnerHTML={{ 
              __html: generatePrintableHTML(prescription, selectedTemplate).replace(/<\/?html>|<\/?head>|<\/?body>|<title>.*?<\/title>|<meta.*?>|<!DOCTYPE html>/g, '')
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Générer une Ordonnance - {patient.prenom} {patient.nom}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 p-2 rounded-md hover:bg-blue-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            {/* Sélection du modèle */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Modèle d'ordonnance</h3>
              <select
                value={selectedTemplate?.id || ''}
                onChange={(e) => {
                  const template = templates.find(t => t.id === e.target.value);
                  setSelectedTemplate(template || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un modèle</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.isDefault ? '(Par défaut)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Informations patient */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Informations Patient</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Nom:</strong> {patient.nom}</p>
                  <p><strong>Prénom:</strong> {patient.prenom}</p>
                </div>
                <div>
                  <p><strong>Âge:</strong> {patient.age} ans</p>
                  <p><strong>Genre:</strong> {patient.genre}</p>
                </div>
              </div>
            </div>

            {/* Diagnostic */}
            {selectedTemplate?.sections.showDiagnosis && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Diagnostic</h3>
                <textarea
                  value={patient.diagnosticText || ''}
                  readOnly
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
            )}

            {/* Antécédents */}
            {selectedTemplate?.sections.showAntecedents && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Antécédents</h3>
                <textarea
                  value={patient.antecedentText || ''}
                  readOnly
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
            )}

            {/* Traitements */}
            {selectedTemplate?.sections.showTreatment && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Traitements</h3>
                  <button
                    onClick={addTreatment}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {treatments.map((treatment) => (
                    <div key={treatment.id} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Traitement</h4>
                        <button
                          onClick={() => removeTreatment(treatment.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Médicament
                          </label>
                          <input
                            type="text"
                            value={treatment.medication}
                            onChange={(e) => updateTreatment(treatment.id, 'medication', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={treatment.dosage}
                            onChange={(e) => updateTreatment(treatment.id, 'dosage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            placeholder="ex: 10mg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fréquence
                          </label>
                          <input
                            type="text"
                            value={treatment.frequency}
                            onChange={(e) => updateTreatment(treatment.id, 'frequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            placeholder="ex: 2 fois par jour"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Durée
                          </label>
                          <input
                            type="text"
                            value={treatment.duration}
                            onChange={(e) => updateTreatment(treatment.id, 'duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            placeholder="ex: 30 jours"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instructions particulières
                          </label>
                          <textarea
                            value={treatment.instructions}
                            onChange={(e) => updateTreatment(treatment.id, 'instructions', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                            placeholder="ex: À prendre avec les repas"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommandations */}
            {selectedTemplate?.sections.showRecommendations && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Recommandations</h3>
                <textarea
                  value={prescription?.recommendations || ''}
                  onChange={(e) => setPrescription(prev => prev ? {...prev, recommendations: e.target.value} : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  placeholder="Recommandations médicales..."
                />
              </div>
            )}

            {/* Notes supplémentaires */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Notes supplémentaires</h3>
              <textarea
                value={prescription?.additionalNotes || ''}
                onChange={(e) => setPrescription(prev => prev ? {...prev, additionalNotes: e.target.value} : null)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                placeholder="Notes libres..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={generatePrescription}
                disabled={!selectedTemplate}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                <span>Prévisualiser</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionGenerator;