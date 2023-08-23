export class Node {
    title: string;
    opcoes: { [id: string]: Node };

    constructor(title: string, opcoes: { [id: string]: Node }) {
        this.title = title;
        this.opcoes = opcoes;
    }
}