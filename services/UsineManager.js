const Usine = require('../models/Usine');

class UsineManager {
  constructor(){
    this.listeUsine = [];
    this.fileAttente = [];


    this.ajouterUsine('Moulin à huile', { huile: 1 }, { tournesol: 1 }, 2, true);
    this.ajouterUsine('Moulin à huile', { huile: 1 }, { olive: 1 }, 2, true);
    this.ajouterUsine('Moulin à huile', { huile: 1 }, { canola: 1 }, 2, true);
    this.ajouterUsine('Moulin à huile', { huile: 1 }, { riz: 1 }, 2, true);
    this.ajouterUsine('Scierie', { planches: 1 }, { peuplier: 1 }, 2, false);
    this.ajouterUsine('Fabrique de wagons', { wagons: 1 }, { planches: 1 }, 4, true);
    this.ajouterUsine('Usine de jouets', { jouets: 1 }, { planches: 1 }, 3, true);
    this.ajouterUsine('Moulin à grains', { farine: 1 }, { blé: 1 }, 2, false);
    this.ajouterUsine('Moulin à grains', { farine: 1 }, { orge: 1 }, 2, false);
    this.ajouterUsine('Moulin à grains', { farine: 1 }, { sorgho: 1 }, 2, false);
    this.ajouterUsine('Raffinerie de sucre', { sucre: 1 }, { 'betterave': 1 }, 2, false);
    this.ajouterUsine('Raffinerie de sucre', { sucre: 1 }, { 'canne à sucre': 1 }, 2, false);
    this.ajouterUsine('Filature', { tissu: 1 }, { coton: 1 }, 2, false);
    this.ajouterUsine('Atelier de couture', { vêtements: 1 }, { tissu: 1 }, 2, false);
    this.ajouterUsine('Cave à vin', { vin: 1 }, { raisin: 1 }, 2, true);
    this.ajouterUsine('Usine de fumier', { fertilisant: 1 }, { fumier: 1 }, 1, false);

    this.ajouterUsine('Laiterie', { 'lait stérilisé': 1 }, { lait: 1 }, 1, false);
    this.ajouterUsine('Laiterie', { beurre: 1 }, { lait: 1 }, 1, false);
    this.ajouterUsine('Chocolaterie', { chocolat: 600 }, { cacao: 100, sucre: 100, lait: 100 }, 2, false);
    this.ajouterUsine('Boulangerie', { gateau: 1 }, { sucre: 1, 'lait stérilisé': 1, farine: 1, oeufs: 1, beurre: 1, chocolat: 1, fraises: 1 }, 18, true);
    this.ajouterUsine('Atelier de couture', { vêtements: 1 }, { tissu: 1, laine: 1 }, 4, true);
  }

  ajouterUsine(nom, produits, intrants, multiplicateur, vendreEnOr) {
    const usine = new Usine(nom, this.listeUsine.length + 1, produits, intrants, multiplicateur, vendreEnOr);
    this.listeUsine.push(usine);
  }

  demanderUsine(nom) {
    return new Promise((resolve) => {
      const usine = this.listeUsine.find(
        u => u.nom === nom && u.estDisponible()
      );

      if(usine) {
        usine.utiliser();
        return resolve(usine);
      }

      console.log(`[${new Date().toISOString()}] Usine ${nom} indisponible, ajout dans la liste d'attente`);
      this.fileAttente.push({nom, resolve});
    });
  }

  notifierLiberationUsine(usineLiberee) {
    const index = this.fileAttente.findIndex(req => req.nom === usineLiberee.nom);

    if(index !== -1){
      const { resolve } = this.fileAttente.splice(index, 1)[0];
      usineLiberee.utiliser();
      resolve(usineLiberee);
    }
  }

  libererUsine(usine){
    usine.liberer();
    this.notifierLiberationUsine(usine);
  }
}

module.exports = new UsineManager();
