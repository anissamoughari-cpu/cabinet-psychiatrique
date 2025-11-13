import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Phone, Briefcase, FileText, Heart, Stethoscope, Brain, Pill } from 'lucide-react';
import { Patient } from '../types/patient';
import { wilayas, getCommunes } from '../data/wilayas';
import { symptoms } from '../data/symptoms';
import { treatments, maladiesPsychiatriques, finalDiagnoses } from '../data/treatments';
import { generatePatientId, calculateAge } from '../utils/patientUtils';

interface PatientFormProps {
  patient?: Patient;
  onSave: (patient: Patient) => void;
  onCancel: () => void;
}

export default function PatientForm({ patient, onSave, onCancel }: PatientFormProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<Patient>({
    id: '',
    autoNumber: '',
    manualNumber: '',
    lastName: '',
    firstName: '',
    birthDate: '',
    age: 0,
    birthPlace: '',
    gender: '',
    maritalStatus: '',
    numberOfChildren: 0,
    phone: '',
    address: '',
    wilaya: '',
    commune: '',
    profession: '',
    idCardNumber: '',
    idCardCommune: '',
    idCardWilaya: '',
    idCardDate: '',
    photo: '',
    antecedentText: '',
    antecedentSymptoms: [],
    physicalExamText: '',
    physicalExamSymptoms: [],
    mentalExamText: '',
    mentalExamSymptoms: [],
    treatmentText: '',
    selectedTreatments: [],
    selectedDisease: '',
    diagnosticText: '',
    diagnosticDiseases: [],
    finalDiagnosis: ''
  });

  const [communes, setCommunes] = useState<string[]>([]);

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    } else {
      const autoNumber = generatePatientId();
      setFormData(prev => ({ ...prev, autoNumber, id: autoNumber }));
    }
  }, [patient]);

  useEffect(() => {
    if (formData.wilaya) {
      setCommunes(getCommunes(formData.wilaya));
    }
  }, [formData.wilaya]);

  useEffect(() => {
    if (formData.birthDate) {
      const age = calculateAge(formData.birthDate);
      setFormData(prev => ({ ...prev, age }));
    }
  }, [formData.birthDate]);

  const handleInputChange = (field: keyof Patient, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSymptomToggle = (field: 'antecedentSymptoms' | 'physicalExamSymptoms' | 'mentalExamSymptoms', symptom: string) => {
    const currentSymptoms = formData[field] as string[];
    const updatedSymptoms = currentSymptoms.includes(symptom)
      ? currentSymptoms.filter(s => s !== symptom)
      : [...currentSymptoms, symptom];
    
    handleInputChange(field, updatedSymptoms);
  };

  const handleTreatmentToggle = (treatment: string) => {
    const updatedTreatments = formData.selectedTreatments.includes(treatment)
      ? formData.selectedTreatments.filter(t => t !== treatment)
      : [...formData.selectedTreatments, treatment];
    
    handleInputChange('selectedTreatments', updatedTreatments);
  };

  const addDiseaseToText = (disease: string) => {
    if (!formData.diagnosticDiseases.includes(disease)) {
      const updatedDiseases = [...formData.diagnosticDiseases, disease];
      const updatedText = formData.diagnosticText 
        ? `${formData.diagnosticText}\n- ${disease}`
        : `- ${disease}`;
      
      handleInputChange('diagnosticDiseases', updatedDiseases);
      handleInputChange('diagnosticText', updatedText);
    }
  };

  const removeDiseaseFromText = (disease: string) => {
    const updatedDiseases = formData.diagnosticDiseases.filter(d => d !== disease);
    const updatedText = formData.diagnosticText
      .split('\n')
      .filter(line => !line.includes(disease))
      .join('\n')
      .trim();
    
    handleInputChange('diagnosticDiseases', updatedDiseases);
    handleInputChange('diagnosticText', updatedText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('photo', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Informations Personnelles', icon: User },
    { id: 'antecedent', label: 'Antécédents et Examens', icon: Stethoscope },
    { id: 'treatment', label: 'Traitement', icon: Pill }
  ];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-8">
            {/* Identifiant Unique */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Identifiant Unique du Dossier
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro du dossier (Auto)
                  </label>
                  <input
                    type="text"
                    value={formData.autoNumber}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro du dossier (Manuel)
                  </label>
                  <input
                    type="text"
                    value={formData.manualNumber}
                    onChange={(e) => handleInputChange('manualNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Référence interne personnalisée"
                  />
                </div>
              </div>
            </div>

            {/* Identité Civile */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Identité Civile Principale
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de Naissance
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Âge
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commune de Naissance
                  </label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Femme">Femme</option>
                    <option value="Homme">Homme</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Situation Familiale */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Situation Familiale et Démographie
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Situation Familiale
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Célibataire">Célibataire</option>
                    <option value="Marié(e)">Marié(e)</option>
                    <option value="Divorcé(e)">Divorcé(e)</option>
                    <option value="Veuf/Veuve">Veuf/Veuve</option>
                  </select>
                </div>
                {formData.maritalStatus && formData.maritalStatus !== 'Célibataire' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre d'enfants
                    </label>
                    <input
                      type="number"
                      value={formData.numberOfChildren}
                      onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Coordonnées */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Coordonnées et Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Numéro de Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0X XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wilaya
                  </label>
                  <select
                    value={formData.wilaya}
                    onChange={(e) => handleInputChange('wilaya', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Sélectionner une wilaya</option>
                    {wilayas.map((wilaya) => (
                      <option key={wilaya.nom} value={wilaya.nom}>
                        {wilaya.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commune
                  </label>
                  <select
                    value={formData.commune}
                    onChange={(e) => handleInputChange('commune', e.target.value)}
                    disabled={!formData.wilaya}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                  >
                    <option value="">Sélectionner une commune</option>
                    {[...new Set(communes)].map((commune) => (
  <option key={commune} value={commune}>
    {commune}
  </option>
))}

                  </select>
                </div>
              </div>
            </div>

            {/* Informations Professionnelles */}
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Informations Professionnelles et Administratives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => handleInputChange('profession', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro Carte d'Identité
                  </label>
                  <input
                    type="text"
                    value={formData.idCardNumber}
                    onChange={(e) => handleInputChange('idCardNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commune de délivrance
                  </label>
                  <input
                    type="text"
                    value={formData.idCardCommune}
                    onChange={(e) => handleInputChange('idCardCommune', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wilaya de délivrance
                  </label>
                  <select
                    value={formData.idCardWilaya}
                    onChange={(e) => handleInputChange('idCardWilaya', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner une wilaya</option>
                    {wilayas.map((wilaya) => (
                      <option key={wilaya.nom} value={wilaya.nom}>
                        {wilaya.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de délivrance
                  </label>
                  <input
                    type="date"
                    value={formData.idCardDate}
                    onChange={(e) => handleInputChange('idCardDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handlePhotoUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formData.photo && (
                    <img
                      src={formData.photo}
                      alt="Patient"
                      className="mt-2 w-20 h-20 object-cover rounded-md border"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Antecedent Tab */}
        {activeTab === 'antecedent' && (
          <div className="space-y-8">
            {/* Antécédents */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Antécédents
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Antécédent
                  </label>
                  <textarea
                    value={formData.antecedentText}
                    onChange={(e) => handleInputChange('antecedentText', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Description détaillée des antécédents..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner des antécédents prédéfinis
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {symptoms.antecedents.map((symptom) => (
                        <label key={symptom} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.antecedentSymptoms.includes(symptom)}
                            onChange={() => handleSymptomToggle('antecedentSymptoms', symptom)}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span>{symptom}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.antecedentSymptoms.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.antecedentSymptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {symptom}
                          <button
                            type="button"
                            onClick={() => handleSymptomToggle('antecedentSymptoms', symptom)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Examen Physique */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2" />
                Examen Physique
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Examen physique
                  </label>
                  <textarea
                    value={formData.physicalExamText}
                    onChange={(e) => handleInputChange('physicalExamText', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Résultats de l'examen physique..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner des signes physiques
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {symptoms.physical.map((symptom) => (
                        <label key={symptom} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.physicalExamSymptoms.includes(symptom)}
                            onChange={() => handleSymptomToggle('physicalExamSymptoms', symptom)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span>{symptom}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.physicalExamSymptoms.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.physicalExamSymptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {symptom}
                          <button
                            type="button"
                            onClick={() => handleSymptomToggle('physicalExamSymptoms', symptom)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Examen Mental */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Examen Mental
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Examen mental
                  </label>
                  <textarea
                    value={formData.mentalExamText}
                    onChange={(e) => handleInputChange('mentalExamText', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Résultats de l'examen mental..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner des symptômes psychiatriques
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {symptoms.mental.map((symptom) => (
                        <label key={symptom} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.mentalExamSymptoms.includes(symptom)}
                            onChange={() => handleSymptomToggle('mentalExamSymptoms', symptom)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span>{symptom}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.mentalExamSymptoms.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.mentalExamSymptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {symptom}
                          <button
                            type="button"
                            onClick={() => handleSymptomToggle('mentalExamSymptoms', symptom)}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Treatment Tab */}
        {activeTab === 'treatment' && (
          <div className="space-y-8">
            {/* Traitement */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <Pill className="w-5 h-5 mr-2" />
                Traitement
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Traitement
                  </label>
                  <textarea
                    value={formData.treatmentText}
                    onChange={(e) => handleInputChange('treatmentText', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description détaillée du traitement..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner des traitements prédéfinis
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {treatments.map((treatment) => (
                        <label key={treatment} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.selectedTreatments.includes(treatment)}
                            onChange={() => handleTreatmentToggle(treatment)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{treatment}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.selectedTreatments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.selectedTreatments.map((treatment) => (
                        <span
                          key={treatment}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {treatment}
                          <button
                            type="button"
                            onClick={() => handleTreatmentToggle(treatment)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Maladie */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Maladie
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maladie
                </label>
                <select
                  value={formData.selectedDisease}
                  onChange={(e) => handleInputChange('selectedDisease', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Sélectionner une maladie</option>
                  {maladiesPsychiatriques.map((disease) => (
                    <option key={disease} value={disease}>
                      {disease}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Diagnostic */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Diagnostic
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnostic
                  </label>
                  <textarea
                    value={formData.diagnosticText}
                    onChange={(e) => handleInputChange('diagnosticText', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Diagnostic détaillé..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajouter des maladies au diagnostic
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addDiseaseToText(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Sélectionner une maladie à ajouter</option>
                    {maladiesPsychiatriques.map((disease) => (
                      <option key={disease} value={disease}>
                        {disease}
                      </option>
                    ))}
                  </select>
                  {formData.diagnosticDiseases.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.diagnosticDiseases.map((disease) => (
                        <span
                          key={disease}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {disease}
                          <button
                            type="button"
                            onClick={() => removeDiseaseFromText(disease)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnostic Final */}
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Diagnostic Final
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnostic final
                </label>
                <select
                  value={formData.finalDiagnosis}
                  onChange={(e) => handleInputChange('finalDiagnosis', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Sélectionner le diagnostic final</option>
                  {finalDiagnoses.map((diagnosis) => (
                    <option key={diagnosis} value={diagnosis}>
                      {diagnosis}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}