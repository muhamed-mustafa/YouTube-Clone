import fetch from 'node-fetch';

export const getIp = () => {
  return fetch('https://api.ipify.org/?format=json')
    .then((results) => results.json())
    .then((data) => {
      return data.ip;
    });
};
