import {Window} from 'windowise';
import Api from './api';
import CollectionList from './collection-list';
import ErrorMessage from './error-message';

class AddItemWindow {
  constructor (id, name, collectionName) {
    this.id = id;
    this.name = name;
    this.collectionName = collectionName;
    this.api = new Api();
    this.render();
    this.numberValidator = value => {
      return !isNaN(value);
    };
  }

  open () {
    const modal = Window.create(
      document.getElementById('add-item-menu'),
      {
        topbar: false,
        position: 'right',
        animation: 'right',
        overlay: true,
        noRadius: true
      }
    );

    modal.open();
    const errorMessages = new ErrorMessage();
    errorMessages.clearMessages();

    const $addItemMenuClose = document.getElementById('add-item-menu-close');
    const $name = document.getElementById('item-name');
    const $description = document.getElementById('description');
    const $model = document.getElementById('model');
    const $color = document.getElementById('color');
    const $weight = document.getElementById('weight');
    const $width = document.getElementById('width');
    const $height = document.getElementById('height');
    const $addItemForm = document.getElementById('add-item-form');

    $name.focus();

    $addItemForm.addEventListener('submit', event => {
      event.preventDefault();

      errorMessages.clearMessages();

      const sendObj = Object.assign({}, {
        collectionId: this.collectionName,
        name: $name.value,
        description: $description.value,
        model: $model.value,
        color: $color.value,
        weight:$weight.value,
        width: $width.value,
        height:$height.value
      });

      if (!this.numberValidator(sendObj.weight)) {
        const errorMessage = new ErrorMessage($weight.nextElementSibling);
        errorMessage.show('Not a number');
        return;
      }

      if (!this.numberValidator(sendObj.width)) {
        const errorMessage = new ErrorMessage($width.nextElementSibling);
        errorMessage.show('Not a number');
        return;
      }

      if (!this.numberValidator(sendObj.height)) {
        const errorMessage = new ErrorMessage($height.nextElementSibling);
        errorMessage.show('Not a number');
        return;
      }

      if (sendObj.name.length > 2) {
        this.api.checkIfItemExists(this.id, sendObj, exists => {
          if (exists) {
            const errorMessage = new ErrorMessage($name.nextElementSibling);
            errorMessage.show('This item already exists');
          } else {
            this.addItem(modal, sendObj);
          }
        });
      } else {
        const errorMessage = new ErrorMessage($name.nextElementSibling);
        errorMessage.show('This field is required');
      }
    });

    $addItemMenuClose.addEventListener('click', event => {
      event.preventDefault();
      modal.close();
    });
  }

  addItem (modal, obj) {
    modal.close();

    modal.getPromise().then(() => {
      this.api.addItemToCollection(this.id, obj, () => {
        this.api.fetchCollections(this.id, collections => {
          const collectionList = new CollectionList();
          collectionList.render(collections, this.id);
        });
      });
    });
  }

  render () {
    const $menu = document.createElement('div');
    $menu.innerHTML = `
    <div id="add-item-menu">
      <div class="content">
        <div class="menu">
          <div class="title">Add item to collection <span class="title--bold">${this.collectionName}</span></div>
          <div class="close" id="add-item-menu-close" title="Cancel">
            <i class="fas fa-times"></i>
          </div>
          <form class="add-item-form" id="add-item-form">
            <div class="input">
              <label for="item-name">*Item name</label>
              <input type="text" placeholder="Letters or numbers only" id="item-name" />
              <p class="message message--error"></p>
            </div>
            <div class="input">
              <label for="description">Short description</label>
              <input type="text" placeholder="Letters or numbers only" id="description" />
              <p class="message message--error"></p>
            </div>
            <div class="input">
              <label for="model">Model</label>
              <input type="text" placeholder="Letters or numbers only" id="model" />
              <p class="message message--error"></p>
            </div>
            <div class="input">
              <label for="color">Color</label>
              <input type="text" placeholder="Letters or numbers only" id="color"/>
              <p class="message message--error"></p>
            </div>
            <div class="input">
              <label for="weight">Weight</label>
              <input type="text" placeholder="Numbers only" id="weight" />
              <p class="message message--error"></p>
            </div>
            <div class="input">
              <label for="width">Width</label>
              <input type="text" placeholder="Numbers only" id="width" />
              <p class="message message--error"></p>
            </div>
            <div class="input">
              <label for="number">Height</label>
              <input type="text" placeholder="Numbers only" id="height" />
              <p class="message message--error"></p>
            </div>
            <button id="add-item" type="submit">
              <i class="fas fa-plus"></i>
              <span>Add item</span>
            </button>
          </form>
        </div>
      </div>
    </div>`;
    const sidebar = document.getElementById('side-bar');
    sidebar.appendChild($menu);
  }
}

export default AddItemWindow;
