import { List } from '../database/List.model';

export class SelectableList extends List {
  public selected: boolean = false;
  constructor(list: List) {
    super(list);
  }
}
