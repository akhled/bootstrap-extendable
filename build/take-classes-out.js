const fs = require('fs');
const readline = require('readline');

class TakeClassesOut {
	constructor() {
		this.classes = [];
		this.text = '';
		this.dist = 'dist';
	}

	async init() {
		this.readInterface = readline.createInterface({
			input: fs.createReadStream(`${this.dist}/bootstrap-extendable.css`),
		});

		this.readInterface.on('line', (line) => {
			var value = this.readLine(line);
			if (value) this.classes.push(value);
		});

		return new Promise((resolve) => {
			this.readInterface.on('close', () => {
				this.prepareOutputText();
				resolve(this.text);
			});
		});
	}

	readLine(line) {
		line = line.trim();
		if (line.indexOf('.') == 0) return line.split(' ')[0];
		return false;
	}

	prepareOutputText() {
		this.text =
			'/*---\n\n' +
			'section: Available classes\n\n' +
			'---\n\n' +
			'## List of available classes.\n\n';
		let prevTitle = '';

		for (const line of this.classes) {
			let title = line.split('-')[0].replace('.', '');
			if (title != prevTitle) {
				this.text += `- ### ${title}\n`
				prevTitle = title
			}
			this.text += `\t- \`${line}\`\n`;
		}

		this.text += '\n\n*/\n';
	}

	exportJS() {
		let jscode = `module.exports = { data: '${this.text}' }`;
		fs.writeFileSync(`${this.dist}/build/classes-list.js`, jscode, 'utf8');
	}

	exportTxt() {
		fs.writeFileSync(`${this.dist}/build/classes-list.txt`, this.text, 'utf8');
	}

	copyToJson() {
		fs.writeFileSync('test.json', JSON.stringify(this.classes), 'utf8');
	}

	copyToMd() {
		fs.writeFileSync(this.dist + '/build/classes-list.md', this.text, 'utf8');
	}

	appendClassesToDocCSS() {
		fs.appendFileSync('dist/build/doc.css', this.text);
	}
}

const toc = new TakeClassesOut();
toc.init().then((data) => {
	toc.exportTxt();
});
