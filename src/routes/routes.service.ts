import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './routes.entity';

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Route)
        private routesRepository: Repository<Route>,
    ) {}

    async findAll(dept?: string, dest?: string): Promise<{ count: number, routes: Route[] }> {
        const queryBuilder = this.routesRepository.createQueryBuilder('route');
        if (dept) {
          queryBuilder.where('route.dept = :dept', { dept });
        }
        if (dest) {
          queryBuilder.andWhere('route.dest = :dest', { dest });
        }
        const [routes, count] = await queryBuilder.getManyAndCount();
        return { count, routes };
      }

    async findOne(id: number): Promise<Route> {
        return await this.routesRepository.findOneBy({id: id});
    }

}