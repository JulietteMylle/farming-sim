class Machine {
    constructor(numero, type, nom) {
        this.numero = numero;
        this.nom = nom;
        this.type = type;
        this.utilise = false;
    }

    utiliser(){
        if(this.utilise){
            console.log(`[${new Date().toISOString()}]La machine ${this.type} numero ${this.numero} est déjà utilisée`);
            return false
        }
        this.utilise = true;
        return true
    }
    liberer() {
        this.utilise = false;
        console.log(` [${new Date().toISOString()}]Machine ${this.type} ${this.numero} est libérée.`);
    }
    estDisponible() {
        return !this.utilise;
    }
}
module.exports = Machine;