// Input parameters
var magnetOffset = -0.35;
var diskDiameter = 23;

// Output parameters
var balanceValue;
var balancePercent;
var StabilityValue;
var StabilityPercent;
var RapidityValue;
var RapidityPercent;

// Balance formula parameter
var balance_a0 = 67.1;
var balance_a1 = 46.1;

// Stability formula parameters
var stability_a0 = 8.88e-3;
var stability_a1 = -0.278;
var stability_a2 = 2.28;
var stability_a3 = -1.04e2;

// Rappidity formula parameters
var rapidity_a0 = 6.19e-5;
var rapidity_a1 = 1.21e-3;
var rapidity_a2 = 4.75e-3;
var rapidity_a3 = 1.08;

// Parameters extremums
var diskDiameterMin = 0;
var diskDiameterMax = 30;
var diskDiameterStep = 1;
var magnetOffsetMin = -0.65;
var magnetOffsetMax = 0;
var magnetOffsetStep = 0.01;
var balanceMin = 0;
var balanceMax = balance(magnetOffsetMax);
var stabilityMin = 0;
var stabilityMax = Math.max(stability(diskDiameterMin, magnetOffsetMin), 
stability(diskDiameterMin, magnetOffsetMax));
var rapidityMin = 0;
var rapidityMax = rapidity(diskDiameterMax);

// html elements
var diskSlider = document.getElementById("diskRange");
var diskOutput = document.getElementById("diskValue");
var offsetSlider = document.getElementById("magnetOffsetRange");
var offsetOutput = document.getElementById("magnetOffsetValue");
var balanceBar = document.getElementById("balanceBar");
var balanceOutput = document.getElementById("balanceValue");
var stabilityBar = document.getElementById("stabilityBar");
var stabilityOutput = document.getElementById("stabilityValue");
var rapidityBar = document.getElementById("rapidityBar");
var rapidityOutput = document.getElementById("rapidityValue");

// Set Parameters extremums on html elements
diskSlider.setAttribute("min", diskDiameterMin.toString());
diskSlider.setAttribute("max", diskDiameterMax.toString());
diskSlider.setAttribute("step", diskDiameterStep.toString());
offsetSlider.setAttribute("min", magnetOffsetMin.toString());
offsetSlider.setAttribute("max", magnetOffsetMax.toString());
offsetSlider.setAttribute("step", magnetOffsetStep.toString());
balanceBar.setAttribute("aria-valuemin", balanceMin.toString());
balanceBar.setAttribute("aria-valuemax", balanceMax.toString());
stabilityBar.setAttribute("aria-valuemin", stabilityMin.toString());
stabilityBar.setAttribute("aria-valuemax", stabilityMax.toString());
rapidityBar.setAttribute("aria-valuemin", rapidityMin.toString());
rapidityBar.setAttribute("aria-valuemax", rapidityMax.toString());

// Balance bar setting
function balanceBarSetting() {
    balanceValue = balance(magnetOffset);
    balancePercent = (balanceValue - balanceMin) * 100 / (balanceMax - 
    balanceMin);
    balanceBar.style.width = balancePercent.toString() + "%";
    balanceOutput.innerHTML = Math.round(balanceValue);
}
balanceBarSetting()

// Stability bar setting
function stabilityBarSetting() {
    stabilityValue = stability(diskDiameter, magnetOffset);
    stabilityPercent = (stabilityValue - stabilityMin) * 100 / (stabilityMax - 
    stabilityMin);
    stabilityBar.style.width = stabilityPercent.toString() + "%";
    stabilityOutput.innerHTML = Math.round(stabilityValue);
}
stabilityBarSetting()

// Rapidity bar setting
function rapidityBarSetting() {
    rapidityValue = rapidity(diskDiameter);
    rapidityPercent = (rapidityValue - rapidityMin) * 100 / (rapidityMax - 
    rapidityMin);
    rapidityBar.style.width = rapidityPercent.toString() + "%";
    rapidityOutput.innerHTML = Math.round(rapidityValue * 100) / 100;
}
rapidityBarSetting()

// Disk diameter slider control
diskSlider.value = diskDiameter;
diskOutput.innerHTML = diskSlider.value;
diskSlider.oninput = function() {
    diskDiameter = this.value;
    diskOutput.innerHTML = this.value;
    stabilityBarSetting()
    rapidityBarSetting()
}

// Magnet offset slider control
offsetSlider.value = magnetOffset;
offsetOutput.innerHTML = offsetSlider.value;
offsetSlider.oninput = function() {
    magnetOffset = this.value;
    offsetOutput.innerHTML = this.value;
    balanceBarSetting()
    stabilityBarSetting()
}

function balance(magnetOffset) {
    return balance_a0 * magnetOffset + balance_a1;
}

function stability(diskDiameter, magnetOffset) {
    return Math.abs((stability_a0 * Math.pow(diskDiameter, 3) + stability_a1 * 
    Math.pow(diskDiameter, 2) + stability_a2 * diskDiameter + stability_a3) * 
    magnetOffset);
}

function rapidity(diskDiameter) {
    return Math.abs(rapidity_a0 * Math.pow(diskDiameter, 3) + rapidity_a1 * 
    Math.pow(diskDiameter, 2) + rapidity_a2 * diskDiameter + rapidity_a3);
}