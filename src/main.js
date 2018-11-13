import './style/main.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import config from './scripts/firebase-config';
import {restriction} from './scripts/constants';
import * as Services from './scripts/services';
import * as ValidateService from './scripts/validate';
import ErrorMessage from './scripts/error-mssage';

import CollectionList from './scripts/collection-list';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faPlus,
  faSignOutAlt,
  faSignInAlt,
  faTrashAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons/index';

import {Modal} from 'windowise';
import 'windowise/src/sass/style.scss';

library.add(faEdit, faPlus, faSignOutAlt, faSignInAlt, faTrashAlt, faUserPlus );
dom.watch();

const linkBtn = document.querySelectorAll('.message a');
const forms = document.querySelectorAll('form');

const $loginWrapper = document.getElementById('login-wrapper');
const $detailsUser = document.getElementById('details-user');
const $collectionWrapper = document.getElementById('collection-wrapper');
const $details = document.getElementById('details');
const $registerForm = document.getElementById('register-form');
const $loginForm = document.getElementById('login-form');
const $signOutBtn = document.getElementById('sign-out');
const $name = document.getElementById('name');
const $email = document.getElementById('email');
const $password = document.getElementById('password');
const $errorMessage = document.getElementById('errorMessage');
const $username = document.getElementById('username');
const $usernamePwd = document.getElementById('usernamePwd');

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
          displayName: name
        }).then(() => {
          $detailsUser.innerText = name;
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

const loginForm = event => {
  event.preventDefault();

  errorMessageHandler.hide($errorMessage);

  const username = $username.value;
  const password = $usernamePwd.value;
  const user = Object.assign({}, {
    email: username,
    password: password
  });

  if (username && password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then()
      .catch(function (error) {
        const errorMessage = error.message;

        errorMessageHandler.show(
          $errorMessage,
          `Error : ${errorMessage}`
        );
      });
  } else {
    errorMessageHandler.show(
      $errorMessage,
      'Please correctly fill out the fields to sign in.'
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

const initApp = () => {
  firebase
    .auth()
    .onAuthStateChanged(function (user) {
      if (user) {
        Services.showContent($details);
        Services.showContent($collectionWrapper);
        Services.hideContent($loginWrapper);

        $detailsUser.innerText = user.displayName;

        const loginRef = firebase.database().ref('users');
        const userLoginRef = loginRef.child(user.uid);
        const userLoginCollectionRef = userLoginRef.child('collections');
        const userLoginInfoCollectionRef = userLoginRef.child('info');

        userLoginInfoCollectionRef.set({
          email: user.email,
          emailVerified: user.emailVerified
        });

        userLoginCollectionRef.on('value', function (snapshot) {
          const exists = (snapshot.val() !== null);

          if (exists) {
            const collection = snapshot.val();
            new CollectionList(collection, user.uid);
          } else {
            new CollectionList(null, user.uid);
          }
        });

        $signOutBtn.addEventListener('click', function (event) {
          event.preventDefault();
          const modalWindow = new Modal({
            type: 'caution',
            title: 'Are you sure you want to sign out?',
            buttons: [
              {
                id: 'yes',
                key: 13,
                text: 'Yes'
              },
              {
                id: 'no',
                key: 27,
                text: 'No',
                normal: true
              }
            ],
            keepOverlay: false
          });

          modalWindow.open();

          modalWindow.getPromise().then( id => {
            (id === 'yes') ? logOut() : modalWindow.close();
          });

        });
      } else {
        Services.hideContent($details);
        Services.hideContent($collectionWrapper);
        Services.showContent($loginWrapper);

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

        $loginForm.addEventListener('submit', event => {
          loginForm(event);
        });
      }
    });
};

const logOut = () => {
  firebase.auth().signOut().then(() => {

  });
};

const init = () => {
  firebase.initializeApp(config);
  initApp();
};

init();
