class Machine {
    constructor(numero, type, nom) {
        this.numero = numero;
        this.nom = nom;
        this.type = type;
        this.utilise = false;
    }

    utiliser(){
        if(this.utilise){
            console.log(`La machine ${this.type} numero ${this.numero} est déjà utilisée`);
            return false
        }
        this.utilise = true;
        return true
    }
    liberer() {
        this.utilise = false;
        console.log(` Machine ${this.type} ${this.numero} est libérée.`);
    }
    estDisponible() {
        return !this.utilise;
    }
}
module.exports = Machine;