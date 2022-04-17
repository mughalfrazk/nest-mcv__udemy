import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
    const users: User[] = []
    fakeUsersService = {
      find: (email: string) => {
        const found = users.filter(user => user.email === email)
        return Promise.resolve(found)
      },
      create: (email: string, password: string) => {
        let user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password
        } as User
        users.push(user);
        return Promise.resolve(user);
      }
    }

    const module = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: fakeUsersService
      }]
    }).compile();

    service = module.get(AuthService);
  })

  it('can create an instance', async () => {
    expect(service).toBeDefined();
  })

  it('creates a new user with salted and hashed password', async () => {
    const testEmail = 'test@gmail.com'
    const testPassword = 'password'

    const user = await service.signup(testEmail, testPassword);

    expect(user.password).not.toEqual(testPassword);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it('throws an error if user signs up with email that is in use.', async () => {
    await service.signup('test@gmail.com', 'password');
    await expect(service.signup('test@gmail.com', 'password')).rejects.toThrow('Email already in use.')
  })

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('test@gmail.com', 'password')).rejects.toThrow('User not found.')
  })

  it('throws if an invalid if an invalid password is provided', async () => {
    await service.signup('test@gmail.com', 'password');
    await expect(service.signin('test@gmail.com', 'password1')).rejects.toThrow('bad password')
  })

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@gmail.com', 'password');
    const user = await service.signin('test@gmail.com', 'password');
    expect(user).toBeDefined();
  })
})