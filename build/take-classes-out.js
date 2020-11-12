const fs = require('fs');
const readline = require('readline');
const postcss = require('postcss');

class TakeClassesOut {
	constructor() {
		console.log('loaded')
		this.classes = [];

		const readInterface = readline.createInterface({
			input: fs.createReadStream('dist/bootstrap-extendable.css'),
		});

		readInterface.on('line', (line) => {
			var value = this.readLine(line);
			if (value) this.classes.push(value);
		});

		readInterface.on('close', () => this.appendClassesToDocCSS());
	}

	readLine(line) {
		line = line.trim();
		if (line.indexOf('.') == 0) return line.split(' ')[0];
		return false;
	}

	copyToJson() {
		fs.writeFileSync('test.json', JSON.stringify(this.classes), 'utf8');
	}

	appendClassesToDocCSS() {
        let data = '\n/*---\n```json' + JSON.stringify(this.classes) + '```\n*/\n';
		fs.appendFileSync('dist/build/doc.css', data);
	}
}

module.exports = postcss.plugin('take-classes-out', (opts) => {
	opts = opts || {};

	const tco = new TakeClassesOut();

	console.log('there')

	return (css, result) => {}
});