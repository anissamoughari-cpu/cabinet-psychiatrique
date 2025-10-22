import React, { useState } from 'react';
import { Search, Plus, CreditCard as Edit, Eye, Filter, Users, FileText } from 'lucide-react';
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
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.numeroDossierAuto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.numeroDossierManuel && patient.numeroDossierManuel.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGender = !filterGender || patient.genre === filterGender;
    const matchesWilaya = !filterWilaya || patient.wilaya === filterWilaya;
    
    return matchesSearch && matchesGender && matchesWilaya;
  });

  const uniqueWilayas = [...new Set(patients.map(p => p.wilaya).filter(Boolean))];

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

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              
              <div>
                <select
                  value={filterWilaya}
                  onChange={(e) => setFilterWilaya(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les wilayas</option>
                  {uniqueWilayas.map(wilaya => (
                    <option key={wilaya} value={wilaya}>{wilaya}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {patients.length === 0 ? 'Aucun patient enregistré' : 'Aucun patient trouvé'}
              </h3>
              <p className="text-gray-500 mb-6">
                {patients.length === 0 
                  ? 'Commencez par ajouter votre premier patient'
                  : 'Essayez de modifier vos critères de recherche'
                }
              </p>
              {patients.length === 0 && (
                <button
                  onClick={onAddPatient}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Ajouter un patient</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro Dossier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Âge
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Genre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wilaya
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.numeroDossierAuto} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {patient.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={patient.photo}
                              alt={`${patient.prenom} ${patient.nom}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {patient.prenom.charAt(0)}{patient.nom.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.prenom} {patient.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.profession || 'Profession non renseignée'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.numeroDossierAuto}</div>
                        {patient.numeroDossierManuel && (
                          <div className="text-sm text-gray-500">{patient.numeroDossierManuel}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.age} ans
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.genre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.telephone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.wilaya || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onViewPatient(patient)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                            title="Voir le dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditPatient(patient)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientList;