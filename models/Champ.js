class Champ {
    constructor(numero) {
        this.numero = numero;
        this.etat = 'récolté';
        this.culture = null;
        this.rendement = null;
        this.estMature = false;
    }
    addPlant(culture, rendement) {
    if (this.etat === "labouré") {
        this.culture = culture;
        this.etat = "semé";
        this.rendement = rendement;
        this.estMature = false;
        console.log(`Plantation de ${culture} sur le champ numéro ${this.numero}`);


        setTimeout(() => {
            this.estMature = true;
            this.etat = "prêt à récolter";
        }, 2 * 60 * 1000); 
    }
}
    plantMature(){
        if (this.etat === "fertilisé") {
            this.etat = "prêt à récolter"
        }
    }

    addFertilisant() {
    if (this.etat === "semé" && !this.estMature) {
        this.etat = "fertilisé";
        this.rendement *= 1.5;
        this.rendement = Math.round(this.rendement);
        console.log(`Le champ numéro ${this.numero} a été fertilisé`);
    } else if (this.estMature) {
        console.log(`Trop tard ! La culture sur le champ ${this.numero} est déjà mature. Fertilisation impossible.`);
    } else {
        console.log(`Le champ ${this.numero} ne peut pas être fertilisé dans son état actuel : ${this.etat}`);
    }
}
    recolterPlant() {
        if (this.etat === "prêt à récolter"){
            const recolte = this.culture;
            const rendement = this.rendement
            this.culture = null;
            this.rendement = null;
            this.etat = "récolté"
            console.log(`Récolte de ${culture} sur le champ ${this.numero} avec un rendement de ${rendement}`);
            return { culture: recolte, rendement: rendement };
        }
    }
}
module.exports = Champ;