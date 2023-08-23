export class Solicitante {
  constructor(
    public id: string,
    public nome: string,
    public craai: string,
    public NumMprj: string,
  ) { }
}
export interface IUSolicitanteResponse { results: Solicitante[]; }