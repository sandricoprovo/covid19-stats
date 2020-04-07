(function () {
  let covidData = {};
  let selectedCountry = document.querySelector('select[name="countryList"]');
  let searchBtn = document.querySelector('.btn--search');

  // This fetch call brings in the summary totals for all countries that report data.
  let url = "https://api.covid19api.com/summary"
  fetch(url)
    .then(res => res.json())
    .then(data => {
      covidData = Object.assign(covidData, data); // copies data object to global object
      displayCountryList(covidData); // Function loads country listing to page
      displayWorldStats(covidData); // Displays the global stats on the page
    })
    .catch(err => console.log(err + ": There was an issue loading the data."));

  // This function creates an array of all of the available countries, and then loads those countries to the select tag that users uses to select a search country.
  let displayCountryList = ({ Countries: countryArr }) => {
    let countryList = countryArr.map(countryObj => {
      return countryObj.Country;
    }).sort();
    // loads available countries to select list
    countryList.forEach(countryName => {
      let newOption = `<option value="${countryName}">${countryName}</option>`;
      document.querySelector('select[name="countryList"]').innerHTML += newOption;
    });
  };

  // This function takes in the covidData object and loads Global stats to the screen. It displays  the percentage of deaths and recovery in place of the raw numbers.
  let displayWorldStats = (worldObj) => {
    // percentage calcs
    let fatalityRate = (worldObj.Global.TotalDeaths / worldObj.Global.TotalConfirmed) * 100;
    let recoveryRate = (worldObj.Global.TotalRecovered / worldObj.Global.TotalConfirmed) * 100;
    // displaying to DOM
    document.querySelector('.world--date').textContent += formatDate(worldObj.Date);
    document.querySelector('.world--confirmed').textContent += numberFormatter(worldObj.Global.TotalConfirmed)
    document.querySelector('.world--new').textContent += numberFormatter(worldObj.Global.NewConfirmed)
    document.querySelector('.world--deaths').textContent += `${fatalityRate.toFixed(2)}%`;
    document.querySelector('.world--recovered').textContent += `${recoveryRate.toFixed(2)}%`;
  };

  // This function destructures the Countries array from the fetched data, filters out the object for the searched country, and passes that data to the function setting information to the page. The default country passed is Canada
  let filterCountryData = ({ Countries }, searchCountry = "Canada") => {
    let enteredCountry = Countries.filter(countryObj => {
      if (countryObj.Country.toLowerCase() === searchCountry.toLowerCase()) {
        return countryObj;
      }
    })[0];
    setStatsToPage(enteredCountry)
  }

  // This function takes in the searched countries object and uses its properties to set the information to the page. All the numbers displayed to the page are formatted using a formatting function. 
  let setStatsToPage = (statsObj) => {
    document.querySelector('.data--timestamp').textContent = `Country Stats Last updated: ${formatDate(statsObj.Date)}`;
    // Setting total stats to page
    document.querySelector('.data--cases > .data--total').textContent = `Total: ${numberFormatter(statsObj.TotalConfirmed)}`;
    document.querySelector('.data--deaths > .data--total').textContent = `Total: ${numberFormatter(statsObj.TotalDeaths)}`;
    document.querySelector('.data--recovered > .data--total').textContent = `Total: ${numberFormatter(statsObj.TotalRecovered)}`;
    // Setting new stats to page
    document.querySelector('.data--country').textContent = `Country: ${statsObj.Country}`;
    document.querySelector('.data--cases > .data--new').textContent = `New: ${numberFormatter(statsObj.NewConfirmed)}`;
    document.querySelector('.data--deaths > .data--new').textContent = `New: ${numberFormatter(statsObj.NewDeaths)}`;
    document.querySelector('.data--recovered > .data--new').textContent = `New: ${numberFormatter(statsObj.NewRecovered)}`;
  };

  // This function takes in the current countrys date property and formats the date to month, day & year. The date is returned from the function.
  let formatDate = (dataObj) => {
    return new Date(`${dataObj}`).toString().match(/(\w{3,} \d{2} \d{4})/g)[0];
  };

  // Takes in a number and formats it, then returns the number from the function.
  let numberFormatter = (inputNumber) => {
    return new Intl.NumberFormat().format(inputNumber);
  };

  // On click the total and new stats for the entered country are set to the page. 
  searchBtn.addEventListener('click', () => {
    // If user enters no country, default country is used. Else, selected country is used.
    if (selectedCountry.value !== "") {
      filterCountryData(covidData, selectedCountry.value);
    } else {
      filterCountryData(covidData);
    }

    // Animates the logo text once a search is anitiated
    anime({
      targets: '.logo--text',
      borderLeft: '40px solid rgba(232, 210, 101, 1)',
      delay: 600
    })

    // Animates data cards on search if window width is larger than 1000px (CSS Breakpoint)
    if (window.innerWidth > 1000) {
      anime({
        targets: '.data--card',
        backgroundColor: 'rgba(51, 161, 253, 1)',
        boxShadow: '0px 16px 40px -12px rgba(33, 118, 255, 0.4)',
        translateX: -104,
        delay: 600
      });
    }
  });

  // Creates a size increase affect when the user hovers over the search button
  searchBtn.addEventListener('mouseover', () => {
    anime({
      targets: searchBtn,
      backgroundColor: 'rgba(51, 161, 253, 1)',
      scale: 1.15
    })
  });
  searchBtn.addEventListener('mouseleave', () => {
    anime({
      targets: searchBtn,
      backgroundColor: 'rgba(247, 255, 247, 1)',
      scale: 1.0
    })
  });

  // Adds and removes border highlight of selection box on mouse over and leave
  selectedCountry.addEventListener('mouseover', () => {
    anime({
      targets: selectedCountry,
      borderColor: 'rgba(33, 118, 255, 1)'
    })
  })
  selectedCountry.addEventListener('mouseleave', () => {
    anime({
      targets: selectedCountry,
      borderColor: 'rgba(247, 255, 247, 1)'
    })
  })

  // Animating COVID-19 in Header Text
  // Below code referenced from: https://tobiasahlin.com/moving-letters/#3
  let diseaseTitle = document.querySelector('.title--disease');
  diseaseTitle.innerHTML = diseaseTitle.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
  anime({
    targets: '.letter',
    opacity: [0, 1],
    easing: "easeInOutQuad",
    duration: 200,
    delay: (el, i) => 150 * (i + 1)
  })

})();