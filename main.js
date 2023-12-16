// Basic colors
const WHITE = "bisque";
const BLACK = "#000000";

// Basic dimensions
const barWidth = 4;
const canvasHeight = 200;

function generateCode39(input) {
  const code39Table = {
    0: "000110100",
    1: "100100001",
    2: "001100001",
    3: "101100000",
    4: "000110001",
    5: "100110000",
    6: "001110000",
    7: "000100101",
    8: "100100100",
    9: "001100100",
    A: "100001001",
    B: "001001001",
    C: "101001000",
    D: "000011001",
    E: "100011000",
    F: "001011000",
    G: "000001101",
    H: "100001100",
    I: "001001100",
    J: "000011100",
    K: "100000011",
    L: "001000011",
    M: "101000010",
    N: "000010011",
    O: "100010010",
    P: "001010010",
    Q: "000000111",
    R: "100000110",
    S: "001000110",
    T: "000010110",
    U: "110000001",
    V: "011000001",
    W: "111000000",
    X: "010010001",
    Y: "110010000",
    Z: "011010000",
    " ": "011000100",
  };

  const startingSymbol = "010010100";

  function textToCode39(text) {
    let result = startingSymbol + "0";
    text = text.toUpperCase();

    for (let i = 0; i < text.length; i++) {
      if (code39Table.hasOwnProperty(text[i])) {
        result += code39Table[text[i]] + "0";
      } else {
        throw new Error("Error symbol: " + text[i]);
      }
    }

    result += startingSymbol;
    setCodeBox(result);
    return result;
  }

  return textToCode39(input);
}

function drawCode39(inputText) {
  const code39 = generateCode39(inputText);

  const canvas = document.querySelector("#canvas");

  if (!canvas.getContext) {
    return;
  }

  const context = canvas.getContext("2d");
  const canvasWidth = ((code39.length * 4) / 3) * barWidth;
  context.canvas.width = canvasWidth;
  context.canvas.height = canvasHeight + 50;
  context.fillStyle = BLACK;

  let trackWidth = 0;

  for (let i = 0; i < code39.length; i++) {
    if (i % 2 === 0) {
      context.fillStyle = BLACK;
    } else context.fillStyle = WHITE;

    if (code39[i] == "1") {
      context.fillRect(
        i * barWidth + trackWidth,
        0,
        barWidth * 2,
        canvasHeight
      );
      trackWidth += barWidth;
    } else
      context.fillRect(i * barWidth + trackWidth, 0, barWidth, canvasHeight);
  }

  context.fillStyle = BLACK;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "28px Arial";
  context.fillText(inputText.toUpperCase(), canvasWidth / 2, canvasHeight + 20);
}

function setCodeBox(code) {
  document.querySelector(".code-box").textContent = code;
}

function submitCode() {
  const inputText = document.querySelector("#input").value;
  drawCode39(inputText);
}

document.querySelector("#submit").addEventListener("click", submitCode);

drawCode39("12345");

function scanCode(event) {
  const targetImage = event.target.files[0];
  var image = document.getElementById("output");
  image.src = URL.createObjectURL(targetImage);
}

var mediaStream = null;

function createVideoStream() {
  const video = document.querySelector("#video");
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = {
      video: true,
      audio: false,
    };
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      mediaStream = stream;
      mediaStream.stop = function () {
        this.getAudioTracks().forEach(function (track) {
          track.stop();
        });
        this.getVideoTracks().forEach(function (track) {
          track.stop();
        });
      };
      return (video.srcObject = stream);
    });
  }
}

function stopStream() {
  mediaStream.stop();
  document.querySelector("#video").style.display = "none";
}

const barcodeDetector = new BarcodeDetector({ formats: ["code_39"] });

