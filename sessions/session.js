class Session {
    constructor(name) {
        this._name = name;
        this._mouseX = 0;
        this._mouseY = 0;
        this._timer = 10;
    }
    getName() {
        return this._name;
    }
    getMouseX() { 
        return this._mouseX;
    }
    getMouseY() {
        return this._mouseY;
    }
    setMouseX(x) {
        this._mouseX = x;
    }
    setMouseY(y) {
        this._mouseY = y;
    }
    resetTimer() {
      this._timer = 10;
    }
    decrementTimer() {
      this._timer -= 1;
    }
    getTimer() {
      return this._timer;
    }
  };

  module.exports = Session