import PasswordValidator from 'password-validator';

export const regex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  name: /^[\p{L} ,.'-]+$/u,
  proto: /^https?:\/\//,
};

export function getStatus(isValid) {
  const status = isValid ? 'success' : 'error';
  return { isValid, status };
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function genPasswordValidator() {
  const pv = new PasswordValidator();
  pv.is().min(8).is().max(64).has().uppercase().has().lowercase().has().digits().has().symbols();
  return pv;
}
