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

function addNodeToDOM(element, className) {
  let parentNode = document.querySelector(className);
  parentNode.append(element);
}

function getListCity(arr) {
  arr.forEach((element) => {
    let areaName = element.name;
    let type = element.type;
    let id = element.id;
    let cities = element.cities;

    addNodeToDOM(createAreaNode(areaName, type, id), ".all-city-loaded");

    if (Array.isArray(cities)) {
      cities.forEach((city) => {
        let cityName = city.name;
        let type = "city";
        let id = city.id;

        addNodeToDOM(
          createCityNode(cityName, areaName, type, id),
          ".all-city-loaded"
        );
      });
    }
  });
}

let btnCityCont = document.querySelector(".pc-city-container");
let cityBlock = document.querySelector(".pc-city-block");
let citySelect = document.querySelector(".city-selected");
let allCity = document.querySelector(".all-city-loaded");
let btnSaveCity = document.querySelector(".btn-save-city");
let cityNameHeader = document.querySelector(".city-name-header");

btnCityCont.addEventListener("click", function () {
  cityBlock.classList.toggle("visible");
});

window.onclick = function (event) {
  if (event.target.className.includes("do-not-close-city-menu")) {
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
  //  console.log(arraySpanCity);
});

{
  /* 
<div class="city-select" data-id="24" data-type="area">
  Алтайский край
  <div class="do-not-close-city-menu">
    <img src="./images/close.svg" class="do-not-close-city-menu" alt="X">
  </div>
</div>

  <span data-type="area" data-id="24">
    Алтайский край
  </span> 
*/
}

function createCitySpan(cityName, type, id) {
  let span = document.createElement("span");
  span.dataset.id = id;
  span.dataset.type = type;
  span.innerText = cityName;
  return span;
}
