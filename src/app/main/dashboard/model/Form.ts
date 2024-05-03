export class Form{
    _id: string; 
    playerInformation!: {
        playerName: string;
        team: string;
        position: string;
        
      };
      performanceMetrics!: {
        passing: {
          totalPasses: number;
          successfulPasses: number;
          passingAccuracy: number;
          keyPasses: number;
        };
        shooting: {
          totalShots: number;
          shotsOnTarget: number;
          goalsScored: number;
          shotAccuracy: number;
        };
        defending: {
          tackles: number;
          interceptions: number;
          clearances: number;
          blocks: number;
        };
        physical: {
          distanceCovered: number;
          sprints: number;
          duelsWon: number;
          aerialDuelsWon: number;
        };
        creativity: {
          assists: number;
          crossesCompleted: number;
          throughBallsCompleted: number;
          dribblesCompleted: number;
        };
        discipline: {
          yellowCards: number;
          redCards: number;
          foulsCommitted: number;
          foulsSuffered: number;
        };
        overallAssessment: {
          rating: number;
          comments: string;
        };
      };
      additionalObservations!: string;
}