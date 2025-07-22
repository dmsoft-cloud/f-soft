import { GroupStruct } from "../../utils/structs/groupStruct";
import { InterfaceStruct } from "../../utils/structs/interfaceStruct";
import { ModelStruct } from "../../utils/structs/modelStruct";
import { OriginStruct } from "../../utils/structs/originStruct";


export interface FlowWizardData {

    group?: GroupStruct;

    model?: ModelStruct;

    origin?: OriginStruct;

    interface?: InterfaceStruct;

}