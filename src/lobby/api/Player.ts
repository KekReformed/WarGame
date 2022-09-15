
// This class is currently unused as anything except a type, not sure if that should change or not, possibly in the future 
export default class Player {
    name: string
    faction: {
        name: string,
        colour: string
    }
    ready?: boolean
    index: number
}