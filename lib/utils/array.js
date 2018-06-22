module.exports = {
  arrayDiff(prev, next) {
    const add = [];
    const remove = [];
    prev.forEach((item) => {
      if (!~next.indexOf(item)) {
        remove.push(item);
      }
    });
    next.forEach((item) => {
      if (!~prev.indexOf(item)) {
        add.push(item);
      }
    });
    return {
      eq: add.length === 0 && remove.length === 0,
      add,
      remove,
    };
  },
};
