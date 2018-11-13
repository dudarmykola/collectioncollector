class CollectionItemList {
  constructor (items) {
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

  render () {
    if (this.items) {

      Object.keys(this.items).map(item => {
        const $itemContainer = document.createElement('div');

        $itemContainer.classList.add('item-container');

        Object.keys(this.items[item]).map(el => {
          switch (el) {
            case 'name': {
              const $item = document.createElement('div');
              $item.classList.add('field');
              $item.classList.add('field--name');
              $item.innerHTML = `
              <span class="title">Item: </span>
              <span class="option">${this.items[item][el]}</span>
              <div class="controls">
                <button class="controls__edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="controls__remove">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            `;
              $itemContainer.appendChild($item);

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
