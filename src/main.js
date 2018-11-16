import './style/main.scss';
import 'windowise/src/sass/style.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import Auth from './scripts/auth';
import Api from './scripts/api';
import config from './scripts/firebase-config';
import * as Services from './scripts/services';
import CollectionList from './scripts/collection-list';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faPlus,
  faSignOutAlt,
  faSignInAlt,
  faTrashAlt,
  faTimes,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons/index';


library.add(faEdit, faPlus, faSignOutAlt, faSignInAlt, faTrashAlt, faTimes, faUserPlus );
dom.watch();

const $signOutBtn = document.getElementById('sign-out');
const $detailsUser = document.getElementById('details-user');
const $loginWrapper = document.getElementById('login-wrapper');
const $collectionWrapper = document.getElementById('collection-wrapper');
const $details = document.getElementById('details');

const auth = new Auth();
const api = new Api();

const verifyUser = () => {
  firebase
    .auth()
    .onAuthStateChanged( user => {
      if (user) {
        Services.showContent($details);
        Services.showContent($collectionWrapper);
        Services.hideContent($loginWrapper);

        $detailsUser.innerText = user.displayName;

        const loginRef = firebase.database().ref('users');
        const userLoginRef = loginRef.child(user.uid);
        const userLoginInfoCollectionRef = userLoginRef.child('info');

        userLoginInfoCollectionRef.set({
          email: user.email,
          emailVerified: user.emailVerified
        });

        api.fetchCollections(user.uid, collections => {
          const collectionList = new CollectionList();
          collectionList.render(collections, user.uid);
        });

        $signOutBtn.addEventListener('click', event => {
          event.preventDefault();
          auth.signOut();
        });
      } else {
        auth.render();
      }
    });
};

const init = () => {
  firebase.initializeApp(config);
  verifyUser();

};

init();
