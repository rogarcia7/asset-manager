import type { Request, Response } from 'express';
import * as assetRepo from './asset.repository.js';
import type { AssetBody } from './asset.types.js';

// POST /assets
export const create = async (req: Request, res: Response) => {
    try {
        const { serialNumber, name, status } = req.body;

        if (!serialNumber || !name) {
            return res.status(400).json({ error: 'Número de série e nome são obrigatórios.' });
        }

        const newAsset = await assetRepo.create(req.body as AssetBody);
        res.status(201).json(newAsset);
    } catch (error: any) {
        if (error?.message?.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Número de série já existe.' });
        }
        res.status(500).json({ error: 'Erro ao criar ativo.' });
    }
};

// GET /assets
export const list = async (_req: Request, res: Response) => {
    try {
        const assets = await assetRepo.findAll();
        res.json(assets);
    } catch (error) {
        console.error('ERRO REAL:', error);
        res.status(500).json({ error: 'Erro ao listar ativos.' });
    }
};

// GET /assets/:id
export const getOne = async (req: Request, res: Response) => {
    try {
        // MUDANÇA AQUI: Forçando 'as string'
        const id = req.params.id as string;
        const asset = await assetRepo.findById(id);

        if (!asset) {
            return res.status(404).json({ error: 'Ativo não encontrado.' });
        }
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ativo.' });
    }
};

// PUT /assets/:id
export const update = async (req: Request, res: Response) => {
    try {
        // MUDANÇA AQUI: Forçando 'as string'
        const id = req.params.id as string;
        const updatedAsset = await assetRepo.update(id, req.body as AssetBody);

        if (!updatedAsset) {
            return res.status(404).json({ error: 'Ativo não encontrado para atualização.' });
        }

        res.json(updatedAsset);
    } catch (error: any) {
         if (error?.message?.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Número de série já existe.' });
        }
        res.status(500).json({ error: 'Erro ao atualizar ativo.' });
    }
};

// DELETE /assets/:id
export const remove = async (req: Request, res: Response) => {
    try {
        // MUDANÇA AQUI: Forçando 'as string'
        const id = req.params.id as string;
        const success = await assetRepo.remove(id);

        if (!success) {
            return res.status(404).json({ error: 'Ativo não encontrado.' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir ativo.' });
    }
};