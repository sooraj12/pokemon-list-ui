const setItem = (key: string, item: any) => {
  localStorage.setItem(key, item);
};

const getItem = (key: string) => {
  return localStorage.getItem(key);
};

function storage(key: string) {
  return {
    setItem: (item: any) => setItem(key, item),
    getItem: () => getItem(key),
  };
}

export { storage };
