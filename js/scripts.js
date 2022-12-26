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

function addNodeToDOM(element) {
  let parentNode = document.querySelector(".all-city-loaded");
  parentNode.append(element);
}

function getListCity(arr) {
  arr.forEach((element) => {
    let areaName = element.name;
    let type = element.type;
    let id = element.id;
    let cities = element.cities;

    addNodeToDOM(createAreaNode(areaName, type, id));

    if (Array.isArray(cities)) {
      cities.forEach((city) => {
        let cityName = city.name;
        let type = "city";
        let id = city.id;

        addNodeToDOM(createCityNode(cityName, areaName, type, id));
      });
    }
  });
}

let btnCityCont = document.querySelector(".pc-city-container");
let cityBlock = document.querySelector(".pc-city-block");
let citySelect = document.querySelector(".city-selected");
let allCity = document.querySelector(".all-city-loaded");
// let cityDelete = document.querySelector(".city-selected svg");
let btnSaveCity = document.querySelector(".btn-save-city");

btnCityCont.addEventListener("click", function () {
  cityBlock.classList.toggle("visible");
});

window.onclick = function (event) {
  if (!event.target.className.includes("city")) {
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

    div.innerHTML =
      element.firstChild.innerText +
      '<svg><path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#FFFFFF"></path></svg>';

    citySelect.appendChild(div);
  }

  element.classList.toggle("active");
});
