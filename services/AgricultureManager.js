const MachineManager = require('./MachineManager');
const stockage = require('../models/Stockage');
const cultures = require('../data/cultures');

class AgricultureManager {
    static async labourerChamp(champ) {
        const machine = await MachineManager.demanderMachine('charrue');
        console.log(`Labourage du champ ${champ.numero}...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
        champ.etat = 'labouré';
        MachineManager.libererMachine(machine);
    }

    static async semerChamp(champ, nomCulture) {
        const culture = cultures[nomCulture];
        const machineName = culture.machines.find(m => m.includes('semeuse') || m.includes('planteuse'));
        const machine = await MachineManager.demanderMachine(machineName);
        console.log(`Semis de ${nomCulture} sur champ ${champ.numero}...`);
        await new Promise(resolve => setTimeout(resolve, 30000));
        champ.addPlant(nomCulture, culture.rendement);
        MachineManager.libererMachine(machine);
    }

    static async fertiliserChamp(champ) {
        const machine = await MachineManager.demanderMachine('fertilisateur');
        console.log(`Fertilisation du champ ${champ.numero}`);
        await new Promise(resolve => setTimeout(resolve, 30000));
        champ.addFertilisant();
        MachineManager.libererMachine(machine);
    }

    static async recolterChamp(champ) {
        const cultureName = champ.culture;
        const culture = cultures[cultureName];

        const moissonneuseName = culture.machines.find(m => m.includes('moissonneuse'));
        const moissonneuse = await MachineManager.demanderMachine(moissonneuseName);

        const remorqueName = culture.machines.find(m => m.includes('remorque'));

        console.log(`Récolte de ${cultureName} sur champ ${champ.numero}`);
        const result = champ.recolterPlant();

        await stockage.ajouter(result.culture, result.rendement);
        console.log(`Ajout de ${result.rendement}L de ${result.culture} au stockage`);

        MachineManager.libererMachine(moissonneuse);

        if (remorqueName) {
            const remorque = await MachineManager.demanderMachine(remorqueName);
            console.log(`Transport avec ${remorque.nom}`);
            MachineManager.libererMachine(remorque);
        }
    }
}

module.exports = AgricultureManager;
