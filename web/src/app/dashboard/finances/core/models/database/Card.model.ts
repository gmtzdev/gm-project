export class Card {
    id: number;
    name: string;
    owner: number;
    reference: string;
    type: number;
    sequence: number;

    constructor(id: number, name: string, owner: number, reference: string, type: number, sequence: number) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.reference = reference;
        this.type = type;
        this.sequence = sequence;
    }
}