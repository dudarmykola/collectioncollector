class ErrorMessage {
  constructor (container) {
    this.container = container;
  }

  show (text) {
    this.container.classList.add('error--visible');
    this.container.innerText =  text;
  }

  hide () {
    this.container.classList.remove('error--visible');
  }

  clearMessages () {
    document.querySelectorAll('.error--visible').forEach( item => {
      item.classList.remove('error--visible');
    });
  }
}

export default ErrorMessage;
