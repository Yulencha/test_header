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

btnCityCont.addEventListener("click", function () {
  cityBlock.classList.toggle("visible");
});

window.onclick = function (event) {
  if (!event.target.className.includes("city")) {
    cityBlock.classList.remove("visible");
  }
};
