import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class EditDeadlineDto {
    @ApiProperty({ description: "Новый дедлайн в формате Unix Timestamp" })
    @IsNumber()
    newDeadline: number;
};