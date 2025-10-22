import React from 'react';
import { ArrowLeft, User, Calendar, MapPin, Phone, Briefcase, FileText, Heart, CreditCard as Edit, Stethoscope, Brain, Pill, History } from 'lucide-react';
import { Patient } from '../types/patient';
import PrescriptionGenerator from './PrescriptionGenerator';
import PrescriptionHistory from './PrescriptionHistory';

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

interface PatientViewProps {
  patient: Patient;
  onBack: () => void;
  onEdit: () => void;
}

const PatientView: React.FC<PatientViewProps> = ({ patient, onBack, onEdit }) => {
  const [showPrescriptionGenerator, setShowPrescriptionGenerator] = React.useState(false);
  const [showPrescriptionHistory, setShowPrescriptionHistory] = React.useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="text-white hover:text-blue-200 p-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-4">
                  {patient.photo ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover border-4 border-white"
                      src={patient.photo}
                      alt={`${patient.prenom} ${patient.nom}`}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center border-4 border-white">
                      <span className="text-xl font-bold text-blue-600">
                        {patient.prenom.charAt(0)}{patient.nom.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {patient.prenom} {patient.nom}
                    </h1>
                    <p className="text-blue-100">
                      {patient.age} ans • {patient.genre} • {patient.numeroDossierAuto}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onEdit}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-5 h-5" />
                <span>Modifier</span>
              </button>
              <button
                onClick={() => setShowPrescriptionGenerator(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                <Pill className="w-5 h-5" />
                <span>Générer Ordonnance</span>
              </button>
              <button
                onClick={() => setShowPrescriptionHistory(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                <History className="w-5 h-5" />
                <span>Historique</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Identifiant Unique */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Identifiant du Dossier</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Numéro automatique</label>
                <p className="text-gray-900 font-mono">{patient.numeroDossierAuto}</p>
              </div>
              {patient.numeroDossierManuel && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Numéro manuel</label>
                  <p className="text-gray-900 font-mono">{patient.numeroDossierManuel}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Identité Civile */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Identité Civile</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nom</label>
                <p className="text-gray-900 font-medium">{patient.nom}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Prénom</label>
                <p className="text-gray-900 font-medium">{patient.prenom}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                <p className="text-gray-900">{new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Âge</label>
                <p className="text-gray-900">{patient.age} ans</p>
              </div>
              {patient.communeNaissance && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Commune de naissance</label>
                  <p className="text-gray-900">{patient.communeNaissance}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Genre</label>
                <p className="text-gray-900">{patient.genre}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Situation Familiale */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Situation Familiale</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Situation familiale</label>
                <p className="text-gray-900">{patient.situationFamiliale || 'Non renseignée'}</p>
              </div>
              {patient.situationFamiliale && patient.situationFamiliale !== 'Célibataire' && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre d'enfants</label>
                  <p className="text-gray-900">{patient.nombreEnfants || 0}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Coordonnées */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">Coordonnées</h3>
            </div>
            
            <div className="space-y-3">
              {patient.telephone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-gray-900 font-mono">{patient.telephone}</p>
                </div>
              )}
              {patient.adresse && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Adresse</label>
                  <p className="text-gray-900">{patient.adresse}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {patient.wilaya && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Wilaya</label>
                    <p className="text-gray-900">{patient.wilaya}</p>
                  </div>
                )}
                {patient.commune && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Commune</label>
                    <p className="text-gray-900">{patient.commune}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Informations Professionnelles */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">Informations Professionnelles et Administratives</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patient.profession && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Profession</label>
                  <p className="text-gray-900">{patient.profession}</p>
                </div>
              )}
              {patient.numeroCarteIdentite && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Numéro carte d'identité</label>
                  <p className="text-gray-900 font-mono">{patient.numeroCarteIdentite}</p>
                </div>
              )}
              {patient.communeDelivranceCarte && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Commune de délivrance</label>
                  <p className="text-gray-900">{patient.communeDelivranceCarte}</p>
                </div>
              )}
              {patient.wilayaDelivranceCarte && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Wilaya de délivrance</label>
                  <p className="text-gray-900">{patient.wilayaDelivranceCarte}</p>
                </div>
              )}
              {patient.dateDelivranceCarte && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de délivrance</label>
                  <p className="text-gray-900">{new Date(patient.dateDelivranceCarte).toLocaleDateString('fr-FR')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Future Sections */}
        <div className="bg-white rounded-lg shadow-lg mt-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                Informations Personnelles
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Antécédents et Examen
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Traitement
              </button>
            </nav>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">
              Les onglets "Antécédents et Examen" et "Traitement" seront développés dans la prochaine phase.
            </p>
          </div>
        </div>
      </div>
    </div>

      {showPrescriptionGenerator && (
        <PrescriptionGenerator
          patient={patient}
          doctor={mockDoctor}
          onClose={() => setShowPrescriptionGenerator(false)}
        />
      )}

      {showPrescriptionHistory && (
        <PrescriptionHistory
          patientId={patient.numeroDossierAuto}
          onClose={() => setShowPrescriptionHistory(false)}
        />
      )}
    </>
  );
};

export default PatientView;