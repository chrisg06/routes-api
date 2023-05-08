import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { Route } from './routes.entity';
import { CreateRouteDto } from './dto/route.dto';

@ApiBearerAuth()
@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) {}

    /**
     * List all routes
     */
    @Get()
    async findAll(@Query('dept') dept?: string, @Query('dest') dest?: string) {
        const { count, routes } = await this.routesService.findAll(dept, dest);
        return { count, routes: routes };
      }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Route> {
        return await this.routesService.findOne(id);
    }

    @Post()
    async createRoute(@Body() route: CreateRouteDto): Promise<Route> {
        return await this.routesService.createRoute(route);
    }
}