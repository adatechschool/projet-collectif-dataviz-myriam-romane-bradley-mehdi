

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

async function getDepartement() {
  var departement= document.getElementById("departement").value.toString() ;
 return departement}

async function getDataExperience(token){
  let codePostal = await getDepartement()
  const options = {
      method: 'GET',
      headers: {
        cookie: 'BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=251070986.10062.0000; TS01585e85=01b3abf0a2600b9070e0208e6c69297328ff71af3418f75a7c004480c8586c5635b45b9f16e8d90766ea93053ba4214d2a03fad907',
        // authorisation à renouveler régulièrement(25min)
        Authorization: `Bearer ${token}`
      }
    };

    //var pour stocker les données fetch
    var xp1;
    var xp2A;
    var xp2B;
    var xp2;
    var xp3;

 
    //fetch pour récupérer tous les jobs qui répondent au ROME 1805 de Nantes avec -1 an d'XP sur 1mois
    await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&experience=1&publieeDepuis=31&departement=${codePostal}`, options)
      .then(response => response.json())
      .then(response => {
      xp1 = response.resultats.length;    //"resultats" est retourné dans la console, il donne le nombre d'éléments du tableau
      console.log(xp1)    //on attend que les .then s'effectuent puis on appelle console.log de xp1 pour afficher le resultat 
      })  
      .catch(err => console.error(err));
    
      //fetch pour récupérer tous les jobs qui répondent au ROME 1805 de Nantes avec de 1 à 3 ans d'XP sur 1mois (0-149)
      await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&experience=2&publieeDepuis=31&departement=${codePostal}`, options)
      .then(response => response.json())
      .then(response => {
        xp2A = response.resultats.length;
        console.log(xp2A)
      })
      .catch(err => console.error(err));

      //fetch pour récupérer tous les jobs qui répondent au ROME 1805 de Nantes avec de 1 à 3 ans d'XP sur 1mois (+150)
      await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&experience=3&publieeDepuis=31&departement=${codePostal}`, options)
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
  async function drawGraphExperience (token) {
    if(document.getElementById("ChartExperience")) {
      document.getElementById("ChartExperience").remove();
    }
    var arrayXP = await getDataExperience(token); 

      var data = [{
        data: arrayXP,
        backgroundColor: [
          "#2a9d8f",
          "#e9c46a",
          "#e76f51",
        ],
        borderColor: "#fff"
      }];
      var options = {
        title: {
          display: true,
          text: "Répartition par niveau d'expérience"
        },
        legend: {
          position: 'bottom'
        },
        tooltips: {
          enabled: true
        },
        // pourcentages
        plugins: {
          datalabels: {
            //permet de transformer les données en pourcentages
            formatter: (value, ctx) => {
              //let sum = ctx.dataset._meta[0].total; //demander pour _meta[0]

              let sum = data[0].data.reduce((accumulator, currentValue) => accumulator + currentValue,0);   //  n'adapte pas les %
              let percentage = (value * 100 / sum).toFixed(0);  //.toFixed(0) permet d'arrondir sans avoir de chiffres à virgule
              if (percentage<5) {
                return "";
              }
              else return percentage + "%";
              },
              color: '#fff',
          },
        }
      };



      function addElement() {
        // create a new div canvas
        const newCanvas = document.createElement("canvas");
      
        // add the attributes
        newCanvas.setAttribute("id","ChartExperience");
        newCanvas.setAttribute("width","300");
        newCanvas.setAttribute("height","300");
    
        //ajouter dans le HTML
        document.getElementById("chart1").appendChild(newCanvas);
      }
      
      addElement();

      var ctx = document.getElementById("ChartExperience").getContext('2d');

      var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
        labels: ['- 1 an', 'Entre 1 et 3 ans', '+3 ans'],
          datasets: data
        },
         options: options 
      });
    }
      
      


document.getElementById("button").addEventListener("click",execute);

async function execute(){
let keyResult = await generateKey();
await drawGraphExperience(keyResult);
document.getElementById("date").innerHTML = " le " + new Date().toLocaleDateString() + " à " +  new Date().toLocaleTimeString();
}

