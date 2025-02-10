import Dexie, { Table } from "dexie";
interface IBook {
  title: string;
  author: string;
  font: string;
  size: string;
  sizeByBytes: string;
  format: string;
  link: string;
  bookId: string;
}
class FavoriteDB extends Dexie {
  favorites!: Table<IBook>;

  constructor() {
    super("FavoriteDB");
    this.version(1).stores({
      favorites: "bookId, title, author, font, size, sizeByBytes, format, link",
    });
  }
}

const database = new FavoriteDB();
export default database;
