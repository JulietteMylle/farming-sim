const Champ = require('../models/Champ')
const AgricultureManager = require('./AgricultureManager')
const UsineManager = require('./UsineManager');
const stockage = require('../models/Stockage')
const cultures = require('../data/cultures')

class SimulationManager {
    constructor(){
        this.champs = [
            new Champ(1),
            new Champ(2),
            new Champ(3),
            new Champ(4),
            new Champ(5),
            new Champ(6),
            new Champ(7),
            new Champ(8),
            new Champ(9),
            new Champ(10),
            new Champ(11),
            new Champ(12),
            new Champ(13),
            new Champ(14),
            new Champ(15),
            new Champ(16),
            new Champ(17),
            new Champ(18),
            new Champ(19),
            new Champ(20),
            new Champ(21),
            new Champ(22),
            new Champ(23),
            new Champ(24),
            new Champ(25),
            new Champ(26),
            new Champ(27),
            new Champ(28),
            new Champ(29),
            new Champ(30),
            new Champ(31),
            new Champ(32),
            new Champ(33),
            new Champ(34),
            new Champ(35),
            new Champ(36),
            new Champ(37),
            new Champ(38),
            new Champ(39),
            new Champ(40),
            new Champ(41),
            new Champ(42),
            new Champ(43),
            new Champ(44),
            new Champ(45),
            new Champ(46),
            new Champ(47),
            new Champ(48),
            new Champ(49),
            new Champ(50),
            new Champ(51),
            new Champ(52),
            new Champ(53),
            new Champ(54),
            new Champ(55),
            new Champ(56),
            new Champ(57),
            new Champ(58),
            new Champ(59),
            new Champ(60),
            new Champ(61),
            new Champ(62),
            new Champ(63),
            new Champ(64),
            new Champ(65),
            new Champ(66),
            new Champ(67),
            new Champ(68),
            new Champ(69),
            new Champ(70),
            new Champ(71),
            new Champ(72),
            new Champ(73),
            new Champ(74),
            new Champ(75),
            new Champ(76),
            new Champ(77),
            new Champ(78),
            new Champ(79),
            new Champ(80),
            new Champ(81),
            new Champ(82),
            new Champ(83),
            new Champ(84),
            new Champ(85),
            new Champ(86),
            new Champ(87),
            new Champ(88),
            new Champ(89),
            new Champ(90),
            new Champ(91),
            new Champ(92),
            new Champ(93),
            new Champ(94),
            new Champ(95),
            new Champ(96),
            new Champ(97),
            new Champ(98),
            new Champ(99),
            new Champ(100)
        ];
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