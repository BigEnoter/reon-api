import { ApiProperty } from "@nestjs/swagger";
import { MinLength, MaxLength } from "class-validator";

export class CreateProjectDto {
    @ApiProperty({ description: "Название проекта" })
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({ description: "Описание проекта" })
    @MinLength(1)
    @MaxLength(255)
    description: string
};