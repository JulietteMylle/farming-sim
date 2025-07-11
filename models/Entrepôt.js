class Entrepot {
    constructor() {
        this.capacite = 50000;
        this.contenu = [];
    }

    async ajouter(type, quantite) {
        const dispo = await this.getEspaceDisponible();
        if (dispo < quantite) return false;

        const ligne = this.contenu.find(item => item.type === type);
        if (ligne) {
            ligne.quantite += quantite;
        } else {
            this.contenu.push({ type, quantite });
        }
        return true;
    }

    async retirer(type, quantite) {
        const ligne = this.contenu.find(item => item.type === type);
        if (!ligne || ligne.quantite < quantite) return false;
        ligne.quantite -= quantite;
        return true;
    }

    async getEspaceDisponible() {
        const total = this.contenu.reduce((sum, item) => sum + item.quantite, 0);
        return this.capacite - total;
    }

    async lister() {
        return this.contenu;
    }
}


module.exports = new Entrepot();