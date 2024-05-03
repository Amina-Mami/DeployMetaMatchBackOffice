import { User } from "app/auth/models";
export interface Injury {
    idInjury?: string; 
    player_id?: User;
    date?: Date;
    type?: string;
    description?: string;
    recovery_status?: string;
    duration?: Date;
    archived?: Boolean;
  }