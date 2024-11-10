import { UUID } from "crypto";
import { model, Schema } from "mongoose";

export class Task {
    id: UUID;
    title: string;
    assignedTo: Array<UUID>;
    deadline: number;
    done: boolean;
    projectId: UUID;
    creator: UUID;
};
export interface ITask {
    id: UUID,
    title: string,
    assignedTo: Array<UUID>,
    deadline: number,
    done: boolean,
    projectId: UUID,
    creator: UUID
};

const taskSchema = new Schema<ITask>({
    id: {
        type: String,
        index: true
    },
    title: String,
    assignedTo: [String],
    deadline: Number,
    done: {
        type: Boolean,
        default: false
    },
    projectId: {
        type: String,
        index: true
    },
    creator: String
});

export default model("task", taskSchema);