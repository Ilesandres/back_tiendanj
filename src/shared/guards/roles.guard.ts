import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector :Reflector){}

    canActivate(context: ExecutionContext): boolean  {
        const requiredRoles=this.reflector.get<string[]>('roles',context.getHandler());
        if(!requiredRoles)return true;

        const {user}=context.switchToHttp().getRequest();
        if(!requiredRoles.includes(user.rol)) throw new UnauthorizedException({message:"no tienes permisos para acceder a este recurso"});
        return true;

    }
} 