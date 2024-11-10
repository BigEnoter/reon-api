import { UUID } from "crypto";
import { model, Schema } from "mongoose";

export interface IProject {
    id: UUID,
    title: string,
    description: string,
    creator: UUID,
    createdAt: number,
    workers: Array<UUID>
};

const projectSchema = new Schema<IProject>({
    id: {
        type: String,
        index: true
    },
    title: String,
    description: String,
    creator: String,
    createdAt: Number,
    workers: [String]
});

export default model("project", projectSchema);