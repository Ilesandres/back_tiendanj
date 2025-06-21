import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleEntity } from './entity/people.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([PeopleEntity]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports:[PeopleService]
})
export class PeopleModule {}
