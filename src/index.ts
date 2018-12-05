import * as fs from 'fs-extra';

export class JsonStore {

	private _data: object;
	public _ready: Promise<any>;

	async set(key: string, value: any){
		return this._ready.then(() => {
			this._data[key] = value;
			return this.write();
		})
	}

	async get(key: string) {
		return this._ready.then(() => {
			return Promise.resolve(this._data[key]);
		})
	}

	async remove(key: string) {
		return this._ready.then(() => {
			delete this._data[key];
			return this.write();
		})
	}

	constructor(private fileName: string) {
		this._ready = this.setup().then(() => this);
	}

	private async setup() {
		await fs.ensureFile(this.fileName);
		return this.read();
	}

	public async read() {
		this._data = await fs.readJson(this.fileName);
	}

	public async write() {
		return fs.writeJSON(this.fileName, this._data);
	}

	public async catch(fn: any){
		return this._ready.catch(fn);
	}

	public async then(fn: (s: JsonStore) => void){
		return this._ready.then(() => fn(this));
	}

	public static create(fileName: string): JsonStore {
		return new JsonStore(fileName);
	}

}