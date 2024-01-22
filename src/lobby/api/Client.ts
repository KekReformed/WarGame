import Player from "./Player";

export default class Client extends Player {
  money: number

  constructor(data: Partial<Client>) {
    super(data)
    this.money = data.money || 0
  }
}