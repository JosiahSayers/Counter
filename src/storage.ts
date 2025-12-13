export class InstanceStorage {
  private filepath: string;

  constructor() {
    const filepath = Bun.env.FILE;
    if (!filepath) {
      console.error(`No "FILE" environment variable provided.`);
      process.exit(1);
    }

    this.filepath = filepath;
  }

  async count() {
    const data = await this.getData();
    return data.iterations.length;
  }

  async increment() {
    const data = await this.getData();
    data.iterations.push(new Date().toISOString());
    await this.writeData(data);
    return data.iterations.length;
  }

  async decrement() {
    const data = await this.getData();
    const latestIteration = data.iterations.pop();
    if (!latestIteration) {
      return 0;
    }

    data.deletedIterations.push(latestIteration);
    await this.writeData(data);
    return data.iterations.length;
  }

  async setupFile() {
    const fileExists = await this.file.exists();

    if (!fileExists) {
      await Bun.write(this.file, JSON.stringify(this.emptyFile()));
      return;
    }

    try {
      this.file.json();
      return; // File has valid JSON
    } catch (e) {
      const backupFile = `INVALID_FILE_${new Date().toISOString()}`;
      console.error(
        `Unable to read JSON stored in file. Storing current contents in ${backupFile}.`
      );
      console.error(e);

      await Bun.write(backupFile, await this.file.arrayBuffer());
      await Bun.write(this.file, JSON.stringify(this.emptyFile()));
      return;
    }
  }

  private async getData(): Promise<StorageJSON> {
    const data = await this.file.text();
    return JSON.parse(data);
  }

  private async writeData(data: StorageJSON) {
    const sortDates = (a: string, b: string) => {
      const aDate = new Date(a);
      const bDate = new Date(b);
      return aDate.getTime() - bDate.getTime();
    };
    data.iterations.sort(sortDates);
    data.deletedIterations.sort(sortDates);
    await Bun.write(this.file, JSON.stringify(data));
  }

  private emptyFile() {
    return {
      iterations: [],
      deletedIterations: [],
    };
  }

  private get file() {
    return Bun.file(this.filepath);
  }
}

interface StorageJSON {
  iterations: string[];
  deletedIterations: string[];
}
