var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer 0AsAX7KMykVlyuVxOydJ7Ji-LWo");
myHeaders.append("Cookie", "BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=251070986.10062.0000; TS01585e85=01b3abf0a2fbb69f4db9f23f57d575eb1fc3804f60234014881b35474bd02561371644e1d70159c276c55bc2c496f43b7511190eba");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&commune=44109&motsCles=Developpeur", requestOptions)
  .then(response => response.json())
  .then(result => result)
  .then(result => console.log(result.resultats[23].intitule))
  .catch(error => console.log('error', error));