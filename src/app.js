/* eslint-env es6 */

const inputReason = document.querySelector("#input-reason");
const inputAmount = document.querySelector("#input-amount");
const btnClear = document.querySelector("#btn-clear");
const btnAdd = document.querySelector("#btn-add");
const listExpenses = document.querySelector("#list-expenses");
const totalExpenses = document.querySelector("#total-expenses");
const alertComponent = document.querySelector("#alert-component");

let totalAmount = 0;

const clearFunction = () => {
  inputReason.value = '';
  inputAmount.value = '';
}

btnAdd.addEventListener('click', () => {
  const enteredReason = inputReason.value;
  const enteredAmount = inputAmount.value;
  if (enteredReason.trim().length <= 0 || enteredAmount.trim().length <= 0 || enteredAmount <= 0) {
    console.log("Invalid");
    return;
  }

  const newItem = document.createElement('ion-item');
  newItem.textContent = enteredReason + ': ' + enteredAmount + '$';
  listExpenses.appendChild(newItem);
  console.log(enteredReason, enteredAmount);
  totalAmount += +enteredAmount;
  totalExpenses.textContent = totalAmount;
  clearFunction();
});

btnClear.addEventListener('click', clearFunction);


// async function handleButtonClick() {
//   const alert = await alertController.create({
//     header: 'Use this lightsaber?',
//     message: 'Do you agree to use this lightsaber to do good across the galaxy?',
//     buttons: ['Disagree', 'Agree']
//   });

//   await alert.present();
// }
