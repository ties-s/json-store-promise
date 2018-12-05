import * as fs from 'fs-extra';

export class JsonStore {

	private _data: object;
	public _setup: Promise<any>;

	async set(key: string, value: any){
		this._data[key] = value;
		return this.write();
	}

	async get(key: string) {
		return Promise.resolve(this._data[key]);
	}

	async remove(key: string) {
		delete this._data[key];
		return this.write();
	}

	constructor(private fileName: string) {
		this._setup = this.setup().then(() => this);
	}

	private async setup() {
		await fs.ensureFile(this.fileName);
		
	}

	private async read() {
		this._data = await fs.readJson(this.fileName);
	}

	private async write() {
		return fs.writeJSON(this.fileName, this._data);
	}

	public static create(fileName: string): Promise<JsonStore> {
		let s = new JsonStore(fileName);
		return s._setup;
	}

}