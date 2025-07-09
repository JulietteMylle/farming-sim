const Machine = require('../models/Machines');

class MachineManager {
    constructor() {
        this.listeMachines = [];
        this.fileAttente = [];

        this.ajouterMachines('tracteur', 5, 'tracteur');
        this.ajouterMachines('remorque', 3, 'remorque');
        this.ajouterMachines('moissonneuse', 2, 'moissonneuse');
        this.ajouterMachines('charrue', 2, 'charrue');
        this.ajouterMachines('fertilisateur', 2, 'fertilisateur');
        this.ajouterMachines('moissonneuse à raisin', 1, 'moissonneuse');
        this.ajouterMachines('planteuse à arbre', 2, 'planteuse');
        this.ajouterMachines('moissonneuse à olive', 1, 'moissonneuse');
        this.ajouterMachines('planteuse à pomme de terre', 1, 'planteuse');
        this.ajouterMachines('moissonneuse à pomme de terre', 1, 'moissonneuse');
        this.ajouterMachines('moissonneuse à coton', 1, 'moissonneuse');
        this.ajouterMachines('remorque semi', 1, 'remorque');
        this.ajouterMachines('planteuse à canne', 1, 'planteuse');
        this.ajouterMachines('moissonneuse à canne', 1, 'moissonneuse');
        this.ajouterMachines('moissonneuse à arbre', 1, 'moissonneuse');
    }

    ajouterMachines(nom, quantité, type) {
        for (let i = 0; i < quantité; i++) {
            this.listeMachines.push(new Machine(this.listeMachines.length + 1, type, nom));
        }
    }
    demanderMachine(nom) {
        return new Promise((resolve) => {
            const machine = this.listeMachines.find(
                m => m.nom === nom && m.estDisponible()
            );

            if (machine) {
                machine.utiliser();
                return resolve(machine);
            }


            console.log(` Machine "${nom}" indisponible. Ajout dans la file d’attente.`);
            this.fileAttente.push({ nom, resolve });
        });
    }
    notifierLiberationMachine(machineLiberee) {
        const index = this.fileAttente.findIndex(req => req.nom === machineLiberee.nom);

        if (index !== -1) {
            const { resolve } = this.fileAttente.splice(index, 1)[0];
            machineLiberee.utiliser();
            resolve(machineLiberee);
        }
    }
    libererMachine(machine) {
        machine.liberer();
        this.notifierLiberationMachine(machine);
    }
    
}

module.exports = new MachineManager();
