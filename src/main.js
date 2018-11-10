import './style/main.scss';
import * as firebase from 'firebase';
import config from './scripts/firebase-config';
import {restriction} from './scripts/constants';
import * as Services from  './scripts/services';
import * as ValidateService from  './scripts/validate';
import ErrorMessage from './scripts/error-mssage';

firebase.initializeApp(config);

const linkBtn = document.querySelectorAll('.message a');
const forms = document.querySelectorAll('form');

const $registerForm = document.getElementById('register-form');
const $name = document.getElementById('name');
const $email = document.getElementById('email');
const $password = document.getElementById('password');
const $errorMessage = document.getElementById('errorMessage');

const errorMessageHandler = new ErrorMessage();

const registerForm = event => {
  event.preventDefault();

  errorMessageHandler.hide($errorMessage);

  const name = $name.value;
  const email = $email.value;
  const password = $password.value;

  const user = Object.assign({}, {
    name: name,
    password: password,
    email: email
  });

  if (isCustomerValid(user)) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(() => {
        const usr = firebase.auth().currentUser;

        usr.updateProfile({
          displayName: name,
        }).then(() => {
          window.location = 'collections.html';

        }).catch(error => {
          const errorMessage = error.message;
          errorMessageHandler.show(
            $errorMessage,
            `Error : ${errorMessage}`
          );
        });

      })
      .catch(error => {
        const errorMessage = error.message;

        errorMessageHandler.show(
          $errorMessage,
          `Error : ${errorMessage}`
        );
      });
  } else {

    errorMessageHandler.show(
      $errorMessage,
      'Please correctly fill out the fields to confirm your registration.'
    );
  }
};

const isCustomerValid = ({name, password, email}) => {
  return ValidateService.validateName(name) &&
    ValidateService.validatePassword(password) &&
    ValidateService.validateEmail(email);
};

const showInputError = (input, minLength, maxLength) => {
  switch (input.type) {
    case 'text' :
      Services.addListenerMulti(input, 'keydown keyup change', () => {
        const char = input.value;
        const charLength = input.value.length;
        const parent = input.parentElement;
        const message = parent.querySelector('.message');

        if (char && charLength < minLength) {
          Services.showErrorLabel(
            parent,
            message,
            `Length is short, minimum ${minLength} required.`
          );
        } else if (charLength > maxLength) {
          Services.showErrorLabel(
            parent,
            message,
            `Length is not valid, maximum ${maxLength} allowed.`
          );

          parent.value = char.substring(0, maxLength);
        } else {
          Services.showSuccessLabel(
            parent,
            message,
            'Length is valid'
          );
        }
      });
      break;
    case 'email':
      Services.addListenerMulti(input, 'keydown keyup change', () => {
        const char = input.value;
        const parent = input.parentElement;
        const message = parent.querySelector('.message');

        if (!ValidateService.validateEmail(char)) {
          Services.showErrorLabel(
            parent,
            message,
            'Email is not valid'
          );
        } else {
          Services.showSuccessLabel(
            parent,
            message,
            'Email is valid'
          );
        }
      });
      break;
    case 'password': {
      Services.addListenerMulti(input, 'keydown keyup change', () => {
        const char = input.value;
        const charLength = input.value.length;
        const parent = input.parentElement;
        const message = parent.querySelector('.message');

        if (char && charLength < minLength) {
          Services.showErrorLabel(
            parent,
            message,
            `Length is short, minimum ${minLength} required.`
          );
        } else if (charLength > maxLength) {
          Services.showErrorLabel(
            parent,
            message,
            `Length is not valid, maximum ${maxLength} allowed.`
          );

          parent.value = char.substring(0, maxLength);
        } else {
          Services.showSuccessLabel(
            parent,
            message,
            'Length is valid'
          );
        }
      });
    }
  }
};

const initShowInputError = () => {
  showInputError($name, restriction.minLength.name, restriction.maxLength.name);
  showInputError($password, restriction.minLength.password, restriction.maxLength.password);
  showInputError($email);
};

const init = () => {
  initShowInputError();

  linkBtn
    .forEach(link => {
      link.addEventListener('click', () => {
        forms
          .forEach(form => {
            form.classList.toggle('collapsed');
          });
      });
    });

  $registerForm.addEventListener('submit', event => {
    registerForm(event);
  });

};

init();
