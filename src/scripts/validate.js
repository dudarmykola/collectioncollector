import {restriction} from './constants';

export const validateName = name => {
  return (name.length > restriction.minLength.name &&
    name.length < restriction.maxLength.name);
};

export const validatePassword = password => {
  return (password.length > restriction.minLength.name &&
    password.length < restriction.maxLength.name);
};

export const validateEmail = mail => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(mail);
};
