import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { Route } from './routes.entity';
import { CreateRouteDto, EditRouteDto, UploadRoutesDto } from './dto/route.dto';

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
  /**
   * Gets route by id
   * @param id 
   * @returns 
   */
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Route> {
    return await this.routesService.findOne(id);
  }

  /**
   * Creates a new route
   * @param route 
   * @returns 
   */
  @Post()
  async createRoute(@Body() route: CreateRouteDto): Promise<Route> {
    return await this.routesService.createRoute(route);
  }

  /** 
   * Uploads route data
   */
  @Post('data')
  async postData(@Body() data: UploadRoutesDto): Promise<any> {
    return await this.routesService.postData(data);
  }

  /**
   * Update a route
   * @param id 
   * @param routeData 
   * @returns 
   */
  @Patch(':id')
  async editRoute(
    @Param('id') id: number,
    @Body() routeData: EditRouteDto,
  ): Promise<Route> {
    const route = await this.routesService.findOne(id);

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return await this.routesService.updateRoute(route, routeData);
  }

  /**
   * Delete a route
   * @param id 
   * @returns 
   */
  @Delete(':id')
  async deleteRoute(@Param('id') id: number): Promise<Route> {
    const route = await this.routesService.findOne(id);

    if (!route) {
      throw new NotFoundException('Route not found');
    }
    return await this.routesService.deleteRoute(route);
  }
}
