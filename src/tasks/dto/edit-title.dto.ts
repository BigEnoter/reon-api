import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";

export class EditTitleDto {
    @MinLength(1)
    @MaxLength(255)
    @ApiProperty({ description: "Новое название для задачи" })
    newTitle: string;
};