fetch("https://studika.ru/api/areas", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("apiResponse", data);
    return data;
  })
  .then((data) => getListCity(data))
  .catch((error) => {
    console.log(`Не удалость выполнить запрос и загрузить список городов`);
    getListCity(CityList);
  });

function createAreaNode(areaName, type, id) {
  let div = document.createElement("div");
  div.className = "city-item";

  div.dataset.id = id;
  div.dataset.type = type;
  let span = document.createElement("span");
  span.className = "city-name";
  span.innerText = areaName;
  div.appendChild(span);
  return div;
}

function createCityNode(cityName, areaName, type, id) {
  let div = document.createElement("div");
  div.className = "city-item";
  div.dataset.id = id;
  div.dataset.type = type;
  let span = document.createElement("span");
  span.className = "city-name";
  span.innerText = cityName;
  div.appendChild(span);

  let span2 = document.createElement("span");
  span2.className = "city-state";
  span2.innerText = areaName;
  div.appendChild(span2);
  return div;
}

let allCityLoad = [];

function getListCity(arr) {
  arr.forEach((element) => {
    let areaName = element.name;
    let type = element.type;
    let id = element.id;
    let cities = element.cities;

    allCityLoad.push(createAreaNode(areaName, type, id));

    if (Array.isArray(cities)) {
      cities.forEach((city) => {
        let cityName = city.name;
        let type = "city";
        let id = city.id;

        allCityLoad.push(createCityNode(cityName, areaName, type, id));
      });
    }
  });
  addNodesToDOM(allCityLoad, ".all-city-loaded");
}

let btnCityCont = document.querySelector(".pc-city-container");
let cityBlock = document.querySelector(".pc-city-block");
let citySelect = document.querySelector(".city-selected");
let allCity = document.querySelector(".all-city-loaded");
let btnSaveCity = document.querySelector(".btn-save-city");
let cityNameHeader = document.querySelector(".city-name-header");
let citySearchClear = document.querySelector(".city-search-clear");

btnCityCont.addEventListener("click", function () {
  cityBlock.classList.toggle("visible");
});

window.onclick = function (event) {
  if (
    event.target.className.includes != null &&
    event.target.className.includes("do-not-close-city-menu")
  ) {
    return;
  } else if (
    !cityBlock.contains(event.target) &&
    !btnCityCont.contains(event.target)
  ) {
    cityBlock.classList.remove("visible");
  }
};

allCity.addEventListener("click", function (event) {
  let element;
  if (event.target.nodeName == "SPAN") {
    element = event.target.parentNode;
  } else {
    element = event.target;
  }

  if (element.className.includes("all-city-loaded")) {
    return;
  }

  if (element.className.includes("active")) {
    citySelect.querySelector(`[data-id = '${element.dataset.id}']`).remove();
  } else {
    let div = document.createElement("div");
    div.className = "city-select";
    div.dataset.id = element.dataset.id;
    div.dataset.type = element.dataset.type;
    let divBtn = document.createElement("div");
    divBtn.className = "do-not-close-city-menu";
    divBtn.innerHTML =
      '<img src="./images/close.svg" class="do-not-close-city-menu" alt="X" />';
    divBtn.onclick = deleteCitySelected;
    div.innerHTML = element.firstChild.innerText;
    div.appendChild(divBtn);
    citySelect.appendChild(div);
  }

  element.classList.toggle("active");
});

function deleteCitySelected(event) {
  let divSel = event.target.parentNode.parentNode;

  let divLoad = allCity.querySelector(`[data-id = '${divSel.dataset.id}']`);

  divLoad.classList.remove("active");
  divSel.remove();
}

btnSaveCity.addEventListener("click", function () {
  let arraySpanCity = [];
  let arrayCity = citySelect.querySelectorAll(".city-select");
  arrayCity.forEach((element) => {
    let cityName = element.textContent;
    arraySpanCity.push(cityName);
  });
  if (arraySpanCity.length == 0) {
    cityNameHeader.textContent = "Любой регион";
  } else {
    cityNameHeader.textContent = arraySpanCity.join(", ");
  }
});

function citySearch() {
  let citySearchValue = document.querySelector(".city-search").value;
  let allCityFilter = [];

  if (citySearchValue.length > 0) {
    for (elem of allCityLoad) {
      let element = elem.cloneNode(true);
      let strTLC = element.firstChild.innerText.toLowerCase();
      let str = element.firstChild.innerText;
      let substr = citySearchValue.toLowerCase();
      if (strTLC.includes(substr)) {
        substr = substr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let re = new RegExp(substr, "ig");

        if (substr.length > 0) {
          element.firstChild.innerHTML = str.replace(re, `<mark>$&</mark>`);
        } else {
          element.firstChild.innerHTML = str;
        }

        allCityFilter.push(element);
      }
    }
    addNodesToDOM(allCityFilter, ".all-city-loaded");
  } else {
    addNodesToDOM(allCityLoad, ".all-city-loaded");
  }
}

citySearchClear.onclick = function () {
  document.querySelector(".city-search").value = "";
  citySearch();
};

function addNodesToDOM(element, className) {
  let parentNode = document.querySelector(className);
  parentNode.replaceChildren(...element);
}
