const entrepot = require('./Entrepôt');

class Usine {
  constructor(nom, numero, produits, intrants, multiplicateur = 1, vendre = false) {
    this.nom = nom;
    this.numero = numero;
    this.produits = produits;
    this.intrants = intrants; 
    this.multiplicateur = multiplicateur;
    this.vendre = vendre;
    this.utilise = false;
    this.capaciteParSeconde = 100;
  }

  utiliser() {
    if (this.utilise) {
      console.log(`[${new Date().toISOString()}]L'usine ${this.nom} est déjà utilisée`);
      return false;
    }
    this.utilise = true;
    return true;
  }

  liberer() {
    this.utilise = false;
  }

  estDisponible() {
    return !this.utilise;
  }

  async produire(stockage) {
    const quantite = this.capaciteParSeconde;

    const contenu = await stockage.lister();

    for (const [intrant, qte] of Object.entries(this.intrants)) {
      const ligne = contenu.find(item => item.type === intrant);
      if (!ligne || ligne.quantite < qte * this.multiplicateur) {

        return;
      }
    }

    if (!this.vendre) {
      const totalProduit = Object.values(this.produits).reduce((acc, v) => acc + v, 0) * this.multiplicateur;
      const dispoEntrepot = await entrepot.getEspaceDisponible();
      if (dispoEntrepot < totalProduit) {
        console.log(`[${new Date().toISOString()}] Entrepôt plein. L'usine ${this.nom} est mise en pause.`);
        return;
      }
    }


    for (const [intrant, qte] of Object.entries(this.intrants)) {
      await stockage.retirer(intrant, qte * this.multiplicateur);
    }


    await new Promise(resolve => setTimeout(resolve, 1000));


    for (const [produit, qte] of Object.entries(this.produits)) {
      const qteFinale = qte * this.multiplicateur;

      if (this.vendre) {

        await stockage.ajouter('or', qteFinale);
        console.log(`[${new Date().toISOString()}] Usine ${this.nom} a vendu ${qteFinale} de ${produit} et gagné ${qteFinale} or`);
      } else {
        await entrepot.ajouter(produit, qteFinale);
        console.log(`[${new Date().toISOString()}] Usine ${this.nom} a produit ${qteFinale} de ${produit} (stocké dans l'entrepôt)`);
      }
    }
  }
}

module.exports = Usine;
