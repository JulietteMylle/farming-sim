const pool = require('../db');

const max = 100000;

class Stockage {
    async getCapaciteUtilisee() {
        const result = await pool.query('SELECT SUM(quantite) AS total FROM stockage');
        return result.rows[0].total || 0;
    }

    async getEspaceDisponible() {
        const utilisee = await this.getCapaciteUtilisee();
        return max - utilisee;
    }

    async ajouter(type, quantite) {
        const espace = await this.getEspaceDisponible();
        if (espace < quantite) {
            console.log(`[${new Date().toISOString()}]Stockage plein. ${quantite}L de ${type} refusés.`);
            return false;
        }

        const result = await pool.query('SELECT * FROM stockage WHERE type = $1', [type]);

        if (result.rows.length > 0) {
            await pool.query('UPDATE stockage SET quantite = quantite + $1 WHERE type = $2', [quantite, type]);
        } else {
            await pool.query('INSERT INTO stockage (type, quantite) VALUES ($1, $2)', [type, quantite]);
        }

        // console.log(`[${new Date().toISOString()}]Ajouté : ${quantite}L de ${type}`);
        return true;
    }

    async retirer(type, quantite) {
        const result = await pool.query('SELECT quantite FROM stockage WHERE type = $1', [type]);
        if (result.rows.length === 0 || result.rows[0].quantite < quantite) {
            console.log(`[${new Date().toISOString()}]Stock insuffisant pour retirer ${quantite}L de ${type}`);
            return false;
        }

        await pool.query('UPDATE stockage SET quantite = quantite - $1 WHERE type = $2', [quantite, type]);
        await pool.query('DELETE FROM stockage WHERE quantite = 0');

        // console.log(`[${new Date().toISOString()}]Retiré : ${quantite}L de ${type}`);
        return true;
    }

    async lister() {
        const result = await pool.query('SELECT * FROM stockage');
        return result.rows;
    }
    async getQuantite(type) {
    const result = await pool.query('SELECT quantite FROM stockage WHERE type = $1', [type]);
    if (result.rows.length === 0) {
        return 0;
    }
    return result.rows[0].quantite;
}
}

module.exports = new Stockage();
