async function getData(index) {
    let array;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer 7R3iOAwG-9-gwOV0TQiHT1qK9yw");
    myHeaders.append("Cookie", "BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=4143319562.9038.0000; TS01585e85=01b3abf0a2e73b7552eab0cfcb61e6196fb1f91f0a6994588e4ddb090e9bea30f0ecb1ce72e3c1c426d1be2c56618aa62f0a7ac345");

    let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    await fetch(`https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&publieeDepuis=31&departement=44&range=${index}-${index+149}`, requestOptions)
    .then(response => response.json())
    .then(result => array = result.resultats)
    .catch(error => array = []);

    return array;
}



async function execute () {
    let finalArray=[];
    let index=0;
    let stopCondition = false;
    while (!stopCondition) {
        let newArray = await getData(index);
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
            "#1ED180",
            "#5F255F",
            "#D21243",
            '#9BD0F5',
            '#FFB1C1',
            '#36A2EB'
          ],
          borderColor: "#fff"
        }];
  
        var ctx = document.getElementById("ChartLangages").getContext('2d');

        var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
          labels: ["java","python","php","C/C++","C#","JS"],
            datasets: data
          }
        });
}

execute();
