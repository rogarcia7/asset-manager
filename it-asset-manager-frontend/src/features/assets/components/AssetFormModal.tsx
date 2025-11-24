import React, { useState, useEffect } from 'react';
import type { Asset, AssetPayload } from '../types';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssetPayload) => Promise<void>;
  initialData?: Asset | null;
}

export const AssetFormModal = ({ isOpen, onClose, onSubmit, initialData }: AssetFormModalProps) => {
  const [formState, setFormState] = useState<AssetPayload>({
    serialNumber: '', name: '', purchaseDate: '', status: 'Em Estoque',
  });

  useEffect(() => {
    if (initialData) {
      setFormState({
        serialNumber: initialData.serialNumber,
        name: initialData.name,
        purchaseDate: initialData.purchaseDate ? initialData.purchaseDate.split('T')[0] : '',
        status: initialData.status,
      });
    } else {
      setFormState({ serialNumber: '', name: '', purchaseDate: '', status: 'Em Estoque' });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formState,
      purchaseDate: formState.purchaseDate ? new Date(formState.purchaseDate).toISOString() : null
    };
    await onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Editar Ativo' : 'Novo Ativo'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Serial Number</label>
            <input type="text" name="serialNumber" value={formState.serialNumber} onChange={handleChange} required placeholder="EX: SN-12345" />
          </div>
          <div className="form-group">
            <label>Nome do Equipamento</label>
            <input type="text" name="name" value={formState.name} onChange={handleChange} required placeholder="Dell Latitude 5420" />
          </div>
          <div className="form-group">
            <label>Data de Compra</label>
            <input type="date" name="purchaseDate" value={formState.purchaseDate || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Status Atual</label>
            <select name="status" value={formState.status} onChange={handleChange}>
              <option value="Em Estoque">Em Estoque</option>
              <option value="Em Uso">Em Uso</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Descomissionado">Descomissionado</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};