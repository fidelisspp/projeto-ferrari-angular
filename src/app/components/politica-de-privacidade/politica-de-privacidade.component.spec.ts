import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaDePrivacidadeComponent } from './politica-de-privacidade.component';

describe('PoliticaDePrivacidadeComponent', () => {
  let component: PoliticaDePrivacidadeComponent;
  let fixture: ComponentFixture<PoliticaDePrivacidadeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoliticaDePrivacidadeComponent]
    });
    fixture = TestBed.createComponent(PoliticaDePrivacidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
