

import React, { useState, useEffect } from 'react';
import './App.css';
import { type Asset } from './types/Asset'; 


const API_BASE_URL = 'http://localhost:3000/assets';

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    }
    // Tenta extrair a mensagem de um objeto JSON de erro, se houver
    if (typeof err === 'object' && err !== null && 'error' in err && typeof (err as any).error === 'string') {
        return (err as any).error; 
    }
    return 'Erro desconhecido ao processar a requisição.';
}


function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);


  const [formState, setFormState] = useState({
    serialNumber: '',
    name: '',
    purchaseDate: '',
    status: 'Em Estoque',
  });


  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Falha ao buscar os ativos.');
      }
      const data: Asset[] = await response.json();
      setAssets(data);
    } catch (err) { 
      console.error(err);
      setError(getErrorMessage(err));
      setError('Não foi possível carregar os dados. Verifique se o backend está rodando em http://localhost:3000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    

    const assetData = {
        ...formState,
        purchaseDate: formState.purchaseDate ? new Date(formState.purchaseDate).toISOString() : null
    };

    const method = editingAsset ? 'PUT' : 'POST';
    const url = editingAsset ? `${API_BASE_URL}/${editingAsset.id}` : API_BASE_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assetData),
      });

      if (!response.ok) {
       
        const errorBody = await response.json();
        throw new Error(errorBody.error || `Erro HTTP ${response.status}: Falha na operação.`);
      }

      
      setIsModalOpen(false);
      setEditingAsset(null);
      resetForm();
      fetchAssets(); 

    } catch (err) { 
      console.error(err);
      setError(getErrorMessage(err)); 
    }
  };


  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este ativo?')) {
      return;
    }
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 404) {
        throw new Error('Ativo não encontrado.');
      }
      if (!response.ok && response.status !== 204) { 
        throw new Error('Falha ao excluir o ativo.');
      }


      setAssets(assets.filter(asset => asset.id !== id));
      
    } catch (err) { 
      console.error(err);
      setError(getErrorMessage(err)); 
    }
  };

  
  const openCreateModal = () => {
    setEditingAsset(null);
    resetForm();
    setIsModalOpen(true);
  };
  
  const openEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setFormState({
        serialNumber: asset.serialNumber,
        name: asset.name,
        purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
        status: asset.status,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormState({ serialNumber: '', name: '', purchaseDate: '', status: 'Em Estoque' });
  }


  return (
    <div className="container">
      <h1>Gerenciador de Ativos de TI (CRUD)</h1>
      <p>Desenvolvido com TS, React e SQLite</p>
      
      <button className="btn-primary" onClick={openCreateModal}>
        + Adicionar Novo Ativo
      </button>

      {error && <div className="alert error">{error}</div>}

      {loading ? (
        <p>Carregando ativos...</p>
      ) : (
        <table className="asset-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>S/N</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>{asset.serialNumber}</td>
                <td>{asset.name}</td>
                <td>{asset.status}</td>
                <td>
                  <button className="btn-secondary" onClick={() => openEditModal(asset)}>Editar</button>
                  <button className="btn-danger" onClick={() => handleDelete(asset.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table >
      )}


      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingAsset ? 'Editar Ativo' : 'Criar Novo Ativo'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Número de Série:</label>
                <input 
                    type="text" 
                    name="serialNumber" 
                    value={formState.serialNumber} 
                    onChange={handleFormChange} 
                    required 
                />
              </div>
              <div className="form-group">
                <label>Nome do Ativo:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={formState.name} 
                    onChange={handleFormChange} 
                    required 
                />
              </div>
              <div className="form-group">
                <label>Data de Compra (Opcional):</label>
                <input 
                    type="date" 
                    name="purchaseDate" 
                    value={formState.purchaseDate} 
                    onChange={handleFormChange} 
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select name="status" value={formState.status} onChange={handleFormChange}>
                  <option value="Em Estoque">Em Estoque</option>
                  <option value="Em Uso">Em Uso</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Descomissionado">Descomissionado</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editingAsset ? 'Salvar Alterações' : 'Criar Ativo'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;