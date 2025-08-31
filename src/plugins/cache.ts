const sessionCache = {
  set(key: string, value: any) {
    if (!sessionStorage) {
      return;
    }
    if (key != null && value != null) {
      sessionStorage.setItem(key, value);
    }
  },
  get(key: string) {
    if (!sessionStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return sessionStorage.getItem(key);
  },
  setJSON(key: string, jsonValue: any) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue));
    }
  },
  getJSON(key: string) {
    const value = this.get(key);
    if (value != null) {
      return JSON.parse(value);
    }
  },
  remove(key: string) {
    if (!sessionStorage) {
      return;
    }
    if (key != null) {
      sessionStorage.removeItem(key);
    }
  },
};

const localCache = {
  set(key: string, value: any) {
    if (!localStorage) {
      return;
    }
    if (key != null && value != null) {
      localStorage.setItem(key, value);
    }
  },
  get(key: string) {
    if (!localStorage) {
      return null;
    }
    if (key == null) {
      return null;
    }
    return localStorage.getItem(key);
  },
  setJSON(key: string, jsonValue: any) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue));
    }
  },
  getJSON(key: string) {
    const value = this.get(key);
    if (value != null) {
      return JSON.parse(value);
    }
  },
  remove(key: string) {
    if (!localStorage) {
      return;
    }
    if (key != null) {
      localStorage.removeItem(key);
    }
  },
};

export default {
  session: sessionCache,
  local: localCache,
};
