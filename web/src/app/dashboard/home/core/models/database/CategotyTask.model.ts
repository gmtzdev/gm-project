export class CategoryTask {
  public id: number;
  public name: string;
  public icon: string;
  public deleted_at: Date;
  public count: number;

  constructor(categoryTask: CategoryTask) {
    this.id = categoryTask.id;
    this.name = categoryTask.name;
    this.icon = categoryTask.icon;
    this.deleted_at = categoryTask.deleted_at;
    this.count = categoryTask.count;
  }
}
