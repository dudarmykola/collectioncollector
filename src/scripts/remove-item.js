import Api from './api';
import {Modal} from 'windowise';
import CollectionList from './collection-list';

class RemoveItemWindow {
  constructor (id, collectionName) {
    this.id = id;
    this.collectionName = collectionName;
    this.api = new Api();
  }

  removeCollection () {
    const modalWindow = new Modal({
      type: 'caution',
      title: 'Are you sure you want to delete?',
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
        this.api.removeCollection(this.id, this.collectionName, () => {
          this.api.fetchCollections(this.id, collections => {
            const collectionList = new CollectionList();
            collectionList.render(collections, this.id);
          });
        });
      } else {
        modalWindow.close();
      }
    });
  }

  removeCollectionItem (itemName) {
    const modalWindow = new Modal({
      type: 'caution',
      title: 'Are you sure you want to delete?',
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
        const removeObj = Object.assign({}, {
          collectionName: this.collectionName,
          name: itemName
        });

        this.api.removeCollectionItem(this.id, removeObj, () => {
          this.api.fetchCollections(this.id, collections => {
            const collectionList = new CollectionList();
            collectionList.render(collections, this.id);
          });
        });
      } else {
        modalWindow.close();
      }
    });
  }
}

export default RemoveItemWindow;
