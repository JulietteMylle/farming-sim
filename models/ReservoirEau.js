class ReservoirEau {
    constructor( capaciteMax = 20000, remplissageParMinute = 4000){
        this.capaciteMax = capaciteMax;
        this.niveau = 4000;
        this.remplissageParMinute = remplissageParMinute

        setInterval(() => {
            this.remplir();
        },  60 * 1000)
    }
    remplir() {
        const avant = this.niveau;
        this.niveau = Math.min(this.capaciteMax, this.niveau + this.remplissageParMinute);
        console.log(`[${new Date().toISOString()}] Réservoir rempli de ${this.niveau - avant} L. Niveau actuel : ${this.niveau} L`);
    }
    utiliser(quantite) {
        if (quantite > this.niveau) {
            console.log(`[${new Date().toISOString()}] Pas assez d'eau pour utiliser ${quantite} L.`);
            return false;
        }
        this.niveau -= quantite;
        // console.log(`[${new Date().toISOString()}] Utilisation de ${quantite} L d'eau. Niveau restant : ${this.niveau} L`);
        return true;
    }
     getNiveau() {
    return this.niveau;
  }
}
module.exports = new ReservoirEau();