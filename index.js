async function getDataExperience(){


  const options = {
      method: 'GET',
      headers: {
        cookie: 'BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=251070986.10062.0000; TS01585e85=01b3abf0a2600b9070e0208e6c69297328ff71af3418f75a7c004480c8586c5635b45b9f16e8d90766ea93053ba4214d2a03fad907',
        // authorisation à renouveler régulièrement(25min)
        Authorization: 'Bearer V6y-MVRveIBIErkSlOtVGSQFpaY'
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
      .catch(err => console.error(err));

      xp2 = xp2A + xp2B;
      return [xp1,xp2,xp3];
    
  }

  // fonction pour construire le graph => à terminer demain 
  async function drawGraphExperience () {
    let arrayXP = await getDataExperience();
    //Example--------------------
    let ctx = document.getElementById("chart").getContext("2d");
    let chart = new Chart(ctx, {
      type: "pie",
      data: {
            labels: ["Moins de 1 ans", "Entre 1-3 ans", "+3 ans"],
          datasets: [
        {
          label: "Annees d'Experience",
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 85,
          borderColor: '#000000',
          data: arrayXP
        }
     ]
  },
  options: {
     title: {
        text: "Breakdown of Dev Jobs in Nantes/Years experience",
        display: true
     }
  }
});
  } 
  

drawGraphExperience()


