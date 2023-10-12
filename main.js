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

  function textToCode39(text) {
    const startingSymbol = "010010100";
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