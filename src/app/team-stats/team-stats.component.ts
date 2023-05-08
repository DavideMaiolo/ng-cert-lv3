import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NbaService } from '../nba.service';
import { Game, Stats, Team } from '../data.models';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.css'],
})
export class TeamStatsComponent implements OnInit, OnChanges {
  @ViewChild('modalRef') modalRef: ElementRef<HTMLDialogElement> | undefined;

  @Input()
  team!: Team;
  @Input()
  numberOfDays: string = '12';

  games$!: Observable<Game[]>;
  stats!: Stats;

  modalDeleteMessage: string = 'Are you sure you want to remove this team?';
  constructor(protected nbaService: NbaService) {}

  ngOnInit(): void {
    this.games$ = this.nbaService
      .getLastResults(this.team, Number(this.numberOfDays))
      .pipe(
        tap(
          (games) =>
            (this.stats = this.nbaService.getStatsFromGames(games, this.team))
        )
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.games$ = this.nbaService
      .getLastResults(this.team, changes['numberOfDays'].currentValue)
      .pipe(
        tap(
          (games) =>
            (this.stats = this.nbaService.getStatsFromGames(games, this.team))
        )
      );
  }

  deleteTeamAndClose() {
    this.nbaService.removeTrackedTeam(this.team);
    /* optimally the removeTrackedTeam should return a Promise or Observable on which we can wait for success or error
     * but adjusting the nbaService is not within the Scope of this exercise
     */
    this.modalRef?.nativeElement.close();
  }
}
