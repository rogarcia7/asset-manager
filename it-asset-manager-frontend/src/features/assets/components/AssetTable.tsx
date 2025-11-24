import type { Asset } from '../types';

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: number) => void;
}

// Função auxiliar para escolher a cor do status
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Em Estoque': return 'status-stock';
    case 'Em Uso': return 'status-use';
    case 'Manutenção': return 'status-maintenance';
    case 'Descomissionado': return 'status-decommissioned';
    default: return 'status-stock';
  }
};

export const AssetTable = ({ assets, onEdit, onDelete }: AssetTableProps) => {
  if (assets.length === 0) {
    return <div className="empty-state"><p>Nenhum ativo encontrado.</p></div>;
  }

  return (
    <table className="asset-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>S/N</th>
          <th>Nome</th>
          <th>Status</th>
          <th style={{ textAlign: 'right' }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr key={asset.id}>
            <td className="id-col">#{asset.id}</td>
            <td className="mono-font">{asset.serialNumber}</td>
            <td className="fw-bold">{asset.name}</td>
            <td>
              <span className={`status-badge ${getStatusClass(asset.status)}`}>
                {asset.status}
              </span>
            </td>
            <td className="actions-cell">
              <button className="icon-btn" onClick={() => onEdit(asset)} title="Editar">✏️</button>
              <button className="icon-btn delete" onClick={() => onDelete(asset.id)} title="Excluir">🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};