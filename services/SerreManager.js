const stockage = require('../models/Stockage');
const FRAISES_RENDEMENT = 1500;

class SerreManager {
    static async gererSerres(serres) {
        for (const serre of serres) {
            if (serre.etat === 'récolté') {
                console.log(`[${new Date().toISOString()}] Serre ${serre.numero} état actuel : ${serre.etat}`);
                await serre.addPlant(FRAISES_RENDEMENT);
            } else if (serre.etat === 'prêt à récolter' && serre.estMature) {
                await this.recolterSerre(serre);
            }
        }
    }

    static async recolterSerre(serre) {
        console.log(`[${new Date().toISOString()}]Récolte des fraises dans la serre ${serre.numero}...`);

        const rendement = serre.rendement;
        serre.etat = 'récolté';
        serre.estMature = false;


        let ajoutReussi = await stockage.ajouter('fraise', rendement);

        if (!ajoutReussi) {
            console.log(`[${new Date().toISOString()}]Stockage plein. Nouvelle tentative dans 1 minute...`);
            await new Promise(resolve => setTimeout(resolve, 60000));
            ajoutReussi = await stockage.ajouter('fraise', rendement);

            if (!ajoutReussi) {
                console.log(`[${new Date().toISOString()}]Production perdue : ${rendement}L de fraise`);
            } else {
                console.log(`[${new Date().toISOString()}]Ajout réussi après 1 minute : ${rendement}L de fraise`);
            }
        } else {
            console.log(`[${new Date().toISOString()}]Ajout de ${rendement}L de fraise au stockage`);
        }
    }
}

module.exports = SerreManager;
