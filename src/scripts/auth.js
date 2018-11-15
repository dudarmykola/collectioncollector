import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import {Modal} from 'windowise';

import {restriction} from './constants';
import * as Services from './services';
import * as ValidateService from './validate';
import ErrorMessage from './error-message';

class Auth {
  constructor (user) {
    this.user = user;

    this.$loginBtn = document.getElementById('login-btn');
    this.$registerBtn = document.getElementById('register-btn');
    this.$loginWrapper = document.getElementById('login-wrapper');
    this.$collectionWrapper = document.getElementById('collection-wrapper');
    this.$details = document.getElementById('details');
    this.$registerForm = document.getElementById('register-form');
    this.$loginForm = document.getElementById('login-form');
    this.$name = document.getElementById('name');
    this.$email = document.getElementById('email');
    this.$password = document.getElementById('password');
    this.$errorMessage = document.getElementById('errorMessage');
    this.$username = document.getElementById('username');
    this.$usernamePwd = document.getElementById('usernamePwd');

    this.errorMessage = new ErrorMessage(this.$errorMessage);

    this.render();

  }

  signIn (event) {
    event.preventDefault();

    this.errorMessage.hide();

    const user = Object.assign({}, {
      email: this.$username.value,
      password: this.$usernamePwd.value
    });

    if (user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then()
        .catch( error => {
          const errorMessage = error.message;

          this.errorMessage.show(`Error : ${errorMessage}`);
        });
    } else {
      this.errorMessage.show('Please correctly fill out the fields to sign in.');
    }
  }

  signUp (event) {
    event.preventDefault();

    const user = Object.assign({}, {
      name: this.$name.value,
      password: this.$password.value,
      email: this.$email.value
    });

    this.errorMessage.hide();

    if (this.isCustomerValid(user)) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(() => {
          const usr = firebase.auth().currentUser;

          usr.updateProfile({
            displayName: name
          }).catch(error => {
            const errorMessage = error.message;

            this.errorMessage.show(`Error : ${errorMessage}`);
          });

        })
        .catch(error => {
          const errorMessage = error.message;

          this.errorMessage.show(`Error : ${errorMessage}`);
        });
    } else {
      this.errorMessage.show('Please correctly fill out the fields to confirm your registration.');
    }
  }

  signOut (event) {
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
      if (id === 'yes') {
        firebase.auth().signOut();
      } else {
        modalWindow.close();
      }
    });
  }

  isCustomerValid ({name, password, email}) {
    return ValidateService.validateName(name) && ValidateService.validatePassword(password) &&
    ValidateService.validateEmail(email);
  }

  showInputError (input, minLength, maxLength) {
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
  }

  initShowInputError () {
    this.showInputError(this.$name, restriction.minLength.name, restriction.maxLength.name);
    this.showInputError(this.$password, restriction.minLength.password, restriction.maxLength.password);
    this.showInputError(this.$email);
  }

  render () {
    Services.hideContent(this.$details);
    Services.hideContent(this.$collectionWrapper);
    Services.showContent(this.$loginWrapper);

    this.initShowInputError();

    this.$loginBtn.addEventListener('click', () => {
      this.$loginForm.classList.remove('collapsed');
      this.$registerForm.classList.add('collapsed');
    });

    this.$registerBtn.addEventListener('click', () => {
      this.$registerForm.classList.remove('collapsed');
      this.$loginForm.classList.add('collapsed');
    });

    this.$registerForm.addEventListener('submit', event => {
      this.signUp(event);
    });

    this.$loginForm.addEventListener('submit', event => {
      this.signIn(event);
    });
  }
}

export default Auth;
