import { Component } from '@angular/core';
import { Team } from '../data.models';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinct,
  from,
  map,
  mergeMap,
  retry,
  tap,
  toArray,
} from 'rxjs';
import { NbaService } from '../nba.service';

@Component({
  selector: 'app-game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.css'],
})
export class GameStatsComponent {
  private selectedConferenceSub$ = new BehaviorSubject<string>('');
  selectedConference$ = this.selectedConferenceSub$.asObservable();
  private selectedDivisionSub$ = new BehaviorSubject<string>('');
  selectedDivision$ = this.selectedDivisionSub$.asObservable();
  private selectedTeamSub$ = new BehaviorSubject<Team | null>(null);
  selectedTeam$ = this.selectedTeamSub$.asObservable();

  private teamsSubject$ = new BehaviorSubject<Team[]>([]);
  teams$ = this.teamsSubject$.asObservable();
  private conferencesSub$ = new BehaviorSubject<string[]>([]);
  conferences$ = this.conferencesSub$.asObservable();
  private divisionsSub$ = new BehaviorSubject<string[]>([]);
  divisions$ = this.divisionsSub$.asObservable();
  private filteredTeamsSubject$ = new BehaviorSubject<Team[]>([]);
  filteredTeams$ = this.filteredTeamsSubject$.asObservable();

  allTeams: Team[] = [];
  filteredTeams: Team[] = [];

  constructor(protected nbaService: NbaService) {
    this.teams$ = nbaService.getAllTeams().pipe(
      tap((data) => {
        this.allTeams = data;
      })
    );

    this.conferences$ = this.teams$.pipe(
      map((teams: Team[]) => teams.map((team) => team.conference)),
      mergeMap((teams) => from(teams)),
      distinct(),
      toArray()
    );

    this.divisions$ = this.filteredTeamsByToken(
      this.teams$,
      this.selectedConference$,
      'conference'
    ).pipe(
      map((teams: Team[]) => {
        let divisions: string[] = teams.map((team) => team.division);
        let uniqueDivisions: string[] = Array.from(new Set(divisions));
        return uniqueDivisions;
      })
    );

    this.filteredTeams$ = this.filteredTeamsByToken(
      this.teams$,
      this.selectedConference$,
      'conference'
    ).pipe(
      (teamsFilteredByConference) =>
        this.filteredTeamsByToken(
          teamsFilteredByConference,
          this.selectedDivision$,
          'division'
        ),
      tap((filteredTeams: Team[]) => (this.filteredTeams = filteredTeams))
    );
  }

  filteredTeamsByToken<Type, Key extends keyof Type>(
    teams$: Observable<Type[]>,
    filterToken$: Observable<string>,
    property: Key
  ): Observable<Type[]> {
    return combineLatest([teams$, filterToken$]).pipe(
      map(([allTeams, tokenToFilter]) => {
        if (tokenToFilter === '') {
          return allTeams;
        }
        return allTeams?.filter((team) => team[property] === tokenToFilter);
      })
    );
  }

  conferenceChanged(selectedConferenceEvent: any) {
    this.selectedDivisionSub$.next('');
    this.selectedTeamSub$.next(null);
    this.selectedConferenceSub$.next(selectedConferenceEvent.target.value);
  }

  divisionChanged(selectedDivisionEvent: any) {
    this.selectedTeamSub$.next(null);
    this.selectedDivisionSub$.next(selectedDivisionEvent.target.value);
  }

  trackTeamOrTeams(teamId?: string) {
    if (Number(teamId) != 0) {
      let team = this.allTeams.find((team) => team.id == Number(teamId));
      if (team) {
        this.nbaService.addTrackedTeam(team);
      }
    } else {
      this.filteredTeams?.forEach((team) =>
        this.nbaService.addTrackedTeam(team)
      );
    }
  }
}
