import { useState, useEffect } from 'react';
import './App.css';
import { assetService } from './features/assets/api/assetService';
import type { Asset, AssetPayload } from './features/assets/types';
import { AssetTable } from './features/assets/components/AssetTable';
import { AssetFormModal } from './features/assets/components/AssetFormModal';

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await assetService.getAll();
      setAssets(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar ativos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAssets(); }, []);

  const handleSave = async (data: AssetPayload) => {
    try {
      if (editingAsset) await assetService.update(editingAsset.id, data);
      else await assetService.create(data);
      setIsModalOpen(false);
      setEditingAsset(null);
      loadAssets();
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza?')) return;
    try { await assetService.delete(id); loadAssets(); } 
    catch (err) { alert('Erro ao excluir.'); }
  };

  const openCreate = () => { setEditingAsset(null); setIsModalOpen(true); };
  const openEdit = (asset: Asset) => { setEditingAsset(asset); setIsModalOpen(true); };

  return (
    <div className="app-wrapper">
      <div className="container">
        
        {/* Cabeçalho */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo-area">
              <h1 className="app-logo">⚡ TechAssets</h1>
              <p>Gerenciamento de TI Profissional</p>
            </div>
            <button className="btn-primary" onClick={openCreate}>
              + Novo Ativo
            </button>
          </div>
        </header>

        {/* Cartão Principal */}
        <main className="content-card">
          {error && <div className="alert error">{error}</div>}
          
          {loading ? (
            <div className="loading-state">Carregando dados...</div>
          ) : (
            <div className="table-responsive">
              <AssetTable 
                assets={assets} 
                onEdit={openEdit} 
                onDelete={handleDelete} 
              />
            </div>
          )}
        </main>

        <AssetFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          initialData={editingAsset}
        />
      </div>
    </div>
  );
}

export default App;