var environmentList;
var environmentUrl = "/compass/api/magnetic-field/";
var selectedEnvironmentUrl;
var selectedEnvironmentPk;
var environmentNameValue;

var environmentSelect = document.getElementById("environmentSelect");
var environmentForm = document.getElementById("environmentForm");
var environmentDelete = document.getElementById("environmentDelete");
var environmentAdd = document.getElementById("environmentAdd");
var environmentNameInput = document.getElementById("id_name_mag");
var latitudeInput = document.getElementById("id_latitude");
var longitudeInput = document.getElementById("id_longitude");
var magneticIntensity = document.getElementById("id_intensity");
var magneticAngle = document.getElementById("id_angle");

window.addEventListener("load", () => {
    initializeEnvironment()
    updateIntensityAngle()
});

function changeEnvironmentSelect() {
    // Update environment form from the select box
    selectedEnvironmentPk = Number(environmentSelect.options[environmentSelect.selectedIndex].value);
    selectedEnvironmentUrl = environmentUrl + selectedEnvironmentPk + "/";
    updateEnvironmentForm(selectedEnvironmentPk);
}

function initializeEnvironment() {
    // Initialize the environment input elements
    loadEnvironmentList().then(() => {
        updateEnvironmentSelect()
    }).then(() => {
        if (arrayIsNotEmpty(environmentList)) {
            environmentSelect[0].selected = true;
            changeEnvironmentSelect()
        }
        environmentNameValue = environmentNameInput.value;
    })
}

async function loadEnvironmentList() {
    // Load environment list from the backend
    const promise = await fetch(environmentUrl)
    .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response
    })
    .then((resp) => resp.json())
    .then((data) => environmentList = data)
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
    return promise;
}

function updateEnvironmentSelect() {
    // Update the environment select html element from environmentList
    var environmentSelectContent = "";
    environmentList.forEach(selectGen);
    function selectGen(value, index, array) {
        environmentSelectContent += ("<option value='" + value.pk + "'>" + value.name_mag + "</option>");
    }
    environmentSelect.innerHTML = environmentSelectContent;
}

function updateEnvironmentForm(pk) {
    // Populate the environment form html element from environmentList at the givent pk
    var selectedEnvironment = Object.assign({}, environmentList.find(environment => environment.pk === pk));
    delete selectedEnvironment.pk; // Pk is not in the form
    var selectedEnvironmentArray = Object.entries(selectedEnvironment);
    for (const [name, value] of selectedEnvironmentArray) {
        var id = "id_" + name;
        document.getElementById(id).value = value;
    }
}

// Function for the three buttons

function createEnvironment() {
    // POST new environment to the backend, update environmentList with the response,
    // update environmentSelect and environment form
    environmentNameValue = environmentNameInput.value;
    if (!environmentNameExist(environmentNameValue)) {
        environmentFormData = new FormData(environmentForm);
        fetch(environmentUrl, {
        method: "POST",
        body: environmentFormData
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response;
        })
        .then((resp) => resp.json())
        .then((data) => {
            environmentList.push(data)
            updateEnvironmentSelect()
            environmentSelect[selectEnvironmentOptionIndexByPk(data.pk)].selected = true;
            changeEnvironmentSelect()
            alert("Environment created!")
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {alert("Name already exists.")}
}

function modifyEnvironment() {
    // PUT request to the backend, update environmentList with the response,
    // update environmentSelect and environment form
    if (!environmentExist(getEnvironmentFromForm())) { //no need to check if environmentList is not empty
        environmentFormData = new FormData(environmentForm);
        fetch(selectedEnvironmentUrl, {
        method: "PUT",
        body: environmentFormData
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response;
        })
        .then((resp) => resp.json())
        .then((data) => {
            var index = environmentList.findIndex(environment => environment.pk === data.pk);
            environmentList[index] = data;
            updateEnvironmentSelect();
            environmentSelect[selectEnvironmentOptionIndexByPk(data.pk)].selected = true;
            changeEnvironmentSelect();
            alert("Environment modified!");
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {alert("This environment already exist. Please modify at least one parameter.")};
}

function deleteEnvironment() {
    // DELETE request to the backend, update environmentList with the response,
    // update environmentSelect and environment form
    if (environmentNameExist(environmentNameValue)) {
        fetch(selectedEnvironmentUrl, {
        method: "DELETE",
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response;
        })
        .then(() => {
            var index = environmentList.findIndex(environment => environment.pk === selectedEnvironmentPk);
            environmentList.splice(index, 1);
            updateEnvironmentSelect();
            if (arrayIsNotEmpty(environmentList)) {
                environmentSelect[0].selected = true;
                changeEnvironmentSelect();
            }
            else {clearEnvironmentForm()}
            alert("Environment deleted!")
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    } else {alert("Name doesn't exist.")}
}

// Utils

function clearEnvironmentForm() {
    var environmentKeys = ['name_mag', 'latitude', 'longitude', 'intensity', 'angle'];
    for (const name of environmentKeys) {
        var id = "id_" + name;
        document.getElementById(id).value = "";
    }
}

function environmentNameExist(name) {
    var nExist = false;
    for (const environment of environmentList) {
        if (environment.name_mag === name) {nExist = true};
    }
    return nExist;
}

function environmentExist(env) {
    // Check if the environment in the form exists in environmentList
    var envExist = false;
    for (const environment of environmentList) {
        if (shallowEqual(environment, env)) {envExist = true};
    }
    return envExist;
}

function getEnvironmentFromForm() {
    // Return the environment currently in the form as a javascript object 
    var environment = {};
    environment['pk'] = selectedEnvironmentPk; // Pk is not in the form
    environment['name_mag'] = document.getElementById("id_name_mag").value; // name is a string

    var environmentKeys = ['latitude', 'longitude', 'intensity', 'angle'];
    for (const name of environmentKeys) {
        var id = "id_" + name;
        environment[name] = Number(document.getElementById(id).value);
    }
    return environment;
}

environmentNameInput.addEventListener("input", function() {
    // Update name value and gray buttons given if name exist
    environmentNameValue = environmentNameInput.value;
    if (environmentNameExist(environmentNameValue)) {
        if (environmentDelete.classList.contains("w3-disabled")) {
            environmentDelete.classList.remove("w3-disabled")
        };
        if (!environmentAdd.classList.contains("w3-disabled")) {
            environmentAdd.classList.add("w3-disabled")
        };
    } else {
        if (!environmentDelete.classList.contains("w3-disabled")) {
            environmentDelete.classList.add("w3-disabled")
        };
        if (environmentAdd.classList.contains("w3-disabled")) {
            environmentAdd.classList.remove("w3-disabled")
        };
    }
});

function selectEnvironmentOptionIndexByPk(pk) {
    // Return the option with the given pk as value
    selectedOption = Array.from(environmentSelect.options).find(option => Number(option.value) === pk);
    return selectedOption.index;
}

latitudeInput.addEventListener("input", updateIntensityAngle);
longitudeInput.addEventListener("input", updateIntensityAngle);

function updateIntensityAngle() {
    const field = geomag.field(latitudeInput.value, longitudeInput.value);
    const {  
        declination,
        inclination,
        intensity,
        northIntensity,
        eastIntensity,
        verticalIntensity,
        horizontalIntensity,
    } = field;
    magneticIntensity.value = intensity;
    magneticAngle.value = inclination;
};