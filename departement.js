

// key automatically generated / Post request to get new access
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
        return key
  }
  
   // request to get the datas from the API 
  async function getData(index,token,departement) {
      let nbOffres=0;
      
      const requestOptions = {
        method: 'GET',
        headers: {
          cookie: 'BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=251070986.10062.0000; TS01585e85=01b3abf0a2600b9070e0208e6c69297328ff71af3418f75a7c004480c8586c5635b45b9f16e8d90766ea93053ba4214d2a03fad907',
          Authorization: `Bearer ${token}`
        }
      };
      // get 150 job offers from the ROME code M1805 for the last 31 days from variable index and store it in an array 
      await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&publieeDepuis=14&departement=${departement}&range=${index}-${index+149}`, requestOptions)
      .then(response => response.json())
      .then(result => nbOffres = result.resultats.length)
      .catch(error => 0);
  
      return nbOffres;
  }
  
  // main function 
  async function execute () {
  
    document.getElementById("buttonByDpt").disabled = true; // stop the creation of the div when the user press the button several times 
  
    //delete the last graphic to call a new one
    if(document.getElementById("Chartdepartements")) {
       document.getElementById("Chartdepartements").remove();
     }

    // array to contain the departements to look for in the job offers
    let departements = [
    {
        "code": "06",
        "libelle": "Alpes-Maritimes",
        "region": {
        "code": "93",
        "libelle": "Provence-Alpes-Côte d'Azur"
        }
    },
    {
        "code": "13",
        "libelle": "Bouches-du-Rhône",
        "region": {
        "code": "93",
        "libelle": "Provence-Alpes-Côte d'Azur"
        }
    },
    {
        "code": "31",
        "libelle": "Haute-Garonne",
        "region": {
        "code": "76",
        "libelle": "Occitanie"
        }
    },
    {
        "code": "33",
        "libelle": "Gironde",
        "region": {
        "code": "75",
        "libelle": "Nouvelle-Aquitaine"
        }
    },
    {
        "code": "34",
        "libelle": "Hérault",
        "region": {
        "code": "76",
        "libelle": "Occitanie"
        }
    },
    {
        "code": "35",
        "libelle": "Ille-et-Vilaine",
        "region": {
        "code": "53",
        "libelle": "Bretagne"
        }
    },
    {
        "code": "38",
        "libelle": "Isère",
        "region": {
        "code": "84",
        "libelle": "Auvergne-Rhône-Alpes"
        }
    },
    {
        "code": "44",
        "libelle": "Loire-Atlantique",
        "region": {
        "code": "52",
        "libelle": "Pays de la Loire"
        }
    },
    {
        "code": "59",
        "libelle": "Nord",
        "region": {
        "code": "32",
        "libelle": "Hauts-de-France"
        }
    },
    {
        "code": "69",
        "libelle": "Rhône",
        "region": {
        "code": "84",
        "libelle": "Auvergne-Rhône-Alpes"
        }
    },
    {
        "code": "75",
        "libelle": "Paris",
        "region": {
        "code": "11",
        "libelle": "Île-de-France"
        }
    },
    {
        "code": "92",
        "libelle": "Hauts-de-Seine",
        "region": {
        "code": "11",
        "libelle": "Île-de-France"
        }
    }
    ];
    let resultArray = [];
    let token = await generateKey(); // generate a new key
    for (let i = 0; i<departements.length-1; i++) {
        let nbOffresTotal=0;
        let index=0;
        let stopCondition = false;

        // create while loop which get the data from getData and increase the index
        while (!stopCondition) {
            let nbOffres = await getData(index,token,departements[i].code);
            if (nbOffres === 0) {
                stopCondition = true;
            }
            nbOffresTotal += nbOffres;
            index+=150;
        }
        let dpt = {code:departements[i].code, number:nbOffresTotal};
        resultArray.push(dpt)
    }
    console.log(resultArray);
    

  
      // create the graphic using chart.js 
      var data = [{
            data: resultArray.map(element => element.number),
            backgroundColor: [
              "#264653",
              "#2a9d8f",
              "#e9c46a",
              '#f4a261',
              '#e76f51',
              '#d90429',
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
              text: "Nombre d'offres par département au dours des 2 dernières semaines"
            },
              tooltips: {
                enabled: true
              },
              plugins: {
                datalabels: {
                  color: '#fff',
                }
              }
            };
            
          
  
          function addElement() {
            // create a new div canvas
            const newCanvas = document.createElement("canvas");
          
            // add the attributes
            newCanvas.setAttribute("id","Chartdepartements");
            newCanvas.setAttribute("width","1000");
            newCanvas.setAttribute("height","300");
        
            //add in the HTML
            document.getElementById("chart5").appendChild(newCanvas);
          }
          
          addElement();
          // details of the chart parameters
          var ctx = document.getElementById("Chartdepartements").getContext('2d');
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
            labels: resultArray.map(element => element.code),
              datasets: data
            },
            options: options
          });
          document.getElementById("buttonByDpt").disabled = false;
  }
  
  //event listener to execute the main function when the user click on the button search
  document.getElementById("buttonByDpt").addEventListener("click",execute)


  