import RemoveItemWindow from './remove-item';

class CollectionItemList {
  constructor (id, collectionName, items) {
    this.id = id;
    this.collectionName = collectionName;
    this.items = items;

    this.$collectionContainer = this.createList();
  }

  createImgContainer () {
    const $imageContainer = document.createElement('div');
    $imageContainer.classList.add('collection__img');
    return $imageContainer;
  }

  createList () {
    const $collectionBody = document.createElement('div');
    $collectionBody.classList.add('collection__body');
    return $collectionBody;
  }

  createEditItemButton () {
    const $createEditItemButton = document.createElement('button');

    $createEditItemButton.setAttribute('title', 'Edit item');
    $createEditItemButton.classList.add('controls__edit' );
    $createEditItemButton.innerHTML = '<i class="fas fa-edit"></i>';

    return $createEditItemButton;
  }

  createRemoveItemButton () {
    const $createRemoveItemButton = document.createElement('button');

    $createRemoveItemButton.setAttribute('title', 'Remove item');
    $createRemoveItemButton.classList.add('controls__remove' );
    $createRemoveItemButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

    return $createRemoveItemButton;
  }

  removeItemFromCollection (id, collectionName, itemName) {
    const modal = new RemoveItemWindow(id, collectionName);

    modal.removeCollectionItem(itemName);
  }

  render () {
    if (this.items) {

      Object.keys(this.items).map(item => {
        const $itemContainer = document.createElement('div');

        $itemContainer.classList.add('item-container');

        Object.keys(this.items[item]).map(el => {
          switch (el) {
            case 'name': {
              const $item = document.createElement('div');
              const $controls = document.createElement('div');
              const $buttonEdit = this.createEditItemButton();
              const $buttonRemove = this.createRemoveItemButton();

              $item.classList.add('field');
              $item.classList.add('field--name');
              $controls.classList.add('controls');
              $item.innerHTML = `
              <span class="title">Item: </span>
              <span class="option">${this.items[item][el]}</span>
            `;
              $itemContainer.appendChild($item);
              $item.appendChild($controls);
              $controls.appendChild($buttonEdit);
              $controls.appendChild($buttonRemove);

              $buttonRemove.addEventListener('click' ,event => {
                event.preventDefault();
                this.removeItemFromCollection(this.id, this.collectionName, this.items[item][el]);
              });

              break;
            }
            case 'description': {
              const $item = document.createElement('div');
              $item.classList.add('field');
              $item.classList.add('field--description');
              $item.innerHTML = `
              <span class="title">${el}:</span>
              <span class="option">${this.items[item][el]}</span>
            `;
              $itemContainer.appendChild($item);

              break;
            }

            case 'color': {
              const $item = document.createElement('div');
              $item.classList.add('field');
              $item.classList.add('field--color');
              $item.innerHTML = `
              <span class="title">${el}:</span>
              <span class="option">${this.items[item][el]}</span>
            `;
              $itemContainer.appendChild($item);

              break;
            }

            case 'author': {
              const $item = document.createElement('div');
              $item.classList.add('field');
              $item.classList.add('field--author');
              $item.innerHTML = `
              <span class="title">${el}:</span>
              <span class="option">${this.items[item][el]}</span>
            `;
              $itemContainer.appendChild($item);

              break;
            }

            case 'model': {
              const $item = document.createElement('div');
              $item.classList.add('field');
              $item.classList.add('field--model');
              $item.innerHTML = `
              <span class="title">${el}:</span>
              <span class="option">${this.items[item][el]}</span>
            `;
              $itemContainer.appendChild($item);

              break;
            }

            case 'weight': {
              const $item = document.createElement('div');
              $item.classList.add('field');
              $item.classList.add('field--weight');
              $item.innerHTML = `
              <span class="title">${el}:</span>
              <span class="option">${this.items[item][el]}</span>
            `;
              $itemContainer.appendChild($item);

              break;
            }

            case 'width': {
              const $item = document.createElement('div');
              $item.classList.add('field');
              $item.classList.add('field--width');
              $item.innerHTML = `
              <span class="title">${el}:</span>
              <span class="option">${this.items[item][el]}</span>
            `;
              $itemContainer.appendChild($item);

              break;
            }

            case 'height': {
              const $item = document.createElement('div');
              $item.classList.add('field');
              $item.classList.add('field--height');
              $item.innerHTML = `
              <span class="title">${el}:</span>
              <span class="option">${this.items[item][el]}</span>
            `;
              $itemContainer.appendChild($item);

              break;
            }

            default:

              break;
          }

        });
        this.$collectionContainer.appendChild($itemContainer);
      });

    } else {
      const message = 'Collection is empty';
      this.$collectionContainer.innerHTML = `<h4 class="empty-item">${message}</h4>`;
    }
    return this.$collectionContainer;
  }
}

export default CollectionItemList;
