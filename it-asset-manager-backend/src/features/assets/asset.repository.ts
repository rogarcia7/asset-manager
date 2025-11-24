import { prisma } from '../../database/client.js';
import type { AssetBody } from './asset.types.js';

// CREATE
export const create = async (data: AssetBody) => {
    return await prisma.asset.create({
        data: {
            serialNumber: data.serialNumber,
            name: data.name,
            purchaseDate: data.purchaseDate,
            status: data.status
        }
    });
};

// READ ALL
export const findAll = async () => {
    return await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' } 
    });
};

// READ ONE
export const findById = async (id: string) => {
    return await prisma.asset.findUnique({
        where: { id: Number(id) }
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
