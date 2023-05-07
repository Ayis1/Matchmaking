import { Participant } from "./participants"

export interface Match{
    id: number,
    team1: Array<Participant>,
    team2: Array<Participant>
}