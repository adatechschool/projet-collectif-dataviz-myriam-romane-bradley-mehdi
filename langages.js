
// générer la clé automatiquement dès le lancement du script
async function generateKey () {
    let key;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Cookie", "BIGipServerPOOL_PROD02-SDDC-K8S_HTTPS=!MzbYYzVoy1TgqwhRqEhkI+kwdf49cAqOF/3/Rf38tGGA9DXgXG1RUtN+om+n1GQ37s7eKBdKSu8fzA==; TS0188135e=01b3abf0a271a2e5229e9250dfce06c5f7be79e4ed8113e82da3192d205f8b502bc42baf5122ea5c917d27e5703faae60a44fdccdb; so007-peame-affinity-prod-p=5ac58ed77574300");
  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("client_id", "PAR_chooseyourcareer_a46a7e7b1492ea6ed52a59cf346f1e33edede550782465e066b5fab7450b54c6");
  urlencoded.append("client_secret", "58dd8113d15f686a383c0fb3109a1e0d6be821c667b63d9172c265a8beccfde6");
  urlencoded.append("scope", "api_offresdemploiv2 o2dsoffre");
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  await fetch("https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=/partenaire", requestOptions)
    .then(response => response.json())
    .then(result => key = result.access_token)
    .catch(error => console.log('error', error));
    console.log(key)
    return key
  }
  
  async function getDataLangages(token){
    const requestOptions = {
        method: 'GET',
        headers: {
          cookie: 'BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=251070986.10062.0000; TS01585e85=01b3abf0a2600b9070e0208e6c69297328ff71af3418f75a7c004480c8586c5635b45b9f16e8d90766ea93053ba4214d2a03fad907',
          // authorisation à renouveler régulièrement(25min)
          Authorization: `Bearer ${token}`
        }
      };

      arrayLangages = [
        "java",
        "C++",
        "php",
        "javascript",
        "ruby",
        "python"
    ]

    let offersByLangage = [];
    let range = 0;
    for (langage of arrayLangages) {
      //fetch pour récupérer tous les jobs qui répondent au ROME 1805 de Nantes et correspondant à un langage donné
        try {
            let data = await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&publieeDepuis=31&departement=44&motsCles=${langage}&range=${range}-${range+149}`, requestOptions)
            let response = await data.json();
            let result = await response.resultats;
            let accumulator = await result.length;
            while (accumulator>=150) {
            range+=150;
            let data = await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&publieeDepuis=31&departement=44&motsCles=${langage}&range=${range}-${range+149}`, requestOptions)
            let result2 = await data.json().resultats;
            accumulator = await accumulator + result2.length;
            }
            offersByLangage.push(accumulator);
            console.log(`nombre d'offres ${langage} : ${accumulator}`);
        } catch (error) {
            offersByLangage.push(0);
            console.log(`ERREUR nombre d'offres ${langage} : 0`);
        }
    }

    console.log(offersByLangage);

}
/*
    // fonction pour construire le graph => à terminer demain 
    async function drawGraphExperience (token) {
      var arrayXP = await getDataExperience(token); 
  
        var data = [{
          data: arrayXP,
          backgroundColor: [
            "#4B77A9",
            "#5F255F",
            "#D21243"
          ],
          borderColor: "#fff"
        }];
        var options = {
          tooltips: {
            enabled: true
          },
          plugins: {
            datalabels: {
              //permet de transformer les données en pourcentages
              formatter: (value, ctx) => {
                let sum = ctx.dataset._meta[0].total; //demander pour _meta[0]
               // let sum = data[0].data.reduce((accumulator, currentValue) => accumulator + currentValue,0);     n'adapte pas les %
                let percentage = (value * 100 / sum).toFixed(0) + "%";  //.toFixed(0) permet d'arrondir sans avoir de chiffres à virgule
                return percentage;
              },
              color: '#fff',
            }
          }
        };
  
         var ctx = document.getElementById("pieChartExperience").getContext('2d');
        var myChart = new Chart(ctx, {
          type: 'pie',
          data: {
          labels: ['< 1 an>', 'Entre 1 et 3 ans', '+3 ans'],
            datasets: data
          },
          options: options
        });
          }
  */
  async function execution(){
  let keyResult = await generateKey();
  await getDataLangages(keyResult);
  }
  
  execution();