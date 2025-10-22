import React, { useState, useEffect } from 'react';
import { FileText, Eye, Download, Calendar, User, X } from 'lucide-react';
import { Prescription, PrescriptionTemplate } from '../types/prescription';

interface PrescriptionHistoryProps {
  patientId?: string;
  doctorId?: string;
  onClose: () => void;
}

const PrescriptionHistory: React.FC<PrescriptionHistoryProps> = ({ patientId, doctorId, onClose }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    loadPrescriptions();
    loadTemplates();
  }, []);

  const loadPrescriptions = () => {
    const savedPrescriptions = localStorage.getItem('prescriptions');
    if (savedPrescriptions) {
      let allPrescriptions = JSON.parse(savedPrescriptions);
      
      // Filtrer par patient ou médecin si spécifié
      if (patientId) {
        allPrescriptions = allPrescriptions.filter((p: Prescription) => p.patientId === patientId);
      }
      if (doctorId) {
        allPrescriptions = allPrescriptions.filter((p: Prescription) => p.doctorId === doctorId);
      }
      
      // Trier par date de création (plus récent en premier)
      allPrescriptions.sort((a: Prescription, b: Prescription) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPrescriptions(allPrescriptions);
    }
  };

  const loadTemplates = () => {
    if (doctorId) {
      const savedTemplates = localStorage.getItem(`prescription-templates-${doctorId}`);
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      }
    }
  };

  const getTemplate = (templateId: string) => {
    return templates.find(t => t.id === templateId);
  };

  const exportToPDF = (prescription: Prescription) => {
    const template = getTemplate(prescription.templateId);
    if (!template) return;

    const printContent = generatePrintableHTML(prescription, template);
    
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
              <p>Date: ${new Date(prescription.createdAt).toLocaleDateString('fr-FR')}</p>
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Brouillon' },
      finalized: { color: 'bg-green-100 text-green-800', label: 'Finalisée' },
      printed: { color: 'bg-blue-100 text-blue-800', label: 'Imprimée' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (isPreview && selectedPrescription) {
    const template = getTemplate(selectedPrescription.templateId);
    if (!template) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Aperçu de l'Ordonnance</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportToPDF(selectedPrescription)}
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
              __html: generatePrintableHTML(selectedPrescription, template).replace(/<\/?html>|<\/?head>|<\/?body>|<title>.*?<\/title>|<meta.*?>|<!DOCTYPE html>/g, '')
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Historique des Ordonnances
              {patientId && ' - Patient'}
              {doctorId && ' - Médecin'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 p-2 rounded-md hover:bg-purple-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune ordonnance trouvée
              </h3>
              <p className="text-gray-500">
                Aucune ordonnance n'a encore été créée.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => {
                const template = getTemplate(prescription.templateId);
                return (
                  <div
                    key={prescription.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {prescription.patientInfo.firstName} {prescription.patientInfo.name}
                          </h3>
                          {getStatusBadge(prescription.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(prescription.createdAt).toLocaleDateString('fr-FR')} à{' '}
                              {new Date(prescription.createdAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>
                              {prescription.patientInfo.age} ans - {prescription.patientInfo.gender}
                            </span>
                          </div>
                        </div>

                        {template && (
                          <p className="text-sm text-gray-500 mb-2">
                            Modèle: {template.name}
                          </p>
                        )}

                        {prescription.treatments.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Traitements prescrits:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {prescription.treatments.slice(0, 3).map((treatment, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {treatment.medication}
                                </span>
                              ))}
                              {prescription.treatments.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  +{prescription.treatments.length - 3} autres
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {prescription.diagnosis && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            <strong>Diagnostic:</strong> {prescription.diagnosis}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedPrescription(prescription);
                            setIsPreview(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                          title="Voir l'ordonnance"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => exportToPDF(prescription)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                          title="Imprimer l'ordonnance"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHistory;