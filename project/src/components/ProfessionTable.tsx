import React, { useState, useEffect } from 'react';
import  professionService  from '../services/professionService';
import { Profession, ProfessionFormData } from '../types/profession';

const ProfessionTable: React.FC = () => {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfessionFormData>({
    nom: '',
    secteur: '',
    description: ''
  });

  // Charger les professions
  const loadProfessions = async () => {
    setLoading(true);
    try {
      const data = await professionService.getAll();
      setProfessions(data);
    } catch (error) {
      console.error('Erreur chargement professions:', error);
      alert('Erreur lors du chargement des professions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfessions();
  }, []);

  // Ajouter une profession
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      alert('Le nom est obligatoire');
      return;
    }

    try {
      await professionService.create(formData);
      
      // Réinitialiser et recharger
      setFormData({ nom: '', secteur: '', description: '' });
      setShowForm(false);
      loadProfessions();
      
      alert('Profession ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur ajout profession:', error);
      alert('Erreur lors de l\'ajout de la profession');
    }
  };

  // Supprimer une profession
  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette profession ?')) {
      return;
    }

    try {
      await professionService.delete(id);
      loadProfessions();
      alert('Profession supprimée avec succès!');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* En-tête */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '15px'
      }}>
        <h2 style={{ color: '#333', margin: 0 }}>💼 Gestion des Professions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: showForm ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {showForm ? '✖ Fermer' : '➕ Ajouter une profession'}
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#f8f9fa',
          padding: '25px',
          borderRadius: '10px',
          marginBottom: '30px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057' }}>Nouvelle Profession</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Nom de la profession *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Ex: Médecin, Infirmier, Secrétaire..."
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Secteur *
            </label>
            <input
              type="text"
              value={formData.secteur}
              onChange={(e) => setFormData({...formData, secteur: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Ex: Santé, Administration, Technique..."
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px',
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder="Description de la profession..."
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              💾 Enregistrer
            </button>
            <button 
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ nom: '', secteur: '', description: '' });
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ❌ Annuler
            </button>
          </div>
        </form>
      )}

      {/* Tableau des professions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Chargement des professions...</p>
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Nom</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Secteur</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Description</th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {professions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: '#6c757d' 
                  }}>
                    Aucune profession enregistrée
                  </td>
                </tr>
              ) : (
                professions.map((profession, index) => (
                  <tr 
                    key={profession.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6'
                    }}
                  >
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{profession.id}</td>
                    <td style={{ padding: '15px' }}>{profession.nom}</td>
                    <td style={{ padding: '15px' }}>{profession.secteur}</td>
                    <td style={{ padding: '15px' }}>
                      {profession.description || 'Aucune description'}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(profession.id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProfessionTable;