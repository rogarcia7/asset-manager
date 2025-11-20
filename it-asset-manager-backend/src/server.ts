import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { initializeDatabase, type Asset } from './database.js';
import cors from 'cors';
import { Database } from 'sqlite';


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());


let db: Database;


function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
   
    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
        return error.message;
    }
    return 'Erro desconhecido.';
}



async function startServer() {
    try {
        db = await initializeDatabase();
        

        app.post('/assets', async (req: Request, res: Response) => {
            const { serialNumber, name, purchaseDate, status } = req.body;

            
            if (!serialNumber || !name) {
                return res.status(400).json({ error: 'Número de série e nome são obrigatórios.' });
            }

            try {
                const result = await db.run(
                    `INSERT INTO assets (serialNumber, name, purchaseDate, status) 
                     VALUES (?, ?, ?, ?)`,
                    [serialNumber, name, purchaseDate, status]
                );
                
                
                const newAsset = await db.get<Asset>('SELECT * FROM assets WHERE id = ?', result.lastID);
                res.status(201).json(newAsset);

            } catch (error) {
                const errorMessage = getErrorMessage(error);
                if (errorMessage.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Número de série já existe.' });
                }
                res.status(500).json({ error: 'Erro ao criar ativo.', details: errorMessage });
            }
        });

        
        app.get('/assets', async (req: Request, res: Response) => {
            try {
                const assets = await db.all<Asset[]>('SELECT * FROM assets ORDER BY createdAt DESC');
                res.status(200).json(assets);
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                res.status(500).json({ error: 'Erro ao listar ativos.', details: errorMessage });
            }
        });

        
        app.get('/assets/:id', async (req: Request, res: Response) => {
            const { id } = req.params;
            try {
                const asset = await db.get<Asset>('SELECT * FROM assets WHERE id = ?', id);
                if (!asset) {
                    return res.status(404).json({ error: 'Ativo não encontrado.' });
                }
                res.status(200).json(asset);
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                res.status(500).json({ error: 'Erro ao buscar ativo.', details: errorMessage });
            }
        });

        
        app.put('/assets/:id', async (req: Request, res: Response) => {
            const { id } = req.params;
            const { serialNumber, name, purchaseDate, status } = req.body;

            
            const updateTimestamp = new Date().toISOString(); 

            try {
                const result = await db.run(
                    `UPDATE assets 
                     SET serialNumber = ?, name = ?, purchaseDate = ?, status = ?, updatedAt = ?
                     WHERE id = ?`,
                    [serialNumber, name, purchaseDate, status, updateTimestamp, id]
                );

                if (result.changes === 0) {
                    
                    const existingAsset = await db.get<Asset>('SELECT id FROM assets WHERE id = ?', id);
                    if (!existingAsset) {
                        return res.status(404).json({ error: 'Ativo não encontrado.' });
                    }
                    return res.status(200).json({ message: 'Nenhuma alteração detectada. Dados fornecidos são os mesmos.' });
                }

                
                const updatedAsset = await db.get<Asset>('SELECT * FROM assets WHERE id = ?', id);
                res.status(200).json(updatedAsset);

            } catch (error) {
                const errorMessage = getErrorMessage(error);
                if (errorMessage.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Número de série já existe.' });
                }
                res.status(500).json({ error: 'Erro ao atualizar ativo.', details: errorMessage });
            }
        });

        
        app.delete('/assets/:id', async (req: Request, res: Response) => {
            const { id } = req.params;
            try {
                const result = await db.run('DELETE FROM assets WHERE id = ?', id);
                
                if (result.changes === 0) {
                    return res.status(404).json({ error: 'Ativo não encontrado.' });
                }
                
                res.status(204).send(); 

            } catch (error) {
                const errorMessage = getErrorMessage(error);
                res.status(500).json({ error: 'Erro ao excluir ativo.', details: errorMessage });
            }
        });
        

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log('Endpoints: /assets (POST, GET, PUT/:id, DELETE/:id)');
        });

    } catch (error) {
        
        const errorMessage = getErrorMessage(error);
        console.error('Falha ao iniciar o servidor ou conectar ao DB:', errorMessage);
        process.exit(1);
    }
}

startServer();