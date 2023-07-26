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

// function to get the departement typed by the user
async function getDepartement() {
  var departement= document.getElementById("departement").value.toString() ;
 return departement }

 // request to get the datas from the API 
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
    // get 150 job offers from the ROME code M1805 for the last 31 days from variable index and store it in an array 
    await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&publieeDepuis=31&departement=${codePostal}&range=${index}-${index+149}`, requestOptions)
    .then(response => response.json())
    .then(result => array = result.resultats)
    .catch(error => array = []);

    return array;
}

// main function 
async function execute () {

  document.getElementById("button").disabled = true; // stop the creation of the div when the user press the button several times 

  // delete the last graphic to call a new one
  if(document.getElementById("ChartLangages")) {
    document.getElementById("ChartLangages").remove();
  }
  let token = await generateKey(); // generate a new key
    let finalArray=[];
    let index=0;
    let stopCondition = false;

    // create while loop which get the data from getData and increase the index
    while (!stopCondition) {
        let newArray = await getData(index,token);
        if (newArray.length === 0) {
            stopCondition = true;
        }
        finalArray = finalArray.concat(newArray);
        index+=150;
    }
    // objects to contain the languages to look for in the job offers
    let langages = {
        java : ["java ","Java ","JAVA ","Java/","JAVA/","java/"],
        python : ["python","Python","PYTHON","python/","Python/","PYTHON/"],
        php : ['php',"PHP","PHP/","php/"],
        C : ["C ","C/","C/C++","C++"],
        Csharp : ["C#/","C#"],
        javascript : ["js","JS","Javascript","JAVASCRIPT","javascript","node","Node","nodeJS","NodeJS","js/","JS/","Javascript/","JAVASCRIPT/","javascript/","node/","Node/","nodeJS/","NodeJS/"]
    }
    //nested loop to look for the key words in the job offers
    let nbOffresTrouvees=0;
    let nbOffresParLangage=[];
    for (const langage in langages) {// loop on languages object
        let counter = 0;
        for (let i =0; i<finalArray.length; i++) { // loop on job offers 
            let string = JSON.stringify(finalArray[i]); // transform the job offers into a string
            let search=false;
            langages[langage].forEach(element => { // loop through the key words for each languages in the array langages
                if(string.indexOf(element) != -1) { // check if the key word has been found
                    search=true; // change the boolean value of search
                }
            });
            if (search) { // if the boolean is true then increment the counter
                counter++;
            }
        }
        if (counter >= 0) { 
            nbOffresTrouvees+=counter; // take the value of counter 
            nbOffresParLangage.push(counter); // push the final count into the array nbOffresParLangage
        }
    }

    // create the graphic using chart.js 
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
          
        

        function addElement() {
          // create a new div canvas
          const newCanvas = document.createElement("canvas");
        
          // add the attributes
          newCanvas.setAttribute("id","ChartLangages");
          newCanvas.setAttribute("width","300");
          newCanvas.setAttribute("height","300");
      
          //add in the HTML
          document.getElementById("chart2").appendChild(newCanvas);
        }
        
        addElement();
        // details of the chart parameters
        var ctx = document.getElementById("ChartLangages").getContext('2d');
        
        var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
          labels: ["java","python","php","C/C++","C#","JS"],
            datasets: data
          },
          options: options
        });
        document.getElementById("button").disabled = false;
}

// event listener to execute the main function when the user click on the button search
document.getElementById("button").addEventListener("click",execute)


