import type { CourseSpec } from "../types";
import { orientationCourse } from "./orientation";
import { consultingFoundationsCourse } from "./consulting-foundations";
import { clientAcquisitionCourse } from "./client-acquisition";
import { aiOperationsCourse } from "./ai-operations";

/** Catalog order. The free orientation course goes first on purpose. */
export const courseSpecs: CourseSpec[] = [
  orientationCourse,
  consultingFoundationsCourse,
  clientAcquisitionCourse,
  aiOperationsCourse,
];
