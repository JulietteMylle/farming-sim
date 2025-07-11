class Usine {
    constructor(nom, numero, resultat, besoin, multiplicateur, vendre = false){
        this.nom = nom;
        this.numero = numero;
        this.resultat = resultat;
        this.besoin = besoin;
        this.multiplicateur = multiplicateur;
        this.vendre = vendre;
        this.utilise = false;
        this.capaciteParSeconde = 100;
    }
    utiliser(){
        if(this.utilise){
            console.log(`[${new Date().toISOString()}]L'usine ${nom} est déjà utilisée`);
            return false
        }
        this.utilise = true;
        return true
    }
    liberer() {
        this.utilise = false;

        
    }
    estDisponible(){
        return !this.utilise
    }
    async produire(stockage) {
        const quantite = this.capaciteParSeconde;

        const contenu = await stockage.lister();
        const ligne = contenu.find(item => item.type === this.besoin);
        if (!ligne || ligne.quantite < quantite) {
            return;
        }

        const produitFinal = quantite * this.multiplicateur;
        const dispo = await stockage.getEspaceDisponible();

        if (this.vendreEnOr) {
            await stockage.retirer(this.besoin, quantite);
            await stockage.ajouter('or', produitFinal);
            console.log(`[${new Date().toISOString()}]Usine ${this.nom} a vendu ${produitFinal}L de ${this.besoin} et gagné ${produitFinal} or`);
            return;
        }

        if (dispo < produitFinal) {
            console.log(`[${new Date().toISOString()}]Stockage plein. L'usine ${this.nom} est mise en pause.`);
            return;
        }
        await stockage.retirer(this.besoin, quantite);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await stockage.ajouter(this.resultat, produitFinal);
        console.log(`[${new Date().toISOString()}]Usine ${this.nom} a transformé ${quantite}L de ${this.besoin} en ${produitFinal}L de ${this.resultat}`);
    }
}

module.exports = Usine