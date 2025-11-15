import { CategoryTask } from '../database/CategotyTask.model';

export class SelectableCategoryTask extends CategoryTask {
  public selected: boolean = false;
  constructor(categoryTask: CategoryTask) {
    super(categoryTask);
  }
}
