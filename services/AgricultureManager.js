const MachineManager = require('./MachineManager');
const stockage = require('../models/Stockage');
const cultures = require('../data/cultures');

class AgricultureManager {
    static async labourerChamp(champ) {
        const machine = await MachineManager.demanderMachine('charrue');
        console.log(`[${new Date().toISOString()}]Labourage du champ ${champ.numero}...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
        champ.etat = 'labouré';
        MachineManager.libererMachine(machine);
    }

    static async semerChamp(champ, nomCulture) {
        console.log(`[${new Date().toISOString()}]Culture demandée pour semer: ${nomCulture}`);
        const culture = cultures[nomCulture];

        if (!culture) {
            console.warn(`[${new Date().toISOString()}] Culture "${nomCulture}" inconnue.`);
            return;
        }

        const machineName = culture.machines.find(m => m.toLowerCase().includes('semeuse') || m.toLowerCase().includes('planteuse'));
        if (!machineName) {
            console.warn(`[${new Date().toISOString()}] Aucune machine de semis trouvée pour "${nomCulture}".`);
            return;
        }

        const machine = await MachineManager.demanderMachine(machineName);
        console.log(`[${new Date().toISOString()}]Semis de ${nomCulture} sur champ ${champ.numero}...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
        champ.addPlant(nomCulture, culture.rendement);
        MachineManager.libererMachine(machine);
    }

    static async fertiliserChamp(champ) {
    const fertilQuantite = await stockage.getQuantite('fertilisant');

    if (fertilQuantite <= 0) {
        console.log(`[${new Date().toISOString()}] Pas de fertilisant disponible pour le champ ${champ.numero}`);
        return;
    }

    const machine = await MachineManager.demanderMachine('fertilisateur');
    console.log(`[${new Date().toISOString()}]Fertilisation du champ ${champ.numero}...`);
    await new Promise(resolve => setTimeout(resolve, 30000));

    const result = champ.addFertilisant(); // booléen si fertilisation effective

    if (result) {
        const retrait = await stockage.retirer('fertilisant', 1);
        if (!retrait) {
            console.warn(`[${new Date().toISOString()}] Échec retrait fertilisant après fertilisation du champ ${champ.numero}`);
        } else {
            console.log(`[${new Date().toISOString()}] 1 unité de fertilisant utilisée pour le champ ${champ.numero}`);
        }
    }

    MachineManager.libererMachine(machine);
}

    static async recolterChamp(champ) {
        const cultureName = champ.culture;
        const culture = cultures[cultureName];

        if (!culture) {
            console.warn(`[${new Date().toISOString()}] Culture "${cultureName}" inconnue.`);
            return;
        }

        const moissonneuseName = culture.machines.find(m => m.toLowerCase().includes('moissonneuse'));
        if (!moissonneuseName) {
            console.warn(`[${new Date().toISOString()}] Aucune moissonneuse trouvée pour "${cultureName}".`);
            return;
        }

        const moissonneuse = await MachineManager.demanderMachine(moissonneuseName);
        const remorqueName = culture.machines.find(m => m.toLowerCase().includes('remorque'));

        console.log(`[${new Date().toISOString()}]Récolte de ${cultureName} sur champ ${champ.numero}...`);
        const result = champ.recolterPlant();

        if (!result) {
            console.warn(`[${new Date().toISOString()}] Échec de la récolte : aucun résultat pour champ ${champ.numero}.`);
            MachineManager.libererMachine(moissonneuse);
            return;
        }

        let ajoutReussi = await stockage.ajouter(result.culture, result.rendement);

        if (!ajoutReussi) {
            console.log(`[${new Date().toISOString()}]Stockage plein. Nouvelle tentative dans 1 minute...`);
            await new Promise(resolve => setTimeout(resolve, 60000));
            ajoutReussi = await stockage.ajouter(result.culture, result.rendement);

            if (!ajoutReussi) {
                console.log(`[${new Date().toISOString()}]Production perdue : ${result.rendement}L de ${result.culture}`);
            } else {
                console.log(`[${new Date().toISOString()}]Ajout réussi après 1 minute : ${result.rendement}L de ${result.culture}`);
            }
        } else {
            console.log(`[${new Date().toISOString()}]Ajout de ${result.rendement}L de ${result.culture} au stockage`);
        }

        MachineManager.libererMachine(moissonneuse);

        if (remorqueName) {
            const remorque = await MachineManager.demanderMachine(remorqueName);
            console.log(`[${new Date().toISOString()}]Transport avec ${remorque.nom}`);
            MachineManager.libererMachine(remorque);
        }
    }
}

module.exports = AgricultureManager;
