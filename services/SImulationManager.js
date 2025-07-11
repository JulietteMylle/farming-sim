const Champ = require('../models/Champ');
const AgricultureManager = require('./AgricultureManager');
const UsineManager = require('./UsineManager');
const stockage = require('../models/Stockage');
const cultures = require('../data/cultures');
const reservoirEau = require('../models/ReservoirEau');
const AnimalManager = require('./AnimalManager');
const Serre = require('../models/Serre');
const SerreManager = require('./SerreManager');

class SimulationManager {
    constructor() {
        this.champs = [];
        this.fermesAnimales = [];
        this.serres = [];

        for (let i = 1; i <= 100; i++) {
            this.champs.push(new Champ(i));
        }

        for (let i = 1; i <= 5; i++) {
            const ferme = new AnimalManager(i);
            this.fermesAnimales.push(ferme);
        }

        for (let i = 1; i <= 10; i++) {
            this.serres.push(new Serre(i));
        }

        this.initialiserOr().then(() => {
            this.lancerSimulation();
            this.surveillerChamp();
            this.usineProduire();
            this.gererSerresCycle();
            this.essayerAjouterAnimaux();
            this.produireAnimaux();
        });
    }
    async initialiserOr() {
        const orActuel = await stockage.getQuantite('or');
        if (orActuel < 100) {
            const aAjouter = 100 - orActuel;
            await stockage.ajouter('or', aAjouter);
            console.log(`[Simulation] Initialisation : ajout de ${aAjouter} unités d'or au stockage.`);
        }
    }

    async essayerAjouterAnimaux() {
        const quantiteHerbe = await stockage.getQuantite('herbe') || 0;
        console.log(`[Simulation] Tentative d'ajout des animaux. Herbe dispo : ${quantiteHerbe}`);
        if (quantiteHerbe > 0) {
            for (const ferme of this.fermesAnimales) {
                await ferme.ajouterAnimal('vache');
                await ferme.ajouterAnimal('mouton');
                await ferme.ajouterAnimal('poule');
            }
            console.log(`[Simulation] Animaux ajoutés avec succès.`);
        } else {
            console.log(`[Simulation] Pas assez d'herbe, nouvelle tentative dans 3 minutes...`);
            setTimeout(() => this.essayerAjouterAnimaux(), 6 * 30 * 1000);
        }
    }

    async lancerSimulation() {
        const promises = this.champs.map(champ => {
            const culture = this.choisirCultureAleatoire();
            return this.lancerPordutionChamp(champ, culture);
        });
        await Promise.all(promises);
    }

    async lancerPordutionChamp(champ, nomCulture) {
        try {
            await AgricultureManager.labourerChamp(champ);
            await AgricultureManager.semerChamp(champ, nomCulture);
            await AgricultureManager.fertiliserChamp(champ);
        } catch (err) {
            console.error(`Erreur sur champ ${champ.numero} :`, err);
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

    surveillerChamp() {
        setInterval(async () => {
            for (const champ of this.champs) {
                if (champ.etat === "prêt à récolter") {
                    await AgricultureManager.recolterChamp(champ);
                    const encore = this.choisirCultureAleatoire();
                    await this.lancerPordutionChamp(champ, encore);
                }
            }
        }, 10 * 1000);
    }

    usineProduire() {
        setInterval(async () => {
            for (const usine of UsineManager.listeUsine) {
                if (usine.estDisponible()) {
                    usine.utiliser();
                    await usine.produire(stockage);
                    UsineManager.libererUsine(usine);
                }
            }
        }, 1000);
    }

    produireAnimaux() {
        setInterval(async () => {
            const quantiteHerbe = await stockage.getQuantite('herbe') || 0;
            if (quantiteHerbe > 0) {
                for (const ferme of this.fermesAnimales) {
                    await ferme.produire();
                }
            }
        }, 1000);
    }

    gererSerresCycle() {
        setInterval(async () => {
            console.log(`[Simulation] Cycle gestion serres démarré à ${new Date().toISOString()}`);
            await SerreManager.gererSerres(this.serres);
        }, 60 * 1000);
    }
}

module.exports = new SimulationManager();
