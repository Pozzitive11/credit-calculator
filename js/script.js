const FIST_CREDIT_CURRENT_RATE = 0.0001;
const FIST_CREDIT_DISCOUNT_RATE = 0.04;

const REPEATED_CREDIT_CURRENT_RATE = 0.02;
const REPEATED_CREDIT_DISCOUNT_RATE = 0.04;

const CALCULATION_PERIOD_DAYS = 730;

const formGroups = document.querySelectorAll(".form__group");
const formButton = document.querySelector(".form__button");
const form = document.getElementById("loanForm");
const loanAmount = document.getElementById("loanAmount");
const repaymentPeriod = document.getElementById("repaymentPeriod");
const errorLoan = document.querySelector(".form__error--loan");
const errorRepayment = document.querySelector(
  ".form__error--repayment"
);
const bodyAmountSpans = document.querySelectorAll(
  '[data-calculator-variable="body_amount"]'
);
const term = document.querySelector(
  '[data-calculator-variable="term"]'
);

const commissionAmountBlock = document.querySelector(
  '[data-calculator-variable="commission_amount"]'
);

const totalAmountBlock = document.querySelector(
  '[data-calculator-variable="total_amount"]'
);
const xirrBlock = document.querySelector(
  '[data-calculator-variable="xirr"]'
);
const dailyRateBlock = document.querySelector(
  '[data-calculator-variable="daily_rate"]'
);

const firstCreditButton = document.querySelector(
  '[data-calculator-variable="first_credit"]'
);

const repeatedCreditButton = document.querySelector(
  '[data-calculator-variable="repeated_credit"]'
);
const table = document.getElementById("dataTable");
const tbody = table.querySelector("tbody");

// const dailyRepaymentBlock = document.querySelector(
//   ".repayment__daily_value span"
// );
// const totalRepaymentBlock = document.querySelector(
//   ".repayment__total_value span"
// );

firstCreditButton.addEventListener("click", handleTabClick);
repeatedCreditButton.addEventListener("click", handleTabClick);

let currentRate = FIST_CREDIT_CURRENT_RATE;
let repeatedRate = FIST_CREDIT_DISCOUNT_RATE;

function handleTabClick(event) {
  // Вимкніть активний клас у всіх кнопок
  firstCreditButton.classList.remove("active");
  repeatedCreditButton.classList.remove("active");

  // Отримайте кнопку, на яку натиснули
  const clickedButton = event.target;

  // Включіть активний клас для обраної кнопки
  clickedButton.classList.add("active");

  // Додайте вашу логіку для зміни вмісту або оновлення інтерфейсу відповідно до вибраної вкладки
  if (clickedButton === firstCreditButton) {
    currentRate = FIST_CREDIT_CURRENT_RATE;
    repeatedRate = FIST_CREDIT_DISCOUNT_RATE;
  } else if (clickedButton === repeatedCreditButton) {
    currentRate = REPEATED_CREDIT_CURRENT_RATE;
    repeatedRate = REPEATED_CREDIT_DISCOUNT_RATE;
  }
  calculateLoan();
}

