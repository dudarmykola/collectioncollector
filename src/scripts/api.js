import firebase from 'firebase/app';
import 'firebase/database';

class Api {
  constructor () {

  }

  getUserId () {
    return firebase.auth().currentUser.uid;
  }

  fetchCollections (id, callback) {
    firebase.database().ref('/users/' + id + '/collections/').once('value', snapshot => {
      callback(snapshot.val());
    });
  }

  getCollectionRefName (id, name, callback) {
    const ref = firebase.database().ref('users/' + id + '/collection-ref/' + name);
    ref.once('value', snapshot => {
      callback(snapshot.val());
    });
  }
}

export default Api;
