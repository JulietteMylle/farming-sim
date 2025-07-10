class Usine {
    constructor(nom, numero, resultat, besoin, multiplicateur){
        this.nom = nom;
        this.numero = numero;
        this.resultat = resultat;
        this.besoin = besoin;
        this.multiplicateur = multiplicateur;
        this.utilise = false;
        this.capaciteParSeconde = 100;
    }
    utiliser(){
        if(this.utilise){
            console.log(`L'usine ${nom} est déjà utilisée`);
            return false
        }
        this.utilise = true;
        return true
    }
    liberer() {
        this.utilise = false;
        console.log(`L'usine ${nom} est libérée`);
        
    }
    estDisponible(){
        return !this.utilise
    }
    async produire(stockage){
        const quantite = this.capaciteParSeconde

        const contenu = await stockage.lister();
        const ligne = contenu.find(item => item.type === this.besoin);
        if (!ligne || ligne.quantite < quantite) {
            console.log(`Pas assez de ${this.besoin} dans le stockage.`);
            return;
        }

        const produitFinal = quantite * this*multiplicateur
        const dispo = await stockage.getEspaceDisponible();
        if (dispo < produitFinal) {
            console.log(`Stockage plein. L'usine ${this.nom} est mise en pause.`);
            return;   
        }
        await stockage.retirer(this.besoin, quantite)
        await new Promise(resolve => setTimeout(resolve, 1000));
        await stockage.ajouter(this.resultat, produitFinal);
        console.log(`Usine ${this.nom} a transformé ${quantite}L de ${this.besoin} en ${produitFinal}L de ${this.resultat}`);
    }
}

module.exports = Usine