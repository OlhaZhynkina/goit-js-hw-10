import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

import iconError from '../img/error.svg';

const calendarInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

startBtn.addEventListener('click', onStartTimer);

let userSelectedDate;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    startBtn.disabled = true;
    if (selectedDates[0] < new Date()) {
      return iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        messageColor: '#fff',
        titleColor: '#fff',
        backgroundColor: '#ef4040',
        position: 'topRight',
        iconUrl: iconError,
        iconColor: '#fff',
        progressBarColor: '#b51b1b',
        overlayColor: '#ffbebe',
      });
    }
    userSelectedDate = selectedDates[0];
    startBtn.disabled = false;
  },
};

flatpickr(calendarInput, options);

function onStartTimer() {
  startBtn.disabled = true;
  calendarInput.disabled = true;
  const counting = setInterval(() => {
    const currentDate = Date.now();
    const differenceData = userSelectedDate - currentDate;
    const { days, hours, minutes, seconds } = convertMs(differenceData);

    createMarkup({ days, hours, minutes, seconds });

    if (differenceData < 1000) {
      clearInterval(counting);
      calendarInput.disabled = false;
    }
  }, 1000);
}

function createMarkup({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
