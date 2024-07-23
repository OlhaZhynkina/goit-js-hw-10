import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import iconSuccess from '../img/success.svg';
import iconError from '../img/error.svg';

const formElement = document.querySelector('form');

formElement.addEventListener('submit', onCreateNotification);

function onCreateNotification(event) {
  event.preventDefault();
  const receivedTime = event.target.elements.delay.value;

  const radioSelection = event.target.elements.state.value;

  const notification = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (radioSelection === 'fulfilled') {
        return resolve(receivedTime);
      }
      if (radioSelection === 'rejected') {
        return reject(receivedTime);
      }
    }, receivedTime);
  });
  notification
    .then(() => {
      iziToast.success({
        iconUrl: iconSuccess,
        title: 'OK',
        titleColor: '#fff',
        messageColor: '#fff',
        backgroundColor: '#59a10d',
        position: 'topRight',
        message: `Fulfilled promise in ${receivedTime}ms`,
        timeout: `${receivedTime}`,
      });
    })
    .catch(() => {
      iziToast.error({
        iconUrl: iconError,
        title: 'Error',
        titleColor: '#fff',
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        position: 'topRight',
        message: `Rejected promise in ${receivedTime}ms`,
        timeout: `${receivedTime}`,
      });
    });
  event.target.reset();
}
