const Usine = require('../models/Usine');

class UsineManager {
    constructor(){
        this.listeUsine = [];
        this.fileAttente = [];

        this.ajouterUsine('Moulin à huile', 'huile', 'tournesol', 2);
        this.ajouterUsine('Moulin à huile', 'huile', 'olive', 2);
        this.ajouterUsine('Moulin à huile', 'huile', 'canola', 2);
        this.ajouterUsine('Moulin à huile', 'huile', 'riz', 2);
        this.ajouterUsine('Scierie', 'planches', 'peuplier', 2)
        this.ajouterUsine('Fabrique de wagons', 'wagons', 'planches', 4);
        this.ajouterUsine('Usine de jouets', 'jouets', 'planches', 3);
        this.ajouterUsine('Moulin à grains', 'farine', 'blé', 2);
        this.ajouterUsine('Moulin à grains', 'farine', 'orge', 2);
        this.ajouterUsine('Moulin à grains', 'farine', 'sorgho', 2);
        this.ajouterUsine('Raffinerie de sucre', 'sucre', 'betterave', 2);
        this.ajouterUsine('Raffinerie de sucre', 'sucre', 'canne à sucre', 2);
        this.ajouterUsine('Filature', 'tissu', 'coton', 2);
        this.ajouterUsine('Atelier de couture', 'vêtements', 'tissu', 2);
        this.ajouterUsine('Cave à vin', 'vin', 'raisin', 2);
    }
    ajouterUsine(nom, resultat, besoin, multiplicateur){
        this.listeUsine.push(new Usine(nom, this.listeUsine.length + 1, resultat, besoin, multiplicateur))
    }
    demanderUsine(nom) {
        return new Promise((resolve) => {
            const usine = this.listeUsine.find(
                u => u.nom === nom && u.estDisponible()
            );

            if(usine) {
                usine.utiliser();
                return resolve(usine)
            }

            console.log(`Usine ${nom} indisponible, ajout dans la liste d'attente`);
            this.fileAttente.push({nom, resolve})
            
        })
    }
    notifierLiberationUsine(usineLiberee) {
        const index = this.fileAttente.findIndex(req => req.nom === usineLiberee.nom)

        if(index !== -1){
            const { resolve } = this.fileAttente.splice(index, 1)[0]
            usineLiberee.utiliser()
            resolve(usineLiberee)
        }
    }
    LibererUsine(usine){
        usine.liberer();
        this.notifierLiberationUsine(usine)
    }
}

module.exports = new UsineManager()