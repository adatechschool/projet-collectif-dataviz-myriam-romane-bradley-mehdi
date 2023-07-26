

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

async function getDataExperience(index,token,experience){
  let resultat=0;
  let codePostal = await getDepartement()
  const requestOptions = {
    method: 'GET',
    headers: {
      cookie: 'BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=251070986.10062.0000; TS01585e85=01b3abf0a2600b9070e0208e6c69297328ff71af3418f75a7c004480c8586c5635b45b9f16e8d90766ea93053ba4214d2a03fad907',
      Authorization: `Bearer ${token}`
    }
  };

  await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&experience=${experience}&publieeDepuis=31&departement=${codePostal}&range=${index}-${index+149}`, requestOptions)
  .then(response => response.json())
  .then(result => resultat = result.resultats.length)
  .catch(error => resultat);

  return resultat;
}



  // fonction pour construire le graph => à terminer demain 
  async function drawGraphExperience () {
    if(document.getElementById("ChartExperience")) {
      document.getElementById("ChartExperience").remove();
    }
    let token = await generateKey();
    let finalArray=[];
    for (let experience = 1; experience<=3; experience++) {
      let result=0
      let index=0;
      let stopCondition = false;
      while (!stopCondition) {
        let newResult = await getDataExperience(index,token,experience);
        result += newResult;
        if (newResult === 0) {
            stopCondition = true;
        }
        index+=150;
      } 
      console.log(`nb d'offres pour le niveau d'expérience ${experience} = ${result}`);
      finalArray = finalArray.concat([result]);
    }
    
      var data = [{
        data: finalArray,
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
  document.getElementById("button").disabled = true;
await drawGraphExperience();
document.getElementById("date").innerHTML = new Date().toLocaleDateString() + " à " +  new Date().toLocaleTimeString() + " sur l'API pole emploi.";
document.getElementById("button").disabled = false;
}

