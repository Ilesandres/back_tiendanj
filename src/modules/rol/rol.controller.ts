import { Controller, Get, Param } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolEntity } from './entity/rol.entity';

@Controller('rol')
export class RolController {
    constructor(
        private readonly rolService: RolService
    ){}

    @Get()
    async findAll(): Promise<RolEntity[]> {
        return this.rolService.findAll();
    }

    @Get('id/:id')
    async findById(@Param('id') id: number): Promise<RolEntity> {
        return this.rolService.findById(id);
    }

    @Get('name/:name')
    async findByName(@Param('name') name: string): Promise<RolEntity> {
        return this.rolService.findByName(name);
    }
}
