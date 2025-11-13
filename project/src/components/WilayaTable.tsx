import React, { useState, useEffect } from 'react';
import wilayaService from '../services/wilayaService';
import { Wilaya, WilayaFormData } from '../types/wilaya';

const WilayaTable: React.FC = () => {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<WilayaFormData>({
    code: '',
    nom: ''
  });

  const loadWilayas = async () => {
    setLoading(true);
    try {
      const data = await wilayaService.getAll();
      setWilayas(data);
    } catch (error) {
      console.error('Erreur chargement wilayas:', error);
      alert('Erreur lors du chargement des wilayas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWilayas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim() || !formData.code.trim()) {
      alert('Le code et le nom sont obligatoires');
      return;
    }

    try {
      await wilayaService.create(formData);
      setFormData({ code: '', nom: '' });
      setShowForm(false);
      loadWilayas();
      alert('Wilaya ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur ajout wilaya:', error);
      alert('Erreur lors de l\'ajout de la wilaya');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette wilaya ?')) {
      return;
    }

    try {
      await wilayaService.delete(id);
      loadWilayas();
      alert('Wilaya supprimée avec succès!');
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
        <h2 style={{ color: '#333', margin: 0 }}>🗺️ Gestion des Wilayas</h2>
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
          {showForm ? '✖ Fermer' : '➕ Ajouter une wilaya'}
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
          <h3 style={{ marginTop: 0, color: '#495057' }}>Nouvelle Wilaya</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Code *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Ex: 16, 31, 42..."
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Nom *
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
              placeholder="Ex: Alger, Oran, Constantine..."
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
                setFormData({ code: '', nom: '' });
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

      {/* Tableau des wilayas */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Chargement des wilayas...</p>
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Code</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Nom</th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wilayas.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: '#6c757d' 
                  }}>
                    Aucune wilaya enregistrée
                  </td>
                </tr>
              ) : (
                wilayas.map((wilaya, index) => (
                  <tr 
                    key={wilaya.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6'
                    }}
                  >
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{wilaya.id}</td>
                    <td style={{ padding: '15px' }}>{wilaya.code}</td>
                    <td style={{ padding: '15px' }}>{wilaya.nom}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(wilaya.id)}
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

export default WilayaTable;