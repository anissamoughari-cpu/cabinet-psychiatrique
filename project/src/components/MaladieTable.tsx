// src/components/MaladieTable.tsx
import React, { useState, useEffect } from 'react';
import  maladieService  from '../services/maladieService';
import { Maladie, MaladieFormData } from '../types/maladie';

const MaladieTable: React.FC = () => {
  // États du composant
  const [maladies, setMaladies] = useState<Maladie[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MaladieFormData>({
    nom: '',
    description: '',
    code: ''
  });

  // Charger les maladies au démarrage
  const loadMaladies = async () => {
    setLoading(true);
    try {
      const data = await maladieService.getAll();
      setMaladies(data);
    } catch (error) {
      console.error('Erreur chargement maladies:', error);
      alert('Erreur lors du chargement des maladies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaladies();
  }, []);

  // Gérer l'ajout d'une maladie
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      alert('Le nom est obligatoire');
      return;
    }

    try {
      await maladieService.create(formData);
      
      // Réinitialiser et recharger
      setFormData({ nom: '', description: '', code: '' });
      setShowForm(false);
      loadMaladies();
      
      alert('Maladie ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur ajout maladie:', error);
      alert('Erreur lors de l\'ajout de la maladie');
    }
  };

  // Gérer la suppression
  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette maladie ?')) {
      return;
    }

    try {
      await maladieService.delete(id);
      loadMaladies();
      alert('Maladie supprimée avec succès!');
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
        <h2 style={{ color: '#333', margin: 0 }}>📋 Gestion des Maladies</h2>
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
          {showForm ? '✖ Fermer' : '➕ Ajouter une maladie'}
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
          <h3 style={{ marginTop: 0, color: '#495057' }}>Nouvelle Maladie</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Nom de la maladie *
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
              placeholder="Ex: Diabète, Hypertension..."
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Code (optionnel)
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Ex: DBT, HTA..."
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
              placeholder="Description de la maladie..."
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
                setFormData({ nom: '', description: '', code: '' });
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

      {/* Tableau des maladies */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Chargement des maladies...</p>
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
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Code</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Description</th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {maladies.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: '#6c757d' 
                  }}>
                    Aucune maladie enregistrée
                  </td>
                </tr>
              ) : (
                maladies.map((maladie, index) => (
                  <tr 
                    key={maladie.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6'
                    }}
                  >
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{maladie.id}</td>
                    <td style={{ padding: '15px' }}>{maladie.nom}</td>
                    <td style={{ padding: '15px' }}>{maladie.code || '-'}</td>
                    <td style={{ padding: '15px' }}>
                      {maladie.description || 'Aucune description'}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(maladie.id)}
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

export default MaladieTable;