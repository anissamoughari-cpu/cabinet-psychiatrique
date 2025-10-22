import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Copy, FileText, Save, X, Upload } from 'lucide-react';
import { PrescriptionTemplate, Doctor } from '../types/prescription';

interface PrescriptionTemplateManagerProps {
  doctor: Doctor;
  onClose: () => void;
}

const PrescriptionTemplateManager: React.FC<PrescriptionTemplateManagerProps> = ({ doctor, onClose }) => {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PrescriptionTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PrescriptionTemplate>>({});

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const savedTemplates = localStorage.getItem(`prescription-templates-${doctor.id}`);
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  };

  const saveTemplates = (updatedTemplates: PrescriptionTemplate[]) => {
    localStorage.setItem(`prescription-templates-${doctor.id}`, JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const generateTemplateId = () => {
    return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const createNewTemplate = () => {
    const newTemplate: PrescriptionTemplate = {
      id: generateTemplateId(),
      name: 'Nouveau modèle',
      doctorId: doctor.id,
      isDefault: templates.length === 0,
      header: {
        doctorName: `Dr ${doctor.firstName} ${doctor.name}`,
        specialty: doctor.specialty,
        address: doctor.address,
        phone: doctor.phone,
        email: doctor.email,
        registrationNumber: doctor.registrationNumber,
      },
      body: {
        introduction: 'Je soussigné(e), Dr {doctorName}, {specialty}, prescris à {patientName} :',
        instructions: 'Posologie et instructions à suivre scrupuleusement.',
        legalMentions: 'Ordonnance non renouvelable sauf mention contraire.',
      },
      footer: {
        signature: `Dr ${doctor.firstName} ${doctor.name}`,
        additionalInfo: 'Consultations sur rendez-vous',
      },
      sections: {
        showDiagnosis: true,
        showAntecedents: true,
        showTreatment: true,
        showRecommendations: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFormData(newTemplate);
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
  };

  const editTemplate = (template: PrescriptionTemplate) => {
    setFormData({ ...template });
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const duplicateTemplate = (template: PrescriptionTemplate) => {
    const duplicated: PrescriptionTemplate = {
      ...template,
      id: generateTemplateId(),
      name: `${template.name} (Copie)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTemplates = [...templates, duplicated];
    saveTemplates(updatedTemplates);
  };

  const deleteTemplate = (templateId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      saveTemplates(updatedTemplates);
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
        setIsEditing(false);
      }
    }
  };

  const setAsDefault = (templateId: string) => {
    const updatedTemplates = templates.map(t => ({
      ...t,
      isDefault: t.id === templateId
    }));
    saveTemplates(updatedTemplates);
  };

  const saveTemplate = () => {
    if (!formData.name?.trim()) {
      alert('Le nom du modèle est obligatoire');
      return;
    }

    const templateToSave: PrescriptionTemplate = {
      ...formData as PrescriptionTemplate,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = templates.findIndex(t => t.id === templateToSave.id);
    let updatedTemplates;

    if (existingIndex >= 0) {
      updatedTemplates = [...templates];
      updatedTemplates[existingIndex] = templateToSave;
    } else {
      updatedTemplates = [...templates, templateToSave];
    }

    saveTemplates(updatedTemplates);
    setIsEditing(false);
    setSelectedTemplate(templateToSave);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...(prev[keys[0] as keyof PrescriptionTemplate] as any),
            [keys[1]]: value
          }
        };
      }
      return prev;
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('header.logo', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gestion des Modèles d'Ordonnances</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 p-2 rounded-md hover:bg-blue-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Liste des modèles */}
          <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Mes Modèles</h3>
              <button
                onClick={createNewTemplate}
                className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau</span>
              </button>
            </div>

            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      {template.isDefault && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Par défaut
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editTemplate(template);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateTemplate(template);
                        }}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate(template.id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Éditeur/Aperçu */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Édition du Modèle</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={saveTemplate}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>

                {/* Informations générales */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Informations générales</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du modèle *
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.isDefault || false}
                          onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Modèle par défaut</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* En-tête */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">En-tête</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                      {formData.header?.logo && (
                        <img
                          src={formData.header.logo}
                          alt="Logo"
                          className="mt-2 w-20 h-20 object-contain border rounded"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du médecin
                      </label>
                      <input
                        type="text"
                        value={formData.header?.doctorName || ''}
                        onChange={(e) => handleInputChange('header.doctorName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Spécialité
                      </label>
                      <input
                        type="text"
                        value={formData.header?.specialty || ''}
                        onChange={(e) => handleInputChange('header.specialty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro d'ordre
                      </label>
                      <input
                        type="text"
                        value={formData.header?.registrationNumber || ''}
                        onChange={(e) => handleInputChange('header.registrationNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse
                      </label>
                      <textarea
                        value={formData.header?.address || ''}
                        onChange={(e) => handleInputChange('header.address', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        value={formData.header?.phone || ''}
                        onChange={(e) => handleInputChange('header.phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.header?.email || ''}
                        onChange={(e) => handleInputChange('header.email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Corps */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Corps de l'ordonnance</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Introduction
                      </label>
                      <textarea
                        value={formData.body?.introduction || ''}
                        onChange={(e) => handleInputChange('body.introduction', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Variables disponibles: {doctorName}, {patientName}, {patientAge}, {patientGender}"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructions générales
                      </label>
                      <textarea
                        value={formData.body?.instructions || ''}
                        onChange={(e) => handleInputChange('body.instructions', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mentions légales
                      </label>
                      <textarea
                        value={formData.body?.legalMentions || ''}
                        onChange={(e) => handleInputChange('body.legalMentions', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sections à afficher */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Sections à inclure</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.sections?.showDiagnosis || false}
                        onChange={(e) => handleInputChange('sections.showDiagnosis', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Diagnostic</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.sections?.showAntecedents || false}
                        onChange={(e) => handleInputChange('sections.showAntecedents', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Antécédents</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.sections?.showTreatment || false}
                        onChange={(e) => handleInputChange('sections.showTreatment', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Traitement</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.sections?.showRecommendations || false}
                        onChange={(e) => handleInputChange('sections.showRecommendations', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Recommandations</span>
                    </label>
                  </div>
                </div>

                {/* Pied de page */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Pied de page</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Signature
                      </label>
                      <input
                        type="text"
                        value={formData.footer?.signature || ''}
                        onChange={(e) => handleInputChange('footer.signature', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Informations supplémentaires
                      </label>
                      <textarea
                        value={formData.footer?.additionalInfo || ''}
                        onChange={(e) => handleInputChange('footer.additionalInfo', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedTemplate ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Aperçu du Modèle</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editTemplate(selectedTemplate)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modifier</span>
                    </button>
                    {!selectedTemplate.isDefault && (
                      <button
                        onClick={() => setAsDefault(selectedTemplate.id)}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Définir par défaut
                      </button>
                    )}
                  </div>
                </div>

                {/* Aperçu de l'ordonnance */}
                <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                  {/* En-tête */}
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        {selectedTemplate.header.logo && (
                          <img
                            src={selectedTemplate.header.logo}
                            alt="Logo"
                            className="w-16 h-16 object-contain mb-2"
                          />
                        )}
                        <h2 className="text-xl font-bold">{selectedTemplate.header.doctorName}</h2>
                        <p className="text-gray-600">{selectedTemplate.header.specialty}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {selectedTemplate.header.address}
                        </p>
                        <p className="text-sm text-gray-500">
                          Tél: {selectedTemplate.header.phone}
                        </p>
                        {selectedTemplate.header.email && (
                          <p className="text-sm text-gray-500">
                            Email: {selectedTemplate.header.email}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          N° d'ordre: {selectedTemplate.header.registrationNumber}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Date: {new Date().toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Corps */}
                  <div className="space-y-4">
                    <p className="text-gray-800">
                      {selectedTemplate.body.introduction}
                    </p>

                    {selectedTemplate.sections.showDiagnosis && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Diagnostic:</h4>
                        <p className="text-gray-600 italic">[Diagnostic du patient]</p>
                      </div>
                    )}

                    {selectedTemplate.sections.showAntecedents && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Antécédents:</h4>
                        <p className="text-gray-600 italic">[Antécédents du patient]</p>
                      </div>
                    )}

                    {selectedTemplate.sections.showTreatment && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Traitement:</h4>
                        <p className="text-gray-600 italic">[Traitements prescrits]</p>
                      </div>
                    )}

                    {selectedTemplate.sections.showRecommendations && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Recommandations:</h4>
                        <p className="text-gray-600 italic">[Recommandations médicales]</p>
                      </div>
                    )}

                    <div className="mt-6">
                      <p className="text-gray-800">{selectedTemplate.body.instructions}</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600">{selectedTemplate.body.legalMentions}</p>
                    </div>
                  </div>

                  {/* Pied de page */}
                  <div className="border-t border-gray-200 pt-4 mt-8">
                    <div className="flex justify-between items-end">
                      <div>
                        {selectedTemplate.footer.additionalInfo && (
                          <p className="text-sm text-gray-500">
                            {selectedTemplate.footer.additionalInfo}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{selectedTemplate.footer.signature}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez un modèle pour le visualiser ou créez-en un nouveau</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionTemplateManager;