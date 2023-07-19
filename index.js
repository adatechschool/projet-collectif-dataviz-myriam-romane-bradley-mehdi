async function getDataExperience(){


  const options = {
      method: 'GET',
      headers: {
        cookie: 'BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=251070986.10062.0000; TS01585e85=01b3abf0a2600b9070e0208e6c69297328ff71af3418f75a7c004480c8586c5635b45b9f16e8d90766ea93053ba4214d2a03fad907',
        // authorisation à renouveler régulièrement(25min)
        Authorization: 'Bearer PSG8PEzjhtR1yhDuSrm4nzx7pR4'
      }
    };

    //var pour stocker les données fetch
    var xp1;
    var xp2A;
    var xp2B;
    var xp2;
    var xp3;
 
    //fetch pour récupérer tous les jobs qui répondent au ROME 1805 de Nantes avec -1 an d'XP sur 1mois
    await fetch('https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&experience=1&publieeDepuis=31&commune=44109', options)
      .then(response => response.json())
      .then(response => {
      xp1 = response.resultats.length;    //"resultats" est retourné dans la console, il donne le nombre d'éléments du tableau
      console.log(xp1)    //on attend que les .then s'effectuent puis on appelle console.log de xp1 pour afficher le resultat 
      })  
      .catch(err => console.error(err));

    
      //fetch pour récupérer tous les jobs qui répondent au ROME 1805 de Nantes avec de 1 à 3 ans d'XP sur 1mois (0-149)
      await fetch('https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&experience=2&publieeDepuis=31&commune=44109&range=0-149', options)
      .then(response => response.json())
      .then(response => {
        xp2A = response.resultats.length;
        console.log(xp2A)
      })
      .catch(err => console.error(err));

      //fetch pour récupérer tous les jobs qui répondent au ROME 1805 de Nantes avec de 1 à 3 ans d'XP sur 1mois (+150)
      await fetch('https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&experience=2&publieeDepuis=31&commune=44109&range=150-299', options)
      .then(response => response.json())
      .then(response => {
        xp2B = response.resultats.length;
        console.log(xp2B)
      })
      .catch(err => console.error(err));

      //fetch pour récupérer tous les jobs qui répondent au ROME 1805 de Nantes avec +3 ans d'XP sur 1mois (0-149)
     await fetch('https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&experience=3&publieeDepuis=31&commune=44109', options)
      .then(response => response.json())
      .then(response => {
        xp3 = response.resultats.length;
        console.log(xp3)
      })
      .then(() =>  {
        xp2 = xp2A + xp2B;
        console.log(xp2)
      })
      .catch(err => console.error(err));

      // await () => xp2 = xp2A + xp2B;
    
  }

  getDataExperience();