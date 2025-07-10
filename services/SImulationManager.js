const Champ = require('../models/Champ')
const AgricultureManager = require('./AgricultureManager')
const UsineManager = require('./UsineManager');
const stockage = require('../models/Stockage')
const cultures = require('../data/cultures')

class SimulationManager {
    constructor(){
        this.champs = [];
        for (let i = 1; i <= 100; i++) {
            this.champs.push(new Champ(i));
        }
        this.lancerSimulation()
        this.surveillerChamp();
        this.usineProduire();
    }
   async lancerSimulation() {
    const promises = this.champs.map(champ => {
        const culture = this.choisirCultureAleatoire();
        return this.lancerPordutionChamp(champ, culture);
    });

    await Promise.all(promises);
}
    async lancerPordutionChamp(champ, nomCulture){
        try{
            await AgricultureManager.labourerChamp(champ);
            await AgricultureManager.semerChamp(champ, nomCulture);
            await AgricultureManager.fertiliserChamp(champ);
            

        } catch(err) {
            console.error(` Erreur sur champ ${champ.numero} :`, err);
        }

    }
    choisirCultureAleatoire() {
    const noms = Object.keys(cultures);
    if (noms.length === 0) {
        console.warn("Pas de culture définie !");
        return undefined;
    }
    const index = Math.floor(Math.random() * noms.length);
    return noms[index];
}
    surveillerChamp(){
        setInterval(async() => {
            for (const champ of this.champs) {
                if (champ.etat === "prêt à récolter"){
                    await AgricultureManager.recolterChamp(champ)
                    const encore = this.choisirCultureAleatoire()
                    await this.lancerPordutionChamp(champ, encore);
                }
            }
        }, 10 * 1000)
    }

    usineProduire() {
        setInterval(async() => {
            for (const usine of UsineManager.listeUsine) {
                if (usine.estDisponible()) {
                    usine.utiliser();
                    await usine.produire(stockage);
                    UsineManager.LibererUsine(usine);
                }
            }
            
        })
    }

}
module.exports = new SimulationManager();