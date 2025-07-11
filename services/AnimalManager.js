const Animal = require('../models/Animal')
const stockage = require('../models/Stockage');
const reservoirEau = require('../models/ReservoirEau');


class AnimalManager {
    constructor(parcelleId) {
        this.parcelleId = parcelleId;
        this.animaux = [];
        this.maxAnimaux = 10;
    }

    getCoutAnimal(type) {
        const couts = {
            vache: 10,
            mouton: 5,
            poule: 1
        };
        return couts[type];
    }

    async ajouterAnimal(type) {
        if (this.animaux.length >= this.maxAnimaux) {
            console.log(`La parcelle ${this.parcelleId} contient déjà le maximum d’animaux`);
            return false;
        }

        const cout = this.getCoutAnimal(type);
        const orDisponible = await stockage.getQuantite('or');

        if (orDisponible < cout) {
            console.log(`Pas assez d’or pour ajouter un(e) ${type} (coût : ${cout} or, dispo : ${orDisponible} or)`);
            return false;
        }

        const retraitOk = await stockage.retirer('or', cout);
        if (!retraitOk) {
            console.log(`Échec du retrait d’or pour un(e) ${type}`);
            return false;
        }

        const nouvelAnimal = new Animal(type);
        this.animaux.push(nouvelAnimal);
        console.log(`${type} ajouté(e) à la parcelle ${this.parcelleId}. Or restant : ${orDisponible - cout}`);
        return true;
    }

    async produire() {

        for (const animal of this.animaux) {
            await animal.consommeretProduire(stockage, reservoirEau);
        }
    }

  }

module.exports = AnimalManager;