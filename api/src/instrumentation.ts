import {
  Objective,
  ObjectiveLatency,
  ObjectivePercentile,
} from "@autometrics/autometrics";

export const API_SLO: Objective = {
  name: "api",
  successRate: ObjectivePercentile.P99_9,
  latency: [ObjectiveLatency.Ms100, ObjectivePercentile.P99],
};

