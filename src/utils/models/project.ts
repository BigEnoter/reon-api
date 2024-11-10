import { UUID } from "crypto";
import { model, Schema } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class Project {
    @ApiProperty({ description: "ID проекта" })
    id?: UUID;

    @ApiProperty({ description: "Название проекта" })
    title: string;

    @ApiProperty({ description: "Описание проекта" })
    description: string;

    @ApiProperty({ description: "ID создателя проекта" })
    creator?: UUID;

    @ApiProperty({ description: "Время создания проекта" })
    createdAt?: number;

    @ApiProperty({ description: "Участники проекта" })
    workers?: Array<UUID>;
};
export interface IProject {
    id?: UUID,
    title: string,
    description: string,
    creator?: UUID,
    createdAt?: number,
    workers?: Array<UUID>
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
    workers: {
        type: [String],
        default: []
    }
});

export default model("project", projectSchema);