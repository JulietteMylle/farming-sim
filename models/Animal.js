const stockage = require('./Stockage');

class Animal {
    constructor(type) {
        this.type = type;
        this.herbe = 10;
        this.vivant = true;
        this.progressProduit = 0;
        this.progressFumier = 0;
    }

    getSpecs() {
        return {
            vache:  { produit: 'lait',  qte: 20, fumier: 5, eau: 3, herbe: 3 },
            mouton: { produit: 'laine', qte: 5,  fumier: 5, eau: 2, herbe: 2 },
            poule:  { produit: 'oeufs', qte: 1,  fumier: 0, eau: 1, herbe: 1 }
        }[this.type];
    }

    async consommeretProduire(stockage, reservoirEau) {
        if (!this.vivant) return;

        const spec = this.getSpecs();



        const assezEau = reservoirEau.utiliser(spec.eau);
        const assezHerbe = await stockage.retirer('herbe', spec.herbe);




        if (!assezEau || !assezHerbe) {
            this.herbe -= spec.herbe;
            console.log(`[AVERTISSEMENT] ${this.type} n’a pas assez à manger ou boire. Herbe interne = ${this.herbe}`);
        } else {
            if (this.herbe > 10) this.herbe = 10;
            
        }

        // Vérification de vie
        if (this.herbe < -5) {
            this.vivant = false;
            console.log(`💀 Un(e) ${this.type} est mort(e) de faim.`);
            return;
        }

        // Trop faible pour produire
        if (this.herbe < 0) {
            console.log(`${this.type} en sous-alimentation. Production suspendue.`);
            return;
        }


        this.progressProduit += spec.qte;
        this.progressFumier += spec.fumier;


        if (this.progressProduit >= 1) {
            const aStocker = Math.floor(this.progressProduit);
            this.progressProduit -= aStocker;
            await stockage.ajouter(spec.produit, aStocker);

        }

        if (spec.fumier > 0 && this.progressFumier >= 1) {
            const aFumier = Math.floor(this.progressFumier);
            this.progressFumier -= aFumier;
            await stockage.ajouter('fumier', aFumier);

        }
    }
}

module.exports = Animal;
