import firebase from 'firebase/app';
import 'firebase/database';

class Api {
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

  addItemToCollection (id, obj, callback) {
    firebase.database().ref('users/' + id + '/collections/' + obj.collectionId + '/' + obj.name)
      .set({
        collectionId: obj.collectionId,
        name: obj.name,
        description: obj.description,
        model: obj.model,
        color: obj.color,
        weight:obj.weight,
        width: obj.width,
        height:obj.height
      }, error => error ? alert(error) : callback());
  }

  addCollection (id, obj, callback) {
    return new Promise(() => {
      firebase.database().ref('users/' + id + '/collections/' +
        obj.collectionId + '/' + obj.itemName)
        .set({
          collectionId: obj.collectionId,
          name: obj.itemName,
          description: obj.description,
          model: obj.model,
          color: obj.color,
          weight:obj.weight,
          width: obj.width,
          height:obj.height
        });

      const updates = {};
      updates[obj.collectionId] = obj.collectionName;

      firebase.database()
        .ref('users/' + id + '/collection-ref/')
        .update(updates);
    }).then(
      callback()
    );
  }

  removeCollection (id, collectionName, callback) {
    return new Promise(() => {
      firebase.database().ref('users/' + id + '/collection-ref/' + collectionName).remove();

      firebase.database().ref('users/' + id + '/collections/' + collectionName).remove();
    }).then(
      callback()
    );
  }

  removeCollectionItem (id, obj, callback) {
    return new Promise(() => {
      firebase.database().ref('users/' + id + '/collections/' + obj.collectionName + '/' + obj.name).remove();
    }).then(
      callback()
    );
  }

  checkIfItemExists (id, obj, callback) {
    firebase.database()
      .ref(('users/' + id + '/collections/' + obj.collectionId + '/' + obj.name))
      .once('value', snapshot => {
        const exists = (snapshot.val() !== null);

        callback(exists);
      });
  }
}

export default Api;
