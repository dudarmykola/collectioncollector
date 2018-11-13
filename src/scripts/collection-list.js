import CollectionItemList from './collection-item-list';

class CollectionList {
  constructor (collections) {
    this.collections = collections;

    this.$collectionList = document.getElementById('collection-list');
    this.render();
  }

  createCollectionContainer () {
    const $collectionContainer = document.createElement('div');
    $collectionContainer.classList.add('collection-container');
    return $collectionContainer;
  }

  createCollectionHeader (name) {
    const $collectionHeader = document.createElement('div');
    $collectionHeader.classList.add('collection', `collection--${name}`);
    $collectionHeader.innerHTML = `
         <div class="collection__head">
           <h4 class="collection__head_title">${name}</h4>
           <button class="collection__head_remove">
             <i class="fas fa-trash-alt"></i>
            </button>
         </div>`;

    return $collectionHeader;

  }

  createCollectionItemList (collection) {

    const $collection = new CollectionItemList(collection);

    return $collection.render();
  }

  render () {
    if (this.collections) {
      Object.keys(this.collections).map( collectionName => {
        const $collectionContainer = this.createCollectionContainer();
        const $collectionHeader = this.createCollectionHeader(collectionName);
        const $collectionItemList = this.createCollectionItemList(this.collections[collectionName]);

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
        </div>
          `;
    }
  }
}

export default CollectionList;
