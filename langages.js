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
 return departement }

async function getData(index,token) {
    let array;
    let codePostal = await getDepartement()
    const requestOptions = {
      method: 'GET',
      headers: {
        cookie: 'BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=251070986.10062.0000; TS01585e85=01b3abf0a2600b9070e0208e6c69297328ff71af3418f75a7c004480c8586c5635b45b9f16e8d90766ea93053ba4214d2a03fad907',
        Authorization: `Bearer ${token}`
      }
    };

    await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&publieeDepuis=31&departement=${codePostal}&range=${index}-${index+149}`, requestOptions)
    .then(response => response.json())
    .then(result => array = result.resultats)
    .catch(error => array = []);

    return array;
}

async function execute () {
  let token = await generateKey();
    let finalArray=[];
    let index=0;
    let stopCondition = false;
    while (!stopCondition) {
        let newArray = await getData(index,token);
        if (newArray.length === 0) {
            stopCondition = true;
        }
        finalArray = finalArray.concat(newArray);
        index+=150;
    }

    console.log(`nombre d'offres total : ${finalArray.length}`);
    let langages = {
        java : ["java ","Java ","JAVA ","Java/","JAVA/","java/"],
        python : ["python","Python","PYTHON","python/","Python/","PYTHON/"],
        php : ['php',"PHP","PHP/","php/"],
        C : ["C ","C/","C/C++","C++"],
        Csharp : ["C#/","C#"],
        javascript : ["js","JS","Javascript","JAVASCRIPT","javascript","node","Node","nodeJS","NodeJS","js/","JS/","Javascript/","JAVASCRIPT/","javascript/","node/","Node/","nodeJS/","NodeJS/"]
    }
    let nbOffresTrouvees=0;
    let nbOffresParLangage=[];
    for (const langage in langages) {
        let counter = 0;
        for (let i =0; i<finalArray.length; i++) {
            let string = JSON.stringify(finalArray[i]);
            let search=0;
            langages[langage].forEach(element => { 
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
            console.log(`nombre d'offres ${langage} : ${counter}`);
            nbOffresParLangage.push(counter);
        }
    }
    console.log(nbOffresTrouvees);

    var data = [{
          data: nbOffresParLangage,
          backgroundColor: [
            "#264653",
            "#2a9d8f",
            "#e9c46a",
            '#f4a261',
            '#e76f51',
            '#d90429'
          ],
          borderColor: "#fff"
        }];

        var options = {
          title: {
            display: true,
            text: "Répartition par langage"
          },
          legend: {
            position: 'bottom',
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
                  let sum = data[0].data.reduce((accumulator, currentValue) => accumulator + currentValue,0);    // n'adapte pas les %
                  let percentage = (value * 100 / sum).toFixed(0);  //.toFixed(0) permet d'arrondir sans avoir de chiffres à virgule
                  if (percentage<5) {
                    return "";
                  }
                  else return percentage + "%";
                },
                color: '#fff',
              }
            }
          };
          
        var ctx = document.getElementById("ChartLangages").getContext('2d');

        var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
          labels: ["java","python","php","C/C++","C#","JS"],
            datasets: data
          },
          options: options
        });
}

document.getElementById("button").addEventListener("click",execute)


