import React, { useState, useEffect } from 'react';
import communeService from '../services/communeService';
import wilayaService from '../services/wilayaService';
import { Commune, CommuneFormData } from '../types/commune';
import { Wilaya } from '../types/wilaya';

const CommuneTable: React.FC = () => {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CommuneFormData>({
    nom: '',
    wilaya_id: 0
  });

  const loadCommunes = async () => {
    setLoading(true);
    try {
      const data = await communeService.getAll();
      setCommunes(data);
    } catch (error) {
      console.error('Erreur chargement communes:', error);
      alert('Erreur lors du chargement des communes');
    } finally {
      setLoading(false);
    }
  };

  const loadWilayas = async () => {
    try {
      const data = await wilayaService.getAll();
      setWilayas(data);
    } catch (error) {
      console.error('Erreur chargement wilayas:', error);
    }
  };

  useEffect(() => {
    loadCommunes();
    loadWilayas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim() || formData.wilaya_id === 0) {
      alert('Le nom et la wilaya sont obligatoires');
      return;
    }

    try {
      await communeService.create(formData);
      setFormData({ nom: '', wilaya_id: 0 });
      setShowForm(false);
      loadCommunes();
      alert('Commune ajoutée avec succès!');
    } catch (error) {
      console.error('Erreur ajout commune:', error);
      alert('Erreur lors de l\'ajout de la commune');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commune ?')) {
      return;
    }

    try {
      await communeService.delete(id);
      loadCommunes();
      alert('Commune supprimée avec succès!');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Trouver le nom de la wilaya
  const getWilayaName = (wilayaId: number) => {
    const wilaya = wilayas.find(w => w.id === wilayaId);
    return wilaya ? wilaya.nom : 'Inconnue';
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
        <h2 style={{ color: '#333', margin: 0 }}>🏘️ Gestion des Communes</h2>
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
          {showForm ? '✖ Fermer' : '➕ Ajouter une commune'}
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
          <h3 style={{ marginTop: 0, color: '#495057' }}>Nouvelle Commune</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Nom de la commune *
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
              placeholder="Ex: Sidi M'Hamed, Hussein Dey..."
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Wilaya *
            </label>
            <select
              value={formData.wilaya_id}
              onChange={(e) => setFormData({...formData, wilaya_id: parseInt(e.target.value)})}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value={0}>Sélectionnez une wilaya</option>
              {wilayas.map((wilaya) => (
                <option key={wilaya.id} value={wilaya.id}>
                  {wilaya.code} - {wilaya.nom}
                </option>
              ))}
            </select>
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
                setFormData({ nom: '', wilaya_id: 0 });
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

      {/* Tableau des communes */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Chargement des communes...</p>
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
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Wilaya</th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {communes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    color: '#6c757d' 
                  }}>
                    Aucune commune enregistrée
                  </td>
                </tr>
              ) : (
                communes.map((commune, index) => (
                  <tr 
                    key={commune.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6'
                    }}
                  >
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{commune.id}</td>
                    <td style={{ padding: '15px' }}>{commune.nom}</td>
                    <td style={{ padding: '15px' }}>{getWilayaName(commune.wilaya_id)}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(commune.id)}
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

export default CommuneTable;