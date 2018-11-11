function ErrorMessage () {
  this.show = (container, text) => {
    container.classList.add('error--visible');
    container.innerText =  text;
  };

  this.hide = container => {
    container.classList.remove('error--visible');
  };
}

export default ErrorMessage;

