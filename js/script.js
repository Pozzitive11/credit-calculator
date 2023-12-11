const formGroups = document.querySelectorAll(".form__group");
const formButton = document.querySelector(".form__button");
const form = document.getElementById("loanForm");
const loanAmount = document.getElementById("loanAmount");
const repaymentPeriod = document.getElementById("repaymentPeriod");
const errorLoan = document.querySelector(".form__error--loan");
const errorRepayment = document.querySelector(
  ".form__error--repayment"
);
const dailyRepaymentBlock = document.querySelector(
  ".repayment__daily_value span"
);
const totalRepaymentBlock = document.querySelector(
  ".repayment__total_value span"
);

// Розрахунок сум погашень
const calculateLoan = () => {
  const loanAmountValue = parseFloat(loanAmount.value);
  const repaymentPeriodValue = parseInt(repaymentPeriod.value);
  const interestRate = 2.2;

  const dailyRepayment =
    (loanAmountValue +
      loanAmountValue * (interestRate / 100) * repaymentPeriodValue) /
    repaymentPeriodValue;
  const totalRepayment = dailyRepayment * repaymentPeriodValue;

  dailyRepaymentBlock.textContent = dailyRepayment.toFixed(2);
  totalRepaymentBlock.textContent = totalRepayment.toFixed(2);
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

    calculateLoan();
  });
};

// Ініціалізація
synchronizeInputs();
validateForm();
