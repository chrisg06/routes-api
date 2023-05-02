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

  async createUser(pUser: any): Promise<User> {
    const u=pUser.data;
    const cid = Number(u.cid);

    const user = new User()
    user.cid = cid;
    user.firstName = u.personal.name_first;
    user.lastName = u.personal.name_last;

    const savedUser = await this.usersRepository.save(user);
    
    return savedUser;
  }
}