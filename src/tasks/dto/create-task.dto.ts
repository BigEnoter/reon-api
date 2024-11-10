import { ApiProperty } from "@nestjs/swagger";
import { MinLength, MaxLength, IsNumber } from "class-validator";

export class CreateTaskDto {
    @MinLength(1)
    @MaxLength(255)
    @ApiProperty({ description: "Название задачи" })
    title: string;

    @IsNumber()
    @ApiProperty({ description: "Дедлайн выполнения в формате Unix Timestamp" })
    deadline: number;
};

// export class CreateTaskUUID {
//     @IsUUID()
//     @ApiProperty({ description: "ID проекта, к которому будет добавлена задача" })
//     projectId: string
// };