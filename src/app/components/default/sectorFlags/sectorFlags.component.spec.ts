/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SectorFlagsComponent } from './sectorFlags.component';

describe('SectorFlagsComponent', () => {
  let component: SectorFlagsComponent;
  let fixture: ComponentFixture<SectorFlagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorFlagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
