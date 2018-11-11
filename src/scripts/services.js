export const addListenerMulti = (element, eventNames, listener) => {
  const events = eventNames.split(' ');
  for (let i = 0; i < events.length; i++) {
    element.addEventListener(events[i], listener, false);
  }
};

export const showErrorLabel = (element, messageContainer, text) => {
  element.classList.remove('input--success');
  element.classList.add('input--error');
  messageContainer.innerText = text;
};

export const showSuccessLabel = (element, messageContainer, text) => {
  element.classList.remove('input--error');
  element.classList.add('input--success');
  messageContainer.innerText = text;
};

export const showContent = element => {
  element.classList.remove('hidden');
};

export const hideContent = element => {
  element.classList.add('hidden');
};

export const fadeIn = (element, duration) => {
  (function increment (value = 0) {
    element.style.opacity = String(value);
    if (element.style.opacity !== '1') {
      setTimeout(() => {
        increment(value + 0.1);
      }, duration / 10);
    }
  })();
};

export const fadeOut = (element, duration) => {
  (function decrement () {
    (element.style.opacity -= 0.1) < 0 ? element.style.display = 'none' : setTimeout(() => {
      decrement();
    }, duration / 10);
  })();
};
