import { Objective } from '../../models/database/Objective.model';

export interface ContributionDto {
  amount: number;
  message?: string;
  created_at: Date;
  objective: Objective;
}
