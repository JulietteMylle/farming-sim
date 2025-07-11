const reservoirEau = require('./ReservoirEau');

class Serre {
    constructor(numero){
        this.numero = numero;
        this.etat = 'récolté';
        this.besoin = 15
        this.estMature = false;
    }
   async addPlant(rendement){
    if(this.etat === 'récolté'){
        const besoinTotal = this.besoin * 60 * 5;
        const disponible = await reservoirEau.getNiveau();
        if (disponible < besoinTotal) {
            console.log(`[${new Date().toISOString()}] Pas assez d’eau pour planter dans la serre ${this.numero}`);
            return;
        }
        await reservoirEau.utiliser(besoinTotal);

        this.culture = "fraise";
        this.etat = "semé";
        this.rendement = rendement;
        this.estMature = false;
        console.log(`[${new Date().toISOString()}] Plantation de ${this.culture} dans la serre numéro ${this.numero}`);

        setTimeout(() => {
            this.estMature = true;
            this.etat = "prêt à récolter";
        }, 5 * 60 * 1000);
    }
}
}
module.exports = Serre;