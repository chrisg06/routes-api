import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './routes.entity';
import { CreateRouteDto, EditRouteDto } from './dto/route.dto';

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

    async createRoute(route: CreateRouteDto): Promise<Route> {
      const newRoute = new Route();
      newRoute.dept = route.dept;
      newRoute.dest = route.dest;
      newRoute.acft = route.acft;
      newRoute.route = route.route;
      newRoute.notes = route.notes;
      return await this.routesRepository.save(newRoute);
  }
  
  async updateRoute(route: Route, routeData: EditRouteDto): Promise<Route> {
    Object.assign(route, routeData)
    return await this.routesRepository.save(route);
  }

  async deleteRoute(route: Route): Promise<Route> {
    return await this.routesRepository.remove(route);
  }
}