
import { ChairStates } from "src/common/enums";

export type ChairType = {

    chair_id: string;

    battery: number;

    state: ChairStates;

    qr_code: string;

};