const detectCode = () => {
  barcodeDetector
    .detect(video)
    .then((codes) => {
      if (codes.length === 0) return;
      for (const barcode of codes) {
        console.log(barcode);
        stopStream();
        document.querySelector("#input").value = barcode.rawValue;
        drawCode39(barcode.rawValue);

        const item = getStorageItemById(barcode.rawValue);
        item.count += 1;
        updateStorageItem(item);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
setInterval(detectCode, 400);

function startStream() {
  document.querySelector("#video").style.display = "block";
  createVideoStream();
}

document.querySelector("#scan").addEventListener("click", startStream);

const initialArray = [
  {
    id: "542637",
    title: "Bread",
    lastScanned: `${formatDate(new Date(2023, 11, 15, 14, 32, 20))}`,
    count: 7,
  },
  {
    id: "395376",
    title: "Apple",
    lastScanned: `${formatDate(new Date(2023, 11, 16, 15, 28, 12))}`,
    count: 18,
  },
  {
    id: "827635",
    title: "Pizza",
    lastScanned: `${formatDate(new Date(2023, 11, 16, 14, 12, 15))}`,
    count: 1,
  },
];

function setStorageArray(arr) {
  return localStorage.setItem("storage", JSON.stringify(arr));
}

function getStorageArray() {
  return JSON.parse(localStorage.getItem("storage"));
}

function getStorageItemById(id) {
  const arr = getStorageArray();
  const item = arr.find((item) => item.id === id);
  return item;
}

function updateStorageItem(itemToUpdate) {
  const arr = getStorageArray();
  const itemIndex = arr.findIndex((item) => item.id === itemToUpdate.id);
  const date = formatDate(Date.now());
  arr[itemIndex] = itemToUpdate;
  arr[itemIndex].lastScanned = `${date}`;
  setStorageArray(arr);
  updateTable();
}

function removeStorageItem(itemIdToRemove) {
  const arr = getStorageArray();
  arr.splice(
    arr.findIndex((item) => item.id === itemIdToRemove),
    1
  );
  setStorageArray(arr);
}

function addStorageItem(itemTitle) {
  const newItem = { title: itemTitle };
  let newId = Math.round(Math.random() * 1000000 - 1);
  while (newId % 10 === 0) {
    newId = Math.round(Math.random() * 1000000 - 1);
  }

  newItem.id = newId;
  newItem.lastScanned = formatDate(Date.now());
  newItem.count = 0;
  const arr = getStorageArray();
  arr.push(newItem);
  setStorageArray(arr);
}

if (!getStorageArray()) setStorageArray(initialArray);
updateTable();

function updateTable() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  const storage = getStorageArray();

  for (let i = 0; i < storage.length; i++) {
    const row = document.createElement("tr");

    const cell_1 = document.createElement("td");
    const id = document.createTextNode(`${storage[i].id}`);
    cell_1.appendChild(id);
    row.appendChild(cell_1);

    const cell_2 = document.createElement("td");
    const title = document.createTextNode(`${storage[i].title}`);
    cell_2.appendChild(title);
    row.appendChild(cell_2);

    const cell_3 = document.createElement("td");
    const count = document.createTextNode(`${storage[i].count}`);
    cell_3.appendChild(count);
    row.appendChild(cell_3);

    const cell_4 = document.createElement("td");
    const lastScanned = document.createTextNode(`${storage[i].lastScanned}`);
    cell_4.appendChild(lastScanned);
    row.appendChild(cell_4);

    tableBody.appendChild(row);
  }
}

function formatDate(date) {
  var d = new Date(date);
  month = "" + (d.getMonth() + 1);
  day = "" + d.getDate();
  year = d.getFullYear();
  hours = d.getHours();
  minutes = d.getMinutes();
  seconds = d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (seconds.length < 2) seconds = "0" + seconds;

  let res = [year, month, day].join("-");
  let time = [hours, minutes, seconds].join(":");
  return [res, time].join(", ");
}

document
  .getElementById("submit-new-item")
  .addEventListener("click", function () {
    const input = document.getElementById("new-item-input");
    const itemTitle = input.value;
    if (itemTitle) {
      addStorageItem(itemTitle);
      updateTable();
      input.value = "";
    }
  });

document.getElementById("remove-item").addEventListener("click", function () {
  const input = document.getElementById("remove-item-input");
  const inputId = input.value;
  if (inputId) {
    removeStorageItem(inputId);
    updateTable();
    input.value = "";
  }
});
