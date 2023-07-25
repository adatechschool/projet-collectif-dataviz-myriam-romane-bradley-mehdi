
//The loops for searching the data to find how many job 
//offers with each type of contract
let typeContrat = {
    CDD : [],
    CDI : [],
    Interim : [],
    Apprentissage : [],
    Alternance : []
}
let nbOffresTrouvees=0;
let nbOffresParTypeContrat=[];
for (const contrat in typeContrat) {
    let counter = 0;
    for (let i =0; i<finalArray.length; i++) {
        let string = JSON.stringify(finalArray[i]);
        let search=0;
        typeContrat[contrat].forEach(element => { 
            if(string.indexOf(element) != -1) {
                search++;
            }
        });
        if (search > 0) {
            counter++;
        }
    }
    if (counter !== 0) {
        nbOffresTrouvees+=counter;
        console.log(`nombre d'offres ${contrat} : ${counter}`);
        nbOffresParTypeContrat.push(counter);
    }
}