const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentNumber = "0";
let storedNumber = null;
let selectedOperator = null;
let shouldResetDisplay = false;
let displayExpression = "0";

function updateDisplay() {
  display.textContent = displayExpression;
}

function syncDisplayExpression() {
  if (selectedOperator) {
    displayExpression = `${storedNumber}${selectedOperator}${currentNumber}`;
  } else {
    displayExpression = currentNumber;
  }
}

function inputNumber(value) {
  if (currentNumber === "エラー") {
    currentNumber = value === "." ? "0." : value;
    storedNumber = null;
    selectedOperator = null;
    shouldResetDisplay = false;
    syncDisplayExpression();
    updateDisplay();
    return;
  }

  if (shouldResetDisplay) {
    currentNumber = value === "." ? "0." : value;
    shouldResetDisplay = false;
    syncDisplayExpression();
    updateDisplay();
    return;
  }

  if (value === "." && currentNumber.includes(".")) {
    return;
  }

  if (currentNumber === "0" && value !== ".") {
    currentNumber = value;
  } else {
    currentNumber += value;
  }

  syncDisplayExpression();
  updateDisplay();
}

function calculate(firstNumber, secondNumber, operator) {
  const first = Number(firstNumber);
  const second = Number(secondNumber);

  switch (operator) {
    case "＋":
      return first + second;
    case "－":
      return first - second;
    case "×":
      return first * second;
    case "÷":
      return second === 0 ? "エラー" : first / second;
    default:
      return second;
  }
}

function chooseOperator(operator) {
  if (selectedOperator && !shouldResetDisplay) {
    const result = calculate(storedNumber, currentNumber, selectedOperator);
    currentNumber = String(result);

    if (result === "エラー") {
      storedNumber = null;
      selectedOperator = null;
      shouldResetDisplay = true;
      syncDisplayExpression();
      updateDisplay();
      return;
    }

    storedNumber = currentNumber;
  } else {
    storedNumber = currentNumber;
  }

  selectedOperator = operator;
  shouldResetDisplay = true;
  displayExpression = `${storedNumber}${selectedOperator}`;
  updateDisplay();
}

function showResult() {
  if (!selectedOperator || storedNumber === null) {
    return;
  }

  currentNumber = String(calculate(storedNumber, currentNumber, selectedOperator));
  selectedOperator = null;
  storedNumber = null;
  shouldResetDisplay = true;
  syncDisplayExpression();
  updateDisplay();
}

function clearCalculator() {
  currentNumber = "0";
  storedNumber = null;
  selectedOperator = null;
  shouldResetDisplay = false;
  syncDisplayExpression();
  updateDisplay();
}

function deleteLastDigit() {
  if (shouldResetDisplay || currentNumber.length === 1 || currentNumber === "エラー") {
    currentNumber = "0";
  } else {
    currentNumber = currentNumber.slice(0, -1);
  }

  syncDisplayExpression();
  updateDisplay();
}

buttons.addEventListener("click", (event) => {
  const button = event.target;

  if (button.dataset.number) {
    inputNumber(button.dataset.number);
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  }

  if (button.dataset.action === "calculate") {
    showResult();
  }

  if (button.dataset.action === "clear") {
    clearCalculator();
  }

  if (button.dataset.action === "delete") {
    deleteLastDigit();
  }
});
