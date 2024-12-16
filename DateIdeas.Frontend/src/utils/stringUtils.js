export const convertEmptyStringsToNull = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === '') {
        obj[key] = null;
      }
    });
  };
  