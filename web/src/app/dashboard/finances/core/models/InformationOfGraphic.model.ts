export class InformationOfGraphic {
  name: string;
  value: number;
  extra?: object | undefined;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}
