// Au début du return de PatientList
import React, { useState } from 'react';
import { Search, Plus, CreditCard as Edit, Eye, Users, FileText } from 'lucide-react';
import { Patient } from '../types/patient';

interface PatientListProps {
  patients: Patient[];
  onAddPatient: () => void;
  onEditPatient: (patient: Patient) => void;
  onViewPatient: (patient: Patient) => void;
  onManageTemplates: () => void;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  onAddPatient,
  onEditPatient,
  onViewPatient,
  onManageTemplates
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterWilaya, setFilterWilaya] = useState('');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      (patient.nom?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (patient.prenom?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (patient.numeroDossierAuto?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
      (patient.numeroDossierManuel?.toLowerCase() ?? '').includes(searchTerm.toLowerCase());

    const matchesGender = !filterGender || patient.genre === filterGender;
    const matchesWilaya = !filterWilaya || patient.wilaya === filterWilaya;

    return matchesSearch && matchesGender && matchesWilaya;
  });

  // 🔥 Correction : éviter les doublons de wilaya
  const uniqueWilayas = [...new Set(patients.map(p => p.wilaya ?? '').filter(w => w !== ''))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Gestion des Patients</h1>
                  <p className="text-blue-100">{patients.length} patient(s) enregistré(s)</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onAddPatient}
                  className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nouveau Patient</span>
                </button>

                <button
                  onClick={onManageTemplates}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Modèles d'Ordonnances</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, prénom ou numéro de dossier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les genres</option>
                  <option value="Femme">Femme</option>
                  <option value="Homme">Homme</option>
                  <option value="Autre/Non spécifié">Autre/Non spécifié</option>
                </select>
              </div>

              {/* Wilaya Filter */}
              <div>
                <select
                  value={filterWilaya}
                  onChange={(e) => setFilterWilaya(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les wilayas</option>

                  {/* Correction : wilayas uniques + key sûre */}
                  {uniqueWilayas.map((wilaya, index) => (
                    <option key={`${wilaya}-${index}`} value={wilaya}>
                      {wilaya}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun patient trouvé.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Patient", "Numéro Dossier", "Âge", "Genre", "Téléphone", "Wilaya", "Actions"].map(header => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient, index) => (
                  <tr key={patient.id ?? `patient-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{patient.prenom} {patient.nom}</td>
                    <td className="px-6 py-4">{patient.numeroDossierAuto ?? '-'}</td>
                    <td className="px-6 py-4">{patient.age ?? '-'}</td>
                    <td className="px-6 py-4">{patient.genre ?? '-'}</td>
                    <td className="px-6 py-4">{patient.telephone ?? '-'}</td>
                    <td className="px-6 py-4">{patient.wilaya ?? '-'}</td>

                    <td className="px-6 py-4 text-right flex space-x-2 justify-end">
                      <button onClick={() => onViewPatient(patient)} className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEditPatient(patient)} className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientList;
