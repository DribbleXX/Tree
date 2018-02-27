module.exports = new class string {
  similarity(left = "", right = "") {
  		const lower_left = left.toLowerCase(),
  		lower_right = right.toLowerCase(),
  		ls = [];
  		if(lower_left === lower_right) {
  			return 1;
  		}else if(lower_left.length < 2 || lower_right.length < 2) {
  			return 0;
  		}
  		let count = 0;
  		for(let i = 0; i < lower_left.length - 1; i++) {
  			ls.push(lower_left.slice(i, i + 2));
  		}
  		for(let i = 0; i < lower_right.length - 1; i++) {
  			const b = lower_right.slice(i, i + 2),
  			n = ls.indexOf(b);
  			if(n !== -1) {
  				count += 1;
  				ls.splice(n, 1);
  			}
  		}
  		return 2 * count / (lower_left.length + lower_right.length - 2);
  }
  capitalize(string, all) {
    if (!all) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }else{
      return string.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1));
    }
  }
  startsWithVowel(string) {
    return ["a", "e", "i", "o", "u", "y"].indexOf(string[0].toLowerCase()) < 0 ? false : true;
  }
}();
