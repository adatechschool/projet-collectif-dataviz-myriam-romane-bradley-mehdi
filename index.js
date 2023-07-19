const options = {
    method: 'GET',
    headers: {
      cookie: 'BIGipServerVS_EX035-VIPA-A4PMEX_HTTP.app~POOL_EX035-VIPA-A4PMEX_HTTP=251070986.10062.0000; TS01585e85=01b3abf0a2600b9070e0208e6c69297328ff71af3418f75a7c004480c8586c5635b45b9f16e8d90766ea93053ba4214d2a03fad907',
      Authorization: 'Bearer xuz7lonJPD2NQe_zw2KkdWLVw_w'
    }
  };
  
  fetch('https://api.pole-emploi.io/partenaire/offresdemploi/v2/offres/search?codeROME=M1805&experience=1&publieeDepuis=31&commune=44109', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));