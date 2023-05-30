import { BullModuleOptions } from "@nestjs/bull";

export const queueConfig: BullModuleOptions = {
    name: 'sensor-data-queue'
}