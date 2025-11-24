import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import assetRoutes from './features/assets/asset.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

async function startServer() {
    try {
        
        app.use('/assets', assetRoutes);

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log('Endpoints disponíveis em: /assets');
        });

    } catch (error) {
        console.error('Falha fatal ao iniciar o servidor:', error);
        process.exit(1);
    }
}

startServer();
