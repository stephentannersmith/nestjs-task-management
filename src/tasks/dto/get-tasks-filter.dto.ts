import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task-status.model";

export class GetTasksFilterDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}