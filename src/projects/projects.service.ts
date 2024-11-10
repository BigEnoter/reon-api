import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectsService {
    test(): object {
        return { message: "this is a test route" };
    }
}