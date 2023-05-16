import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { Route } from './routes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route])],
  providers: [RoutesService],
  controllers: [RoutesController],
})
export class RoutesModule {}
