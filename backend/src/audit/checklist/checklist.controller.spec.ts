import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';

describe('ChecklistController', () => {
  let controller: ChecklistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklistController],
      providers: [
        {
          provide: ChecklistService,
          useValue: {
            getCategories: jest.fn(),
            syncStructure: jest.fn(),
            getInspections: jest.fn(),
            saveInspection: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChecklistController>(ChecklistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