const calculateLoan = () => {
  const loanAmountValue = parseFloat(loanAmount.value);
  const repaymentPeriodValue = parseInt(repaymentPeriod.value);

  tbody.innerHTML = "";
  const rowNumber = 730 - repaymentPeriodValue;
  // Date =========================================
  const today = new Date();
  const firstPay = new Date(today);
  firstPay.setDate(today.getDate() + repaymentPeriodValue - 1);
  const dates = [];
  dates.push(firstPay);
  for (let i = 0; i < rowNumber; i++) {
    const nextDate = new Date(dates[i]);
    nextDate.setDate(nextDate.getDate() + 1);
    dates.push(nextDate);
  }

  // =========================================
  const payments = [];
  payments.push(loanAmountValue);

  const interestForUsingCredit = [];
  interestForUsingCredit.push(loanAmountValue * currentRate);
  for (let i = 0; i < rowNumber; i++) {
    const row = tbody.insertRow(i);
    const cellDate = row.insertCell(0);
    const cellInterest = row.insertCell(1);
    const cellPayment = row.insertCell(2);
    const cellServiceFee = row.insertCell(3);
    const cellIntermediaryFee = row.insertCell(4);
    const cellThirdPartyFee = row.insertCell(5);

    const formattedDate = dates[i].toLocaleDateString();
    cellDate.innerHTML = formattedDate;

    if (i === rowNumber - 1) {
      // Якщо це останній рядок, вставляємо значення loanAmountValue
      payments.unshift(loanAmountValue);
      cellPayment.innerHTML = loanAmountValue.toFixed(2) + " грн";
    } else {
      // Якщо не останній рядок, вставляємо "0,00 грн"
      payments.unshift(0);
      cellPayment.innerHTML = "0.00 грн";
    }

    interestForUsingCredit.push(loanAmountValue * repeatedRate);
    cellInterest.innerHTML = interestForUsingCredit[i];

    cellServiceFee.innerHTML = "0.00 грн";
    cellIntermediaryFee.innerHTML = "0.00 грн";
    cellThirdPartyFee.innerHTML = "0.00 грн";
  }

  // Оновлення всіх місць виведення суми кредиту
  bodyAmountSpans.forEach((span) => {
    span.textContent = loanAmountValue.toFixed(2) + " грн";
  });

  term.textContent = repaymentPeriodValue;
  const commissionAmount = interestForUsingCredit.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  commissionAmountBlock.innerHTML =
    commissionAmount.toFixed(2) + " грн";
  totalAmountBlock.innerHTML =
    (commissionAmount + loanAmountValue).toFixed(2) + " грн";
  const dailyRate =
    ((commissionAmount / loanAmountValue / rowNumber) * 100).toFixed(
      2
    ) + "%";
  dailyRateBlock.innerHTML = dailyRate;
  //
  //
  //
  //
  //
  const dateObjects = dates.map(
    (dateString) => new Date(dateString.toLocaleDateString())
  );
  const newPayments = interestForUsingCredit.slice();
  const firstPayment = newPayments[0];
  newPayments[0] = -Math.abs(firstPayment);
  console.log(xirr(newPayments, dateObjects));

  //   const dailyRepayment =
  //     (loanAmountValue +
  //       loanAmountValue * (interestRate / 100) * repaymentPeriodValue) /
  //     repaymentPeriodValue;
  //   const totalRepayment = dailyRepayment * repaymentPeriodValue;

  //   dailyRepaymentBlock.textContent = dailyRepayment.toFixed(2);
  //   totalRepaymentBlock.textContent = totalRepayment.toFixed(2);
};
// Синхронізація значень між інпутами
const synchronizeInputs = () => {
  formGroups.forEach((block) => {
    const inputs = block.querySelectorAll("input");
    inputs.forEach((inp, i) =>
      inp.addEventListener(
        "input",
        () => (inputs[1 - i].value = inputs[i].value)
      )
    );
  });
};

// Валідація форми
const validateForm = () => {
  form.addEventListener("input", () => {
    const loanAmountValue = parseFloat(loanAmount.value);
    const repaymentPeriodValue = parseFloat(repaymentPeriod.value);

    let loanAmountValid = true;
    let repaymentPeriodValid = true;

    // Валідація суми кредиту
    if (
      isNaN(loanAmountValue) ||
      loanAmountValue < 1000 ||
      loanAmountValue > 50000
    ) {
      loanAmountValid = false;
      errorLoan.classList.add("visible");
    } else {
      errorLoan.classList.remove("visible");
    }

    // Валідація періоду погашення
    if (
      isNaN(repaymentPeriodValue) ||
      repaymentPeriodValue < 7 ||
      repaymentPeriodValue > 60
    ) {
      repaymentPeriodValid = false;
      errorRepayment.classList.add("visible");
    } else {
      errorRepayment.classList.remove("visible");
    }

    // Встановлення стану кнопки
    formButton.disabled = !(loanAmountValid && repaymentPeriodValid);

    setTimeout(() => {
      calculateLoan();
    }, 1000);
  });
};

// Ініціалізація
synchronizeInputs();
validateForm();

calculateLoan();

function xirr(cashflows, dates) {
  function npv(rate) {
    return cashflows.reduce((acc, val, i) => {
      var days = (dates[i] - dates[0]) / 86400000; // convert milliseconds to days
      return acc + val / Math.pow(1 + rate, days / 365);
    }, 0);
  }

  var lowRate = -0.999;
  var highRate = 1;
  var maxIterations = 1000;
  var tolerance = 0.0000001;
  var newRate,
    npvVal,
    iteration = 0;

  do {
    newRate = (lowRate + highRate) / 2;
    npvVal = npv(newRate);

    if (npvVal > 0) {
      lowRate = newRate;
    } else {
      highRate = newRate;
    }

    iteration++;
  } while (Math.abs(npvVal) > tolerance && iteration < maxIterations);

  if (iteration >= maxIterations) {
    throw new Error("XIRR did not converge");
  }

  return newRate;
}
