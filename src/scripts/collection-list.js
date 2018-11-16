import CollectionItemList from './collection-item-list';
import firebase from 'firebase/app';
import Api from './api';
import {Modal} from 'windowise';
import {Input} from 'windowise';
import AddItemWindow from './add-item';

class CollectionList {
  constructor () {
    this.$collectionList = document.getElementById('collection-list');
  }

  createCollectionContainer () {
    const $collectionContainer = document.createElement('div');
    $collectionContainer.classList.add('collection-container');
    return $collectionContainer;
  }

  createAddButton () {
    const $createCollectionBtn = document.createElement('button');
    $createCollectionBtn.setAttribute('id', 'create-collection' );
    $createCollectionBtn.setAttribute('title', 'Create collection');
    $createCollectionBtn.classList.add('create-collection' );
    $createCollectionBtn.innerHTML = `
                  <i class="fas fa-plus"></i>
                  <span>Add collection</span>`;
    return $createCollectionBtn;
  }

  createAddItemButton (id) {
    const $createCollectionItemBtn = document.createElement('button');
    $createCollectionItemBtn.setAttribute('id', `create-collection-item-${id}` );
    $createCollectionItemBtn.setAttribute('title', 'Add item');
    $createCollectionItemBtn.classList.add('collection__head_add' );
    $createCollectionItemBtn.innerHTML = '<i class="fas fa-plus"></i>';
    return $createCollectionItemBtn;
  }

  createRemoveCollectionButton (name) {
    const $createRemoveCollectionBtn = document.createElement('button');
    $createRemoveCollectionBtn.setAttribute('id', `remove-collection-${name}` );
    $createRemoveCollectionBtn.setAttribute('title', 'Remove collection');
    $createRemoveCollectionBtn.classList.add('collection__head_remove' );
    $createRemoveCollectionBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    return $createRemoveCollectionBtn;
  }

  createCollectionHeader (name, id) {
    const $collectionHeader = document.createElement('div');
    const $createCollectionItemBtn = this.createAddItemButton(id);
    const $createRemoveCollectionButton = this.createRemoveCollectionButton(name);
    const api = new Api();

    api.getCollectionRefName(id, name, collectionName => {
      $collectionHeader.classList.add('collection', `collection--${name}`);

      $collectionHeader.innerHTML = `
         <div class="collection__head">
           <h4 class="collection__head_title">${collectionName}</h4>
         </div>`;
      $collectionHeader.getElementsByClassName('collection__head')[0].appendChild($createCollectionItemBtn);
      $collectionHeader.getElementsByClassName('collection__head')[0].appendChild($createRemoveCollectionButton);

      $createCollectionItemBtn.addEventListener('click', event => {
        event.preventDefault();
        this.addItemToCollection(id, name, collectionName);
      });

      $createRemoveCollectionButton.addEventListener('click', event => {
        event.preventDefault();
        this.removeCollection(id, name);
      });
    });

    return $collectionHeader;
  }

  addItemToCollection (id, name, collectionName) {
    const modal = new AddItemWindow(id, name, collectionName);

    modal.open();
  }

  createCollectionItemList (collection) {
    const $collection = new CollectionItemList(collection);

    return $collection.render();
  }

