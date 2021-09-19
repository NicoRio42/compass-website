var compassList;
var compassUrl = "/compass/api/compass/";
var selectedCompassUrl;
var selectedCompassPk;
var nameValue;

var compassSelect = document.getElementById("compassSelect");
var compassForm = document.getElementById("compassForm");
var compassDelete = document.getElementById("compassDelete");
var compassAdd = document.getElementById("compassAdd");
var compassNameInput = document.getElementById("id_name");

window.addEventListener("load", () => {
    initializeCompass()
});

function changeCompassSelect() {
    // Update compass form from the select box
    selectedCompassPk = Number(compassSelect.options[compassSelect.selectedIndex].value);
    selectedCompassUrl = compassUrl + selectedCompassPk + "/";
    updateCompassForm(selectedCompassPk);
}

function initializeCompass() {
    // Initialize the compass input elements
    loadCompassList().then(() => {
        updateCompassSelect()
    }).then(() => {
        if (arrayIsNotEmpty(compassList)) {
            compassSelect[0].selected = true;
            changeCompassSelect()
        }
        nameValue = compassNameInput.value;
    })
}

async function loadCompassList() {
    // Load compass list from the backend
    const promise = await fetch(compassUrl)
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response
    })
    .then((resp) => resp.json())
    .then((data) => compassList = data)
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
    return promise;
}

function updateCompassSelect() {
    // Update the compass select html element from CompassList
    var compassSelectContent = "";
    compassList.forEach(selectGenerator);
    function selectGenerator(value, index, array) {
        compassSelectContent += ("<option value='" + value.pk + "'>" + value.name + "</option>");
    }
    compassSelect.innerHTML = compassSelectContent;
}

function updateCompassForm(pk) {
    // Populate the compass form html element from CompassList at the givent pk
    var selectedCompass = Object.assign({}, compassList.find(compass => compass.pk === pk));
    delete selectedCompass.pk; // Pk is not in the form
    var selectedCompassArray = Object.entries(selectedCompass);
    for (const [name, value] of selectedCompassArray) {
        var id = "id_" + name;
        document.getElementById(id).value = value;
    }
}

// Function for the three buttons

function createCompass() {
    // POST new compass to the backend, update compassList with the response,
    // update compassSelect and compass form
    nameValue = compassNameInput.value;
    if (!nameExist(nameValue)) {
        compassFormData = new FormData(compassForm);
        fetch(compassUrl, {
        method: "POST",
        body: compassFormData
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response;
        })
        .then((resp) => resp.json())
        .then((data) => {
            compassList.push(data)
            updateCompassSelect()
            compassSelect[selectOptionIndexByPk(data.pk)].selected = true;
            changeCompassSelect()
            alert("Compass created!")
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {alert("Name already exists.")}
}

function modifyCompass() {
    // PUT request to the backend, update compassList with the response,
    // update compassSelect and compass form
    if (!compassExist(getCompassFromForm())) { //no need to check if compassList is not empty
        compassFormData = new FormData(compassForm);
        fetch(selectedCompassUrl, {
        method: "PUT",
        body: compassFormData
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response;
        })
        .then((resp) => resp.json())
        .then((data) => {
            var index = compassList.findIndex(compass => compass.pk === data.pk);
            compassList[index] = data;
            updateCompassSelect();
            compassSelect[selectOptionIndexByPk(data.pk)].selected = true;
            changeCompassSelect();
            alert("Compass modified!");
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {alert("This compass already exist. Please modify at least one parameter.")};
}

function deleteCompass() {
    // DELETE request to the backend, update compassList with the response,
    // update compassSelect and compass form
    if (nameExist(nameValue)) {
        fetch(selectedCompassUrl, {
        method: "DELETE",
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response;
        })
        .then(() => {
            var index = compassList.findIndex(compass => compass.pk === selectedCompassPk);
            compassList.splice(index, 1);
            updateCompassSelect();
            if (arrayIsNotEmpty(compassList)) {
                compassSelect[0].selected = true;
                changeCompassSelect();
            }
            else {clearCompassForm()}
            alert("Compass deleted!")
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {alert("Name doesn't exist.")}
}

// Utils

function arrayIsNotEmpty(array) {
    if (Array.isArray(array) && array.length) {return true}
    else {return false}
}

function clearCompassForm() {
    var compassKeys = ['name', 'inertial_moment', 'visc_frictions', 'magnet_rem', 'magnet_vol', 'magnet_mass', 'magnet_offset', 'liquid_density', 'disk_diameter'];
    for (const name of compassKeys) {
        var id = "id_" + name;
        document.getElementById(id).value = "";
    }
}

function nameExist(name) {
    var nExist = false;
    for (const compass of compassList) {
        if (compass.name === name) {nExist = true};
    }
    return nExist;
}

function compassExist(comp) {
    // Check if the compass in the form exists in compassList
    var compExist = false;
    for (const compass of compassList) {
        if (shallowEqual(compass, comp)) {compExist = true};
    }
    return compExist;
}

function shallowEqual(object1, object2) {
    // shallow equality between two objects
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

function getCompassFromForm() {
    // Return the compass currently in the form as a javascript object 
    var compass = {};
    compass['pk'] = selectedCompassPk; // Pk is not in the form
    compass['name'] = document.getElementById("id_name").value; // name is a string

    var compassKeys = ['inertial_moment', 'visc_frictions', 'magnet_rem', 'magnet_vol', 'magnet_mass', 'magnet_offset', 'liquid_density', 'disk_diameter'];
    for (const name of compassKeys) {
        var id = "id_" + name;
        compass[name] = Number(document.getElementById(id).value);
    }
    return compass;
}

compassNameInput.addEventListener("input", function() {
    // Update name value and gray buttons given if name exist
    nameValue = compassNameInput.value;
    if (nameExist(nameValue)) {
        if (compassDelete.classList.contains("w3-disabled")) {
            compassDelete.classList.remove("w3-disabled")
        };
        if (!compassAdd.classList.contains("w3-disabled")) {
            compassAdd.classList.add("w3-disabled")
        };
    } else {
        if (!compassDelete.classList.contains("w3-disabled")) {
            compassDelete.classList.add("w3-disabled")
        };
        if (compassAdd.classList.contains("w3-disabled")) {
            compassAdd.classList.remove("w3-disabled")
        };
    }
});

function selectOptionIndexByPk(pk) {
    // Return the option with the given pk as value
    selectedOption = Array.from(compassSelect.options).find(option => Number(option.value) === pk);
    return selectedOption.index;
}

function hideForm(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}