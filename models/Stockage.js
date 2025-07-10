const mysql = require('mysql2/promise');

const max = 100000;

const pool = mysql.createPool({
    host: 'localhost',
    user : 'root',
    password : 'root',
    database : 'farmingsim'
})

class Stockage {
    async getCapaciteUtilisee() {
        const [rows] = await pool.query('SELECT SUM(quantite) AS total FROM stockage');
        return rows[0].total || 0;
    }
    async getEspaceDisponible() {
        const utilisee = await this.getCapaciteUtilisee();
        return max - utilisee
    }
    async ajouter (type, quantite) {
        const espace = await this.getEspaceDisponible();
        if (espace < quantite) {
            console.log(`[${new Date().toISOString()}]Stockage plein. ${quantite}L de ${type} refusés.`);
            return false
        }
         const [rows] = await pool.query('SELECT * FROM stockage WHERE type = ?', [type]);
         if (rows.length > 0) {
            await pool.query('UPDATE stockage SET quantite = quantite + ? WHERE type = ?', [quantite, type]);
        } else {
            await pool.query('INSERT INTO stockage (type, quantite) VALUES (?, ?)', [type, quantite]);
        }
        console.log(`[${new Date().toISOString()}]Ajouté : ${quantite}L de ${type}`);
        return true;
    }
    async retirer(type, quantite){
        const[rows] = await pool.query('SELECT quantite FROM stockage WHERE type = ?', [type]);
        if (rows.length === 0 || rows[0].quantite < quantite) {
            console.log(`[${new Date().toISOString()}]Stock insuffisant pour retirer ${quantite}L de ${type}`);
            return false;
        }
         await pool.query('UPDATE stockage SET quantite = quantite - ? WHERE type = ?', [quantite, type]);
        await pool.query('DELETE FROM stockage WHERE quantite = 0');

        console.log(`[${new Date().toISOString()}]Retiré : ${quantite}L de ${type}`);
        return true;
    }

    async lister() {
        const [rows] = await pool.query('SELECT * FROM stockage');
        return rows;
    }
}
module.exports = new Stockage();