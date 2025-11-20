// src/database.ts

// MANTENHA A IMPORTAÇÃO DO 'sqlite', mas remova a importação estática do 'sqlite3'
import { open } from 'sqlite'; 
// import sqlite3 from 'sqlite3'; // <== REMOVA/COMENTE ESTA LINHA!

// Nome do arquivo do banco de dados SQLite
const DB_NAME = 'assets.db';

export interface Asset {
    id: number;
    serialNumber: string;
    name: string;
    purchaseDate: string | null; 
    status: string;
    createdAt: string;
    updatedAt: string;
}

export async function initializeDatabase() {
    // 1. IMPORTAÇÃO DINÂMICA: Carrega sqlite3 de forma assíncrona para compatibilidade com ES Modules
    const sqlite3Module = await import('sqlite3'); 

    const db = await open({
        filename: DB_NAME,
        // 2. ACESSO AO DRIVER: Acesse o Driver dentro da propriedade 'default' do módulo importado
        driver: sqlite3Module.default.Database 
    });

    // SQL para criar a tabela Asset se ela não existir
    await db.exec(`
        CREATE TABLE IF NOT EXISTS assets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            serialNumber TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            purchaseDate TEXT,
            status TEXT DEFAULT 'Em Estoque',
            createdAt TEXT DEFAULT (datetime('now')),
            updatedAt TEXT DEFAULT (datetime('now'))
        );
    `);

    console.log('Banco de dados SQLite inicializado e tabela "assets" pronta.');
    return db;
}