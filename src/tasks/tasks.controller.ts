import { Controller, Get, UseGuards, Param, Body, Post, Req, Delete, Put } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { ITask, Task } from "src/utils/models/task";
import { UUID } from "crypto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Request } from "express";
import { EditTitleDto } from "./dto/edit-title.dto";
import { AddUserDto } from "src/projects/dto/add-user.dto";
import { EditDeadlineDto } from "./dto/edit-deadline.dto";
@Controller("tasks")
@UseGuards(RolesGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { };

    @Get()
    @ApiOperation({ summary: "Получить все задачи" })
    @ApiResponse({ status: 200, description: "Список всех задач", type: [Task] })
    getAll(): Promise<ITask[]> {
        return this.tasksService.getAll();
    };

    @Get(":taskId")
    @ApiOperation({ summary: "Получить задачу по ID" })
    @ApiParam({ name: "taskId", description: "UUID задачи", type: String })
    @ApiResponse({ status: 200, description: "Задача найдена", type: Task })
    @ApiResponse({ status: 404, description: "Задача не найдена" })
    getById(@Param('taskId') taskId: UUID): Promise<ITask> {
        return this.tasksService.getById(taskId);
    };

    @Post("/project/:projectId")
    @ApiBearerAuth()
    @Roles(["admin", "employee"])
    @ApiOperation({ summary: "Создать задачу для проекта" })
    @ApiParam({ name: "projectId", description: "UUID проекта", type: String })
    @ApiResponse({ status: 201, description: "Задача успешно создана", type: Task })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 400, description: "Ошибка при создании задачи" })
    create(@Param('projectId') projectId: UUID, @Body() createTaskDto: CreateTaskDto, @Req() req: Request): Promise<ITask> {
        return this.tasksService.create(projectId, createTaskDto, req);
    }

    @Delete(":taskId")
    @ApiBearerAuth()
    @Roles(["admin", "employee"])
    @ApiOperation({ summary: "Удалить задачу по ID" })
    @ApiParam({ name: "taskId", description: "UUID задачи", type: String })
    @ApiResponse({ status: 200, description: "Задача успешно удалена" })
    @ApiResponse({ status: 400, description: "Ошибка при удалении задачи" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Задача не найдена" })
    deleteById(@Param('taskId') taskId: UUID, @Req() req: Request): Promise<object> {
        return this.tasksService.deleteById(taskId, req);
    };

    @Put(":taskId/title")
    @ApiBearerAuth()
    @Roles(["admin", "employee"])
    @ApiOperation({ summary: "Изменить название задачи" })
    @ApiParam({ name: "taskId", description: "UUID задачи", type: String })
    @ApiResponse({ status: 200, description: "Название задачи успешно обновлено" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Задача не найдена" })
    editTitle(@Param('taskId') taskId: UUID, @Body() body: EditTitleDto): Promise<object> {
        return this.tasksService.editTitle(taskId, body);
    };

    @Put(":taskId/users")
    @ApiBearerAuth()
    @Roles(["admin", "employee"])
    @ApiOperation({ summary: "Добавить пользователя к задаче" })
    @ApiParam({ name: "taskId", description: "UUID задачи", type: String })
    @ApiResponse({ status: 200, description: "Пользователь успешно добавлен" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Задача или пользователь не найдены" })
    addUser(@Param('taskId') taskId: UUID, @Body() body: AddUserDto): Promise<object> {
        return this.tasksService.addUser(taskId, body);
    };

    @Delete(":taskId/users")
    @ApiBearerAuth()
    @Roles(["admin", "employee"])
    @ApiOperation({ summary: "Удалить пользователя из задачи" })
    @ApiParam({ name: "taskId", description: "UUID задачи", type: String })
    @ApiResponse({ status: 200, description: "Пользователь успешно удален" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Задача или пользователь не найдены" })
    removeUser(@Param('taskId') taskId: UUID, @Body() body: AddUserDto): Promise<object> {
        return this.tasksService.removeUser(taskId, body);
    };

    @Put(":taskId/deadline")
    @ApiBearerAuth()
    @Roles(["admin", "employee"])
    @ApiOperation({ summary: "Изменить дедлайн задачи" })
    @ApiParam({ name: "taskId", description: "UUID задачи", type: String })
    @ApiResponse({ status: 200, description: "Срок дедлайн обновлен" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Задача не найдена" })
    editDeadline(@Param('taskId') taskId: UUID, @Body() body: EditDeadlineDto): Promise<object> {
        return this.tasksService.editDeadline(taskId, body);
    };

    @Put(":taskId/status")
    @ApiBearerAuth()
    @Roles(["admin", "employee"])
    @ApiOperation({ summary: "Изменить статус задачи" })
    @ApiParam({ name: "taskId", description: "UUID задачи", type: String })
    @ApiResponse({ status: 200, description: "Статус задачи успешно изменен" })
    @ApiResponse({ status: 403, description: "Недостаточно прав" })
    @ApiResponse({ status: 404, description: "Задача не найдена" })
    changeStatus(@Param('taskId') taskId: UUID): Promise<object> {
        return this.tasksService.changeStatus(taskId);
    };
};