"use strict";
module.exports = new class random {
	bool() {
		return this.gen() > 0.5;
	}
	color() {
		return this.gen().toString(16).slice(-6);
	}
	element(array) {
		return Array.isArray(array) && array.length ? array.length === 1 ? array[0] : array[this.int(0, array.length - 1)] : undefined;
	}
	float(min, max) {
		return this.gen() * (max - min) + min;
	}
	gen() {
		return Math.random() ? Math.random() : 1;
	}
	int(min, max) {
		return Math.round(this.float(min - 0.5, max + 0.5));
	}
  shuffle(array) {
    for(let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
	math(operation, min, max) {
    if (!this.mathOutput) this.mathOutput = class {
      constructor(num1, num2, operationSymbol, result) {
        this.expression = [num1, operationSymbol, num2];
        this.result = result;
      }
    }
    let num1 = this.int(min, max);
    let num2 = this.int(min, max);
    if (operation.toLowerCase() === "+" || operation.toLowerCase() === "addition") {
      return new this.mathOutput(num1, num2, "+", num1 + num2);
    }else if (operation.toLowerCase() === "-" || operation.toLowerCase() === "subtraction") {
      return new this.mathOutput(num1, num2, "-", num1 - num2);
    }else if (operation.toLowerCase() === "*" || operation.toLowerCase() === "multiplication") {
      return new this.mathOutput(num1, num2, "*", num1 * num2);
    }else if (operation.toLowerCase() === "/" || operation.toLowerCase() === "division") {
      throw "Division is not done yet!";
    }else{
      throw "Invalid operation symbol in randomMath";
    }
  }
}();
