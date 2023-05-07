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

        /*         this.participants[0].elo = 1800;
        this.participants[1].elo = 1800;
        this.participants[2].elo = 1800;
        this.participants[3].elo = 1800;
        var newArray = this.participants.sort((a, b) => a.elo - b.elo);
        newArray.reverse();
        console.log(newArray)*/
    }

    /* Change Elo based on match result */
    MatchResult(matchid: number, team: number) {
        var result = this.matches[matchid];
        if (team == 1) {
            for (let i = 0; i < this.numOfParticipantsPerMatch / this.numPerTeam; i++) {
                result.team1[i].elo += 25;
                result.team2[i].elo -= 25;
            }
        } else if (team == 2) {
            for (let i = 0; i < this.numOfParticipantsPerMatch / this.numPerTeam; i++) {
                result.team2[i].elo += 25;
                result.team1[i].elo -= 25;
            }
        }
        this.participants.sort((a, b) => b.elo - a.elo);
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
