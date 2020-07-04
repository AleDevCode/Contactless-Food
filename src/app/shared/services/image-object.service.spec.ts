import { TestBed } from '@angular/core/testing';

import { ImageObjectService } from './image-object.service';

describe('ImageObjectService', () => {
  let service: ImageObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
