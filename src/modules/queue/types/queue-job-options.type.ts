import { BullModuleOptions } from "@nestjs/bull";
import Bull from "bull"

export type QueueJobOptions = Partial<Bull.JobOptions> & Partial<BullModuleOptions>;