  createCollection (id) {
    const collectionObj =  {
      collectionName: null,
      collectionId: null,
      itemName: '',
      description: '',
      model: '',
      color: '',
      weight: null,
      width: null,
      height: null
    };

    const cancelModal = () => {
      const modal = new Modal({
        type: 'error',
        title: 'Canceled',
        closeAfter: 1500,
        buttons: []
      });

      return modal.open();
    };

    const numberValidator = value => {
      return new Promise(function (resolve, reject) {
        if (!value || isNaN(value)) {
          reject('Not a number.');
        } else {
          resolve();
        }
      });
    };

    const createCollectionId = value => {
      return value.replace(/\s/g,'').toLowerCase();
    };

    const alphaNumericValidator = value => {
      return new Promise(function (resolve, reject) {
        if (!(value.length > 3 && /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(value))) {
          reject('Please input alphanumeric characters.Min length 3');
        } else {
          resolve();
        }
      });
    };

    const newCollectionModal = new Input({
      title: 'Please input a name of collection',
      text: 'This field is required',
      keepOverlay: true,
      placeholder: 'Letters and numbers only',
      validator: alphaNumericValidator,
      showCancel: true
    });

    newCollectionModal.open();

    newCollectionModal.getPromise().then(
      function (value) {
        Object.assign(collectionObj, {
          collectionName: value,
          collectionId: createCollectionId(value)
        });

        const newCollectionNameModal = new Input({
          title: 'Please input a name of item',
          text: 'This field is required',
          keepOverlay: true,
          placeholder: 'Letters and numbers only',
          validator: alphaNumericValidator,
          showCancel: true
        });

        newCollectionNameModal.open();

        newCollectionNameModal.getPromise().then(
          function (value) {

            Object.assign(collectionObj, {itemName: value});

            const newCollectionDescriptionModal = new Input({
              title: 'Please input a short description',
              text: 'You can skip this',
              keepOverlay: true,
              showCancel: true
            });

            newCollectionDescriptionModal.open();

            newCollectionDescriptionModal.getPromise().then(
              function (value) {

                Object.assign(collectionObj, {description: value});

                const newCollectionModelModal = new Input({
                  title: 'Please input a model',
                  text: 'You can skip this',
                  keepOverlay: true,
                  showCancel: true
                });

                newCollectionModelModal.open();

                newCollectionModelModal.getPromise().then(
                  function (value) {

                    Object.assign(collectionObj, {model: value});


                    const newCollectionColorModal = new Input({
                      title: 'Please input a color of item',
                      text: 'You can skip this',
                      keepOverlay: true,
                      showCancel: true
                    });

                    newCollectionColorModal.open();

                    newCollectionColorModal.getPromise().then(
                      function (value) {

                        Object.assign(collectionObj, {color: value});

                        const newCollectionWeightModal = new Input({
                          title: 'Please input a weight',
                          text: 'You can skip this',
                          keepOverlay: true,
                          placeholder: 'Numbers only',
                          validator: numberValidator,
                          showCancel: true
                        });

                        newCollectionWeightModal.open();

                        newCollectionWeightModal.getPromise().then(
                          function (value) {

                            Object.assign(collectionObj, {weight: value});

                            const newCollectionWidthModal = new Input({
                              title: 'Please input a width',
                              text: 'You can skip this',
                              keepOverlay: true,
                              placeholder: 'Numbers only',
                              validator: numberValidator,
                              showCancel: true
                            });

                            newCollectionWidthModal.open();

                            newCollectionWidthModal.getPromise().then(
                              function (value) {
                                Object.assign(collectionObj, {width: value});

                                const newCollectionHeightModal = new Input({
                                  title: 'Please input a height',
                                  text: 'You can skip this',
                                  placeholder: 'Numbers only',
                                  validator: numberValidator,
                                  showCancel: true
                                });

                                newCollectionHeightModal.open();

                                newCollectionHeightModal.getPromise().then(
                                  function (value) {
                                    Object.assign(collectionObj, {height: value});

                                    firebase.database().ref('users/' + id + '/collections/' +
                                      collectionObj.collectionId + '/' + collectionObj.itemName)
                                      .set({
                                        collectionId: collectionObj.collectionId,
                                        name: collectionObj.itemName,
                                        description: collectionObj.description,
                                        model: collectionObj.model,
                                        color: collectionObj.color,
                                        weight:collectionObj.weight,
                                        width: collectionObj.width,
                                        height:collectionObj.height
                                      });

                                    const updates = {};
                                    updates[collectionObj.collectionId] = collectionObj.collectionName;

                                    firebase.database()
                                      .ref('users/' + id + '/collection-ref/')
                                      .update(updates);

                                    const successModal = new Modal({
                                      title: 'Success',
                                      text: 'You created a new collection!',
                                    });

                                    successModal.open();
                                  }
                                );
                              },
                              cancelModal
                            );
                          },
                          cancelModal
                        );
                      },
                      cancelModal
                    );
                  },
                  cancelModal
                );
              },
              cancelModal
            );
          },
          cancelModal
        );
      },
      cancelModal
    );
  }

  render (collections, id) {
    if (collections) {
      this.$collectionList.innerHTML = '';

      const $createCollectionBtn = this.createAddButton();

      this.$collectionList.appendChild($createCollectionBtn);
      $createCollectionBtn.addEventListener('click', () => {
        this.createCollection(id);
      });

      $createCollectionBtn.addEventListener('click', () => {
        this.createCollection(id);
      });

      Object.keys(collections).map( collectionName => {
        const $collectionContainer = this.createCollectionContainer();
        const $collectionHeader = this.createCollectionHeader(collectionName, id);
        const $collectionItemList = this.createCollectionItemList(collections[collectionName]);

        $collectionContainer.appendChild($collectionHeader);
        $collectionContainer.appendChild($collectionItemList);
        this.$collectionList.appendChild($collectionContainer);
      });
    } else {
      const message = 'There are no collections yet';

      this.$collectionList.innerHTML = `
        <div class="empty-collection">
          <h3>${message}</h3>
          <button id="create-collection">
            <i class="fas fa-plus"></i>
            <span>Create collection</span>
          </button>
        </div>`;

      this.$createCollectionBtn = document.getElementById('create-collection');
      this.$createCollectionBtn.addEventListener('click', () => {
        this.createCollection(id);
      });

    }
    return this.$collectionList;
  }
}

export default CollectionList;
