import { Component, OnInit } from '@angular/core';
import { FinancesService } from '../../core/services/finances.service';
import { Objective } from '../../core/models/database/Objective.model';
import { lastValueFrom } from 'rxjs';
import { ObjectiveGraphComponent } from '../../utils/objective-graph/objective-graph.component';
@Component({
  selector: 'app-objetives',
  standalone: true,
  imports: [ObjectiveGraphComponent],
  templateUrl: './objetives.component.html',
  styleUrl: './objetives.component.scss',
})
export class ObjetivesComponent implements OnInit {
  public objectives: Objective[] = [];

  constructor(private financesService: FinancesService) {}

  async ngOnInit() {
    const response = await lastValueFrom(
      this.financesService.getNoCompleteObjectives()
    );
    this.objectives = response.data;
  }
}
