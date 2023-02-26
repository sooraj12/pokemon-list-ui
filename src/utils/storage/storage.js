const setItem = (key, item) => {
  localStorage.setItem(key, item);
};

const getItem = (key) => {
  return localStorage.getItem(key);
};

function storage(key) {
  return {
    setItem: (item) => setItem(key, item),
    getItem: () => getItem(key),
  };
}

export { storage };
