import '@jest/globals';
import { TimeServiceIplement } from '../service/time.implementation';
import { Time } from '../entities/time';
import { createTimeDto } from '../service/time.service';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';


dayjs.extend(utc);
dayjs.extend(timezone);

const mockRepository = {
  create: jest.fn(),
  validationData: jest.fn(),
  findByState: jest.fn(),
  findByDate: jest.fn(),
  finbyId: jest.fn(),
  update: jest.fn(),
  deleteForAll: jest.fn(),
};

const mockTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
  '17:30', '18:00', '18:30', '19:00', '19:30'
];

const baseDateSP = dayjs().tz('America/Sao_Paulo').add(1, 'day').startOf('day');
const baseDate = baseDateSP.toDate();
const baseDateStr = baseDateSP.format('YYYY-MM-DD');

describe('TimeService', () => {
  let service: TimeServiceIplement;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TimeServiceIplement(mockRepository as any);
  });

  describe('generateTime', () => {
    it('deve criar horários para o dia atual no fuso America/Sao_Paulo', async () => {
      mockRepository.deleteForAll.mockResolvedValue(undefined);
      mockRepository.validationData.mockResolvedValue(null);
      mockRepository.create.mockImplementation(async (available: boolean, date: Date, time: string) => {
        return Time.persistence('1', available, date, time, 'job', '11111111111');
      });

      await service.generateTime();

      expect(mockRepository.deleteForAll).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalledTimes(mockTimeSlots.length);
      
      const firstCall = mockRepository.create.mock.calls[0];
      const createdDate = firstCall[1] as Date;
      const createdDateStr = dayjs(createdDate).tz('America/Sao_Paulo').format('YYYY-MM-DD');
      const todaySP = dayjs().tz('America/Sao_Paulo').format('YYYY-MM-DD');
      expect(createdDateStr).toBe(todaySP);
    });
  });

  describe('marchTime', () => {
    const validDto: createTimeDto = {
      available: false,
      date: baseDate,
      time: '14:00',
      nameCustumer: 'Maria',
      phoneCustumer: '11977776666'
    };

    it('deve agendar horário disponível (fluxo normal: update) e retornar date como YYYY-MM-DD', async () => {
      mockRepository.validationData
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(Time.persistence('1', true, baseDate, '14:00', '', ''));
      mockRepository.update.mockResolvedValue(Time.persistence('1', false, baseDate, '14:00', 'Maria', '11977776666'));

      const result = await service.marchTime(validDto);

      expect(result).toBeDefined();
      expect(result?.toObject().date).toBe(baseDateStr);
      expect(result?.toObject().time).toBe('14:00');
      expect(result?.toObject().available).toBe(false);
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('deve rejeitar data passada comparando no fuso America/Sao_Paulo', async () => {
      const pastDate = dayjs().tz('America/Sao_Paulo').subtract(1, 'day').toDate();
      const dto = { ...validDto, date: pastDate };

      await expect(service.marchTime(dto)).rejects.toThrow('A data informada já passou.');
    });

    it('deve lançar erro se horário já estiver indisponível', async () => {
      mockRepository.validationData
        .mockResolvedValueOnce(Time.persistence('1', false, baseDate, '14:00', 'João', '11988887777'));

      await expect(service.marchTime(validDto)).rejects.toThrow('Horário indisponível');
    });

    it('deve criar novo horário se não existir slot disponível (TimeAvailable == null)', async () => {
      mockRepository.validationData
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockRepository.create.mockResolvedValue(Time.persistence('2', false, baseDate, '14:00', 'Maria', '11977776666'));

      const result = await service.marchTime(validDto);

      expect(result).toBeDefined();
      expect(result?.toObject().date).toBe(baseDateStr);
      expect(result?.toObject().available).toBe(false);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('deve aceitar data com timezone e normalizar corretamente', async () => {
      const dtoWithTz = { ...validDto, date: new Date(`${baseDateStr}T10:30:00-03:00`) };
      mockRepository.validationData
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(Time.persistence('1', true, baseDate, '14:00', '', ''));
      mockRepository.create.mockResolvedValue(Time.persistence('2', false, baseDate, '14:00', 'Maria', '11977776666'));

      const result = await service.marchTime(dtoWithTz);

      expect(result).toBeDefined();
      expect(result?.toObject().date).toBe(baseDateStr);
    });
  });

  describe('listTimesAvailable', () => {
    it('deve retornar horários com date formatado como YYYY-MM-DD', async () => {
      const times = [
        Time.persistence('1', true, baseDate, '09:00', '', ''),
        Time.persistence('2', true, baseDate, '10:00', '', ''),
      ];
      mockRepository.findByState.mockResolvedValue(times);

      const result = await service.listTimesAvailable();

      expect(result).toHaveLength(2);
      expect(result?.[0].toObject().date).toBe(baseDateStr);
      expect(result?.[1].toObject().date).toBe(baseDateStr);
    });

    it('deve retornar array vazio se não houver horários', async () => {
      mockRepository.findByState.mockResolvedValue([]);

      const result = await service.listTimesAvailable();

      expect(result).toEqual([]);
    });
  });

  describe('listTimesUnavailable', () => {
    it('deve retornar horários ocupados com date formatado como YYYY-MM-DD', async () => {
      const times = [
        Time.persistence('1', false, baseDate, '14:00', 'João', '11988887777'),
      ];
      mockRepository.findByState.mockResolvedValue(times);

      const result = await service.listTimesUnavailable();

      expect(result).toHaveLength(1);
      expect(result?.[0].toObject().date).toBe(baseDateStr);
      expect(result?.[0].toObject().available).toBe(false);
    });
  });

  describe('findByDate', () => {
    it('deve buscar horário por data e time normalizados', async () => {
      const found = Time.persistence('1', false, baseDate, '14:00', 'Maria', '11977776666');
      mockRepository.findByDate.mockResolvedValue(found);

      const result = await service.findByDate(baseDate, '14:00');

      expect(result).toBeDefined();
      expect(result?.toObject().date).toBe(baseDateStr);
    });
  });

  describe('uncheckTime', () => {
    it('deve disponibilizar horário pelo ID', async () => {
      const time = Time.persistence('1', false, baseDate, '14:00', 'Maria', '11977776666');
      mockRepository.finbyId.mockResolvedValue(time);
      mockRepository.update.mockResolvedValue(Time.persistence('1', true, baseDate, '14:00', 'Maria', '11977776666'));

      await service.uncheckTime('1');

      expect(mockRepository.finbyId).toHaveBeenCalledWith('1');
      expect(mockRepository.update).toHaveBeenCalled();
      const updatedTime = mockRepository.update.mock.calls[0][0] as Time;
      expect(updatedTime.available).toBe(true);
    });

    it('deve lançar erro se horário não encontrado', async () => {
      mockRepository.finbyId.mockResolvedValue(null);

      await expect(service.uncheckTime('999')).rejects.toThrow('Registro com ID 999 não encontrado.');
    });
  });

  describe('normalização de timezone', () => {
    const makeDto = (date: Date) => ({
      available: false,
      date,
      time: '14:00',
      nameCustumer: 'Maria',
      phoneCustumer: '11977776666'
    });

    it('deve normalizar datas ISO UTC para midnight SP', async () => {
      const dto = makeDto(new Date(baseDate));
      mockRepository.validationData
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(Time.persistence('1', true, baseDate, '14:00', '', ''));
      mockRepository.create.mockResolvedValue(Time.persistence('2', false, baseDate, '14:00', 'Maria', '11977776666'));

      const result = await service.marchTime(dto);

      expect(result?.toObject().date).toBe(baseDateStr);
    });

    it('deve normalizar datas com offset -03:00 para midnight SP', async () => {
      const dto = makeDto(new Date(`${baseDateStr}T00:00:00-03:00`));
      mockRepository.validationData
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(Time.persistence('1', true, baseDate, '14:00', '', ''));
      mockRepository.create.mockResolvedValue(Time.persistence('2', false, baseDate, '14:00', 'Maria', '11977776666'));

      const result = await service.marchTime(dto);

      expect(result?.toObject().date).toBe(baseDateStr);
    });
  });
});