import { prisma } from '../../database/client.js';
import type { AssetBody } from './asset.types.js';

// CREATE
export const create = async (data: AssetBody) => {
    return await prisma.asset.create({
        data: {
            serialNumber: data.serialNumber,
            name: data.name,
            purchaseDate: data.purchaseDate,
            status: data.status // Se vier vazio, o Prisma usa o padrão 'Em Estoque' definido no Schema
        }
    });
};

// READ ALL
export const findAll = async () => {
    return await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' } // Ordenação simples e legível
    });
};

// READ ONE
export const findById = async (id: string) => {
    return await prisma.asset.findUnique({
        where: { id: Number(id) } // Convertendo String para Int, pois o banco espera número
    });
};

// UPDATE
export const update = async (id: string, data: AssetBody) => {
    try {
        return await prisma.asset.update({
            where: { id: Number(id) },
            data: {
                serialNumber: data.serialNumber,
                name: data.name,
                purchaseDate: data.purchaseDate,
                status: data.status
            }
        });
    } catch (error) {
        // Se o Prisma não achar o ID, ele joga um erro.
        // Capturamos aqui e retornamos null para o Controller tratar como 404.
        return null;
    }
};

// DELETE
export const remove = async (id: string) => {
    try {
        await prisma.asset.delete({
            where: { id: Number(id) }
        });
        return true;
    } catch (error) {
        return false;
    }
};