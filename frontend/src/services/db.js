import './mockData';

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const getDB = () => {
    const data = localStorage.getItem('stellar_data');
    return data ? JSON.parse(data) : null;
};

export const saveDB = (data) => {
    localStorage.setItem('stellar_data', JSON.stringify(data));
};
