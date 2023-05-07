import { Component } from "@angular/core";
import { Participant } from "../Model/participants"
import { Match } from "../Model/Match"
import { ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'matchmaking-component',
    templateUrl: './matchmaking.component.html',
    styleUrls: ['matchmaking.component.css'],
})

export class Matchmaking {
    /*Global Variabels */
    @ViewChild('newParticipant') newParticipantRef!: ElementRef<HTMLInputElement>;
    isTest: boolean = false;
    participantsMade: boolean = false;
    participants: Array<Participant> = [];
    newParticipantName: string = '';
    matches: Array<Match> = [];
    availableParticipants: Array<Participant> = [];
    numOfParticipantsPerMatch: number = 4;
    numPerTeam: number = 2;

    /*Create new participant from input field */
    CreateNewParticipant(newParticipantName: string | null) {
        var newParticipant = this.newParticipantRef.nativeElement.value;
        if (this.isTest) {
            newParticipant = "a player"
        }
        if (newParticipant === '' || newParticipant === null) {
            window.alert('Enter a name before attempting to create new player')
        }
        else {
            this.participantsMade = true;
            var participant: Participant = {
                id: this.participants.length + 1,
                name: newParticipantName ? newParticipantName : newParticipant,
                elo: 1500,
                playCount: 0,
                inMatch: false
            };
            this.participants.push(participant);
        }
        this.newParticipantRef.nativeElement.value = '';
    }

    /* Clear participants */
    ClearParticipants() {
        this.participants = [];
        this.participantsMade = false;
        this.isTest = false;
    }

    CreateMatch() {
        var numOfMatches = Math.floor(this.participants.length / this.numOfParticipantsPerMatch);
        /* Clean up last match */
        this.matches = [];
        this.participants.forEach(participant => {
            participant.inMatch = false;
        });

        for (let i = 0; i < numOfMatches; i++) {
            var team1: Array<Participant> = []
            var team2: Array<Participant> = []
            var match: Match = { id: i, team1: team1, team2: team2 }
            for (let j = 0; j < this.participants.length; j++) {
                if (team1.length < this.numOfParticipantsPerMatch / this.numPerTeam) {
                    this.availableParticipants = this.participants.filter(p => p.inMatch === false);
                    var participant = this.availableParticipants[Math.floor(Math.random() * this.availableParticipants.length)];
                    participant.inMatch = true;
                    participant.playCount += 1;
                    match.team1.push(participant);
                } else if (team2.length < this.numOfParticipantsPerMatch / this.numPerTeam) {
                    this.availableParticipants = this.participants.filter(p => p.inMatch === false);
                    var participant = this.availableParticipants[Math.floor(Math.random() * this.availableParticipants.length)];
                    participant.inMatch = true;
                    participant.playCount += 1;
                    match.team2.push(participant);
                }
            }
            this.matches.push(match);
        }
        console.log(this.matches);
        this.participants.sort((a, b) => b.elo - a.elo);
    }

    /* Change Elo based on match result */
    MatchResult(matchid: number, teamOneScore: string, teamTwoScore: string) {
        const team1Score = teamOneScore;
        const team2Score = teamTwoScore;
        const k = 32;
        var result = this.matches[matchid];
        const team1: Participant[] = result.team1;
        const team2: Participant[] = result.team2;

        const elo1 = team1.reduce((sum, participant) => sum + participant.elo, 0) / team1.length;
        const elo2 = team2.reduce((sum, participant) => sum + participant.elo, 0) / team2.length;

        const expectedScore1 = 1 / (1 + Math.pow(10, (elo2 - elo1) / 400));
        const expectedScore2 = 1 / (1 + Math.pow(10, (elo1 - elo2) / 400));

        let rating1, rating2;

        if (team1Score > team2Score) {
            rating1 = team1.map(participant => {
                const expectedScore = expectedScore1;
                const score = participant.inMatch ? team1Score : team2Score;
                const rating = participant.elo + k * (1 - expectedScore);
                participant.elo = Math.floor(rating);
                participant.inMatch = false;
                return participant;
            });

            rating2 = team2.map(participant => {
                const expectedScore = expectedScore2;
                const score = participant.inMatch ? team2Score : team1Score;
                const rating = participant.elo + k * (0 - expectedScore);
                participant.elo = Math.floor(rating);
                participant.inMatch = false;
                return participant;
            });
        } else if (team2Score > team1Score) {
            rating1 = team1.map(participant => {
                const expectedScore = expectedScore1;
                const score = participant.inMatch ? team1Score : team2Score;
                const rating = participant.elo + k * (0 - expectedScore);
                participant.elo = Math.floor(rating);
                participant.inMatch = false;
                return participant;
            });

            rating2 = team2.map(participant => {
                const expectedScore = expectedScore2;
                const score = participant.inMatch ? team2Score : team1Score;
                const rating = participant.elo + k * (1 - expectedScore);
                participant.elo = Math.floor(rating);
                participant.inMatch = false;
                return participant;
            });
        } else {
            // handle tie scenario
        }
        const match = this.matches.find(m => m.id === matchid);
        if (match) {
            console.log("match=", match);
            console.log("match.team1=", match.team1);
            console.log("match.team2=", match.team2);
        }
        this.participants.sort((a, b) => b.elo - a.elo);
        const matchOver: number = this.matches.findIndex(x => x.id === matchid);

        if (matchOver > -1) {
            this.matches.splice(matchOver, 1);
        }
    }

    /* Create Test Participants */
    /* Test Data */
    names: Array<string> = ["Johannes", "Kristoffer", "Frej", "Andreas", "Martin", "Peter M", "Peter Tech", "Charlotte", "Anders", "Danni", "Anne", "Oystein", "Kasper", "Ali", "Christian", "Hristina", "Peter C", "Miika", "Marcus", "Simon", "Dominika", "Jdog", "Jonathan", "Anna", "Ditte", "Anne"];
    CreateTestParticipants() {
        this.isTest = true;
        this.participantsMade = true;
        this.participants = [];
        this.names.forEach((name) => {
            this.CreateNewParticipant(name);
        });
    }
}
