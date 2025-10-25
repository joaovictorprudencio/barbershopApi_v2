import { BarberServiceImplement } from '../service/barbeiro.implementation';
import bcrypt from 'bcryptjs';

const mockRepository = {
  create: jest.fn(async (barber: any) => ({
    ...barber,
    id: 1,
  })),
  findByEmail: jest.fn(),
};

describe('BarbeiroService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve instanciar o serviço corretamente', () => {
  const service = new (BarberServiceImplement as any)(mockRepository);
    expect(service).toBeInstanceOf(BarberServiceImplement);
  });

  it('deve criar um barbeiro', async () => {
    const newBarber = {
      id:1,
      name: 'João',
      email: 'joao@email.com',
      password: '123',
      numberPhone: '1234567890'
    };

    const service = new BarberServiceImplement(mockRepository as any);
    const barbeiroCriado = await service.create(newBarber);

    expect(barbeiroCriado.props.name).toBe(newBarber.name);
    expect(barbeiroCriado.props.email).toBe(newBarber.email);
    expect(barbeiroCriado.props.numberPhone).toBe(newBarber.numberPhone);


    const senhaCorreta = await bcrypt.compare(
      newBarber.password,
      barbeiroCriado.password
    );

    expect(senhaCorreta).toBe(true)


  });
});
