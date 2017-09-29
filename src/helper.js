export default {
  /**
   *
   * @param Object Array or List
   * @param Callback for list
   */
  forEach(obj, callback) {
    if (typeof obj == 'object') {
      for (let key in obj) {
        callback(obj[key], key);
      }
    }
  },
  filter(obj, callback) {
    if (typeof obj == 'object') {
      let resultObj = this.isArray(obj) ? [] : {};
      for (let key in obj) {
        if (callback(obj[key], key)) {
          if (this.isArray(obj)) {
            resultObj.push(obj[key]);
          }
          else {
            resultObj[key] = obj[key];
          }
        }
      }
      return resultObj;
    }
  },

  map(obj, callback) {
    if (typeof obj == 'object') {
      let resultObj = this.isArray(obj) ? [] : {};
      for (let key in obj) {

        if (this.isArray(obj)) {
          resultObj.push(callback(obj[key], key));
        }
        else {
          resultObj[key] = callback(obj[key], key);
        }

      }
      return resultObj;
    }
  },

  isArray(obj) {
    return Array.isArray(obj);
  }
}
