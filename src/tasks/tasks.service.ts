import { HttpException, Injectable } from "@nestjs/common";
import { UUID, randomUUID } from "crypto";
import Task, { ITask } from "src/utils/models/task";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import Project from "src/utils/models/project";
import { EditTitleDto } from "./dto/edit-title.dto";
import { AddUserDto } from "src/projects/dto/add-user.dto";
import User from "src/utils/models/user";
import { EditDeadlineDto } from "./dto/edit-deadline.dto";

@Injectable()
export class TasksService {
    getAll(): Promise<ITask[]> {
        return Task.find({}, { _id: 0 });
    };

    getById(taskId: UUID): Promise<ITask> {
        return Task.findOne({ id: taskId }, { _id: 0 }).then((foundTask) => {
            if (foundTask) {
                return foundTask;
            } else {
                throw new HttpException(`Coulnd't find task with id ${taskId}`, 404);
            };
        });
    };

    async create(projectId: UUID, createTaskDto: CreateTaskDto, req: Request): Promise<ITask> {
        const token = req.headers.authorization?.replace(/bearer\s/gmi, "");

        try {
            const { id: userId } = verify(token, "reon");

            const projectCheck = await Project.findOne({ id: projectId });

            if (projectCheck?.id) {
                const task = new Task({
                    id: randomUUID(),
                    title: createTaskDto.title,
                    deadline: createTaskDto.deadline,
                    projectId,
                    assignedTo: [userId],
                    creator: userId
                });

                return task.save();
            } else {
                throw new HttpException(`Couldn't create task for project that doesn't exists`, 400);
            };
        } catch {
            throw new HttpException("Couldn't create task", 400);
        };
    };

    deleteById(taskId: UUID, req: Request): Promise<object> {
        const token = req.headers.authorization?.replace(/bearer\s/gmi, "");

        try {
            const userData = verify(token, "reon");

            if (userData?.id) {
                return Task.findOneAndDelete({ id: taskId }).then((deletedTask) => {
                    if (deletedTask) {
                        return { success: true, message: `Successfully deleted task with id ${taskId}` }
                    } else {
                        throw new HttpException(`Couldn't find task with id ${taskId}`, 404);
                    };
                });
            }
        } catch {
            throw new HttpException(`Couldn't delete task with id ${taskId}`, 400);
        };
    };

    editTitle(taskId: UUID, body: EditTitleDto): Promise<object> {
        return Task.findOneAndUpdate({ id: taskId }, { title: body.newTitle }).then((updatedTitle) => {
            if (updatedTitle) {
                return { success: true, message: `Successfully updated title of task with id ${taskId}` };
            } else {
                throw new HttpException(`Couldn't find task with id ${taskId}`, 404);
            };
        });
    };

    async addUser(taskId: UUID, body: AddUserDto): Promise<object> {
        const userCheck = await User.findOne({ id: body.userId });

        if (userCheck?.id) {
            return Task.findOneAndUpdate({ id: taskId }, { $addToSet: { assignedTo: body.userId } }).then((updatedTask) => {
                if (updatedTask) {
                    return { success: true, message: `Successfully added user ${body.userId} to task ${taskId}` };
                } else {
                    throw new HttpException(`Couldn't find task with id ${taskId}`, 404);
                }
            });
        } else {
            throw new HttpException(`User with id ${body.userId} doesn't even exists`, 400);
        };
    };

    async removeUser(taskId: UUID, body: AddUserDto): Promise<object> {
        const userCheck = await User.findOne({ id: body.userId });

        if (userCheck?.id) {
            return Task.findOneAndUpdate({ id: taskId }, { $pull: { assignedTo: body.userId } }).then((updatedTask) => {
                if (updatedTask) {
                    return { success: true, message: `Successfully removed user ${body.userId} from task ${taskId}` };
                } else {
                    throw new HttpException(`Couldn't find task with id ${taskId}`, 404);
                }
            });
        } else {
            throw new HttpException(`User with id ${body.userId} doesn't even exists`, 400);
        };
    };

    editDeadline(taskId: UUID, body: EditDeadlineDto): Promise<object> {
        return Task.findOneAndUpdate({ id: taskId }, { deadline: body.newDeadline }).then((updatedTask) => {
            if (updatedTask) {
                return { success: true, message: `Successfully updated deadline of task with id ${taskId}` };
            } else {
                throw new HttpException(`Couldn't find task with id ${taskId}`, 404);
            };
        });
    };

    async changeStatus(taskId: UUID): Promise<object> {
        const oldStatus = await Task.findOne({ id: taskId }, { _id: 0, done: 1 });
        return Task.findOneAndUpdate({ id: taskId }, { done: !oldStatus.done }).then((updatedTask) => {
            if (updatedTask) {
                return { success: true, message: `Successfully changed status of task with id ${taskId}` };
            } else {
                throw new HttpException(`Couldn't find task with id ${taskId}`, 404);
            };
        });
    };
};