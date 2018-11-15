import './style/main.scss';
import 'windowise/src/sass/style.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import Auth from './scripts/auth';
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
  faUserPlus
} from '@fortawesome/free-solid-svg-icons/index';


library.add(faEdit, faPlus, faSignOutAlt, faSignInAlt, faTrashAlt, faUserPlus );
dom.watch();

const $signOutBtn = document.getElementById('sign-out');
const $detailsUser = document.getElementById('details-user');
const $loginWrapper = document.getElementById('login-wrapper');
const $collectionWrapper = document.getElementById('collection-wrapper');
const $details = document.getElementById('details');

const auth = new Auth();
const collectionList = new CollectionList();

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
        const userLoginCollectionRef = userLoginRef.child('collections');
        const userLoginInfoCollectionRef = userLoginRef.child('info');

        userLoginInfoCollectionRef.set({
          email: user.email,
          emailVerified: user.emailVerified
        });

        userLoginCollectionRef.on('value', snapshot => {
          const collection = snapshot.val();
          collectionList.render(collection, user.uid);
        });

        $signOutBtn.addEventListener('click', event => {
          auth.signOut(event);
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
