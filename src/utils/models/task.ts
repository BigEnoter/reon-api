import { UUID } from "crypto";
import { model, Schema } from "mongoose";

export interface ITask {
    id: UUID,
    title: string,
    assignedTo: Array<UUID>,
    deadline: Date,
    done: boolean,
    projectId: UUID
};

const taskSchema = new Schema<ITask>({
    id: {
        type: String,
        index: true
    },
    title: String,
    assignedTo: [String],
    deadline: Date,
    done: {
        type: Boolean,
        default: false
    },
    projectId: String
});

export default model("task", taskSchema);