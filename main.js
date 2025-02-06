let input = document.getElementById("input");
let container = document.querySelector(".main__list");
let numberLeft = document.getElementById("number-of-items");
let clearCompleted = document.getElementById("clear-completed");
let allRadio = document.getElementById("all");
let activeRadio = document.getElementById("active");
let completeRadio = document.getElementById("complete");
let colorSwitch = document.querySelector("#color-switch");

let mainArray = [];

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.length != 0) {
        if (localStorage.getItem("theme") == "light") {
            document.documentElement.className = "light";
            colorSwitch.querySelector("#sun").style.display = "none";
            colorSwitch.querySelector("#moon").style.display = "block";
        }

        loadFromStorage();
        for (let i = 0; i < mainArray.length; i++) {
            createTask(mainArray[i].id, mainArray[i].title, mainArray[i].complete);
        }
    }

    numberCount();
});

colorSwitch.addEventListener("click", () => {
    document.documentElement.classList.toggle("light");
    if (document.documentElement.classList.contains("light")) {
        localStorage.setItem("theme", "light");
        colorSwitch.querySelector("#sun").style.display = "none";
        colorSwitch.querySelector("#moon").style.display = "block";
    } else {
        localStorage.setItem("theme", "dark");
        colorSwitch.querySelector("#sun").style.display = "block";
        colorSwitch.querySelector("#moon").style.display = "none";
    }
});

clickByPress(colorSwitch);

input.addEventListener("keyup", (e) => {
    if (e.key == "Enter" && input.value.trim() != "") {
        addTask(input.value);
        input.value = "";
    }
});

clearCompleted.addEventListener("click", () => {
    let notCompleted = []

    for (let i = 0; i < mainArray.length; i++) {
        if (!mainArray[i].complete) notCompleted.push(mainArray[i]);
    }

    mainArray = notCompleted;
    addToStorage();
    container.innerHTML = "";

    for (let i = 0; i < mainArray.length; i++) {
        createTask(mainArray[i].id, mainArray[i].title, mainArray[i].complete);
    };

    allRadio.click()
});

clickByPress(clearCompleted);

activeRadio.addEventListener("click", () => {
    filterTasks("active");
});

completeRadio.addEventListener("click", () => {
    filterTasks("complete");
});

allRadio.addEventListener("click", () => {
    filterTasks("all")
});

document.querySelectorAll("input[type='radio']+label").forEach(label => {
    clickByPress(label);
});

function addTask(txt) {
    let info = {
        id: Date.now(),
        title: txt,
        complete: false
    }

    mainArray.push(info);
    createTask(info.id, info.title, info.complete);
    addToStorage();
    numberCount();
}

function createTask(id, title, complete) {
    let li = document.createElement("li");
    li.className = "main__item";
    li.setAttribute("tabindex", "0");
    li.dataset.id = id;

    if (complete) {
        li.classList.add("complete");
    }

    li.addEventListener("click", (e) => {
        for (let i = 0; i < mainArray.length; i++) {
            if (mainArray[i].id == id) {
                if (e.target.tagName == "IMG") {
                    li.remove();
                    mainArray.splice(i, 1);
                }

                else {
                    li.classList.toggle("complete");
                    if (li.classList.contains("complete")) {
                        mainArray[i].complete = true;
                    } else {
                        mainArray[i].complete = false;
                    }
                }

                numberCount();
                addToStorage();
            }
        }
    });

    li.addEventListener("keyup", (e) => {
        if (e.code == "Space") {
            li.click();
        } else if (e.code == "Delete") {
            li.querySelector("img").click();
        }
    })

    let div = document.createElement("div");
    div.className = "main__item__check";

    let p = document.createElement("p");
    p.className = "main__item__txt";
    p.append(title);

    let img = document.createElement("img");
    img.setAttribute("src", "./images/icon-cross.svg");
    img.setAttribute("alt", "Delete task icon.");
    img.className = "main__item__delete";

    li.append(div);
    li.append(p);
    li.append(img);

    container.append(li);
}

function addToStorage() {
    localStorage.setItem("tasks", JSON.stringify(mainArray));
}

function loadFromStorage() {
    mainArray = JSON.parse(localStorage.getItem("tasks")) || [];
}

function numberCount() {
    let number = 0;
    for (let i = 0; i < mainArray.length; i++) {
        if (mainArray[i].complete == false) number += 1;
    }

    if (number) numberLeft.textContent = `${number} item${number == 1 ? "" : "s"} left`;
    else numberLeft.textContent = "No items"
}

function filterTasks(status) {
    container.innerHTML = "";

    if (status == "all") {
        for (let i = 0; i < mainArray.length; i++) {
            createTask(mainArray[i].id, mainArray[i].title, mainArray[i].complete);
        };
    } else if (status == "active") {
        for (let i = 0; i < mainArray.length; i++) {
            if (!mainArray[i].complete) createTask(mainArray[i].id, mainArray[i].title, mainArray[i].complete);
        };
    } else if (status == "complete") {
        for (let i = 0; i < mainArray.length; i++) {
            if (mainArray[i].complete) createTask(mainArray[i].id, mainArray[i].title, mainArray[i].complete);
        };
    }
}

function clickByPress(element) {
    element.addEventListener("keyup", (e) => {
        if (e.code == "Space") element.click();
    })
}
