const synth = window.speechSynthesis;
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
var hearing = false;

var synthVoices = [];
var hearingLang = ['en-US', 'es-US'];

const textToRead = document.getElementById("textToSpeak");
const manualInput = document.getElementById("manualInput");
const screen = document.getElementById("transcript")

const rate = document.getElementById("rate");
const rateValue = document.getElementById("rateValue");
const pitch = document.getElementById("pitch");
const pitchValue = document.getElementById("pitchValue");

const voices = document.getElementById("voice");
var currentVoice = "";
const txtColor = document.getElementById("color");
const txtSize = document.getElementById("txtSize");

const startButton = document.getElementById("start");
const spanish = document.getElementById("spanish");
const english = document.getElementById("english");
var grnScrn = false;

const spaCen = ["p***", "c*****"];
const spaUncen = ["puta", "carajo"];

const engCen = ["f******", "f*****", "f***", "s***"];
const engUncen = ["fucking", "fucker", "fuck", "shit"];


window.onload = function() {
    populateVoices();
    setDefault();
    greenScrn();
    //englishButton();
    
};

function setDefault(){
    voice.selectedIndex = 0;
    textToRead.innerText = '';
    manualInput.innerText = '';
};

function greenScrn() {
    if (grnScrn) {screen.style.background = "white"; grnScrn = false; return};
    if (!grnScrn) {screen.style.background = "chartreuse"; grnScrn = true};
}

pitch.onchange = function () {
    pitchValue.innerText = pitch.value;
};
  
rate.onchange = function () {
    rateValue.innerText = rate.value;
};
  
txtColor.onchange = function() {textToRead.style.color = txtColor.value};

txtSize.onchange = function() {textToRead.style.fontSize = txtSize.value + "px"}

function populateVoices() {
    let voices = synth.getVoices().sort()
    synthVoices = voices;
    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement("option");
        option.textContent = voices[i].name;
        option.value = voices[i];
        voice.appendChild(option);
      }
};

voice.onchange = function() {
    currentVoice = voice.selectedIndex;
};

function playManualText() {
    if (manualInput.value == '') {speak(); return};
    textToRead.innerText = manualInput.value;
    manualInput.value = '';
    speak();
};

function englishButton() {
    stopHearing();
    voice.selectedIndex = 0;
    currentVoice = voice.selectedIndex;
    recognition.lang = hearingLang[0];
    if (!hearing) {startRecognition()};    
};
  
function spanishButton() {
    stopHearing();
    voice.selectedIndex = 7;
    currentVoice = voice.selectedIndex;
    recognition.lang = hearingLang[1];
    if (!hearing) {startRecognition()};    
};

function startRecognition() {
    hearing = !hearing;
    if (hearing) {startHearing(); return};
    if (!hearing) {stopHearing(); return};
}

function startHearing() {
    recognition.start();
    startButton.innerText = "Stop";
};

function stopHearing() {
    recognition.stop();
    startButton.innerText = "Start";
};

recognition.onend = function() { if (hearing) {startHearing()} };

recognition.onresult = function(event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            transcript = event.results[i][0].transcript;
        }
    }

    if (currentVoice == 7) { 
        for (let i = 0; i < spaCen.length; i++){
        transcript = transcript.replaceAll(spaCen[i], spaUncen[i]);
        }
    }

    if (currentVoice == 0) { 
        for (let i = 0; i < engCen.length; i++){
        transcript = transcript.replaceAll(engCen[i], engUncen[i]);
        }
    }

    transcript = capitalize(transcript);
    textToRead.innerText = transcript;
    speak();
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function speak() {
    if (synth.speaking) {
        return;
    }

    if (textToRead.innerText !== "") {
        const sayThis = new SpeechSynthesisUtterance(textToRead.innerText);
        sayThis.voice = synthVoices[currentVoice];
        sayThis.pitch = pitch.value;
        sayThis.rate = rate.value;
        synth.speak(sayThis);
    }
};
