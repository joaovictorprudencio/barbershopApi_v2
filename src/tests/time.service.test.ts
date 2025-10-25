import { Time } from "../models/time";
import { TimeRepositoryPrisma } from "../repository/prisma/time.repository.prisma";
import { TimeServiceIplement } from "../service/time.implementation";

// Usa o mock automático do jest para a classe
jest.mock('../repository/prisma/time.repository.prisma');

describe('TimeService', () => {
  let timeService: TimeServiceIplement;
  let timeRepository: jest.Mocked<TimeRepositoryPrisma>;

  beforeEach(() => {
    timeRepository = {
      findByDate: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<TimeRepositoryPrisma>;

    timeService = TimeServiceIplement.build(timeRepository);
  });

  it('deve criar um horário', async () => {
    const mockDto = {
      date: new Date('2025-08-09'),
      time: '9:00',
      nameCustumer: 'Joaquim',
      phoneCustumer: '11111111',
      available: false,
    };

    const mockTime: Time = {
      id: 1,
      available: false,
      date: new Date('2025-08-09'),
      time: '9:00',
      nameCustumer: 'Joaquim',
      phoneCustumer: '11111111',
      toObject: function (): Record<string, any> {
        throw new Error("Function not implemented.");
      }
    };


    timeRepository.findByDate.mockResolvedValue(null);
    timeRepository.create.mockResolvedValue(mockTime);


    const result = await timeService.marchTime(mockDto);

    
    expect(result).toEqual(mockTime);
    expect(timeRepository.findByDate).toHaveBeenCalledWith(
      mockDto.date,
      mockDto.time,
    );
    expect(timeRepository.create).toHaveBeenCalledWith(
      false,
      expect.any(Date),
      mockDto.time,
      mockDto.nameCustumer,
      mockDto.phoneCustumer,
    );
  });
});

