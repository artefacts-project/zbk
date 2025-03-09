import { v4 } from "uuid";
import { markRaw, Reactive, reactive, ref, Ref, ShallowRef, shallowRef } from "vue";
import { ZettelService } from "./zettel";

export class ListService {
  private list: Ref<ZettelService[]>;
  private readonly uid: string;
  private persisted: Ref<boolean>;
  private persistedState?: any;

  constructor(list?: ZettelService[] | ListService, isPersisted = false) {
    if (list instanceof ListService) {
      this.list = shallowRef(list.asArray);
      this.persisted = ref(list.isPersisted);
      this.persistedState = list.asPersistedList;
      this.uid = list.id;
    } else {
      this.list = shallowRef(list || []);
      this.persisted = ref(isPersisted);
      this.uid = v4();
    }
  }

  get id() {
    return this.uid;
  }

  get asArray() {
    return this.list.value;
  }

  get asRef() {
    return this.list;
  }

  get isPersisted() {
    return this.persisted.value;
  }

  get asPersistedList() {
    return this.persistedState;
  }

  get length() {
    return this.list.value.length;
  }

  get isEmpty() {
    return this.list.value.length === 0;
  }

  zettelAt(index: number) {
    const defaultZettel = new ZettelService();
    defaultZettel.setContent(["Error while retrieving Zettel"]);
    return this.list.value[index] ?? defaultZettel;
  }

  zettel(id: string) {
    const defaultZettel = new ZettelService();
    defaultZettel.setContent(["Error while retrieving Zettel"]);
    return this.list.value.find((z) => z.id === id) ?? defaultZettel;
  }

  addToList(zettel: ZettelService, index?: number) {
    if (!this.persisted.value) {
      // @ts-ignore - Number.isInteger is not used for type checking
      if (Number.isInteger(index) && index >= 0 && index < this.list.value.length) {
        this.list.value = [
          ...this.list.value.slice(0, index),
          zettel,
          ...this.list.value.slice(index)
        ];
      } else {
        this.list.value = [...this.list.value, zettel];
      }
    }
  }

  removeFromListByIndex(index: number) {
    if (!this.persisted.value) {
      this.list.value = this.list.value.filter((_, i) => i !== index);
    }
  }

  removeFromListById(id: string) {
    const index = this.list.value.findIndex((z) => z.id === id);
    if (index !== -1) {
      this.removeFromListByIndex(index);
    }
  }

  persist(persisted: any) {
    this.persisted.value = true;
    this.persistedState = persisted;
  }
}
