import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    private http: HttpService,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({id: id});

    if (!user) throw new NotFoundException();

    return user;
  }

  async findByCid(cid: string | number): Promise<User> {
    cid = Number(cid);
    const user = await this.usersRepository.findOneBy({cid: cid});

    if (!user) throw new NotFoundException();

    return user;
  }

}