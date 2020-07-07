import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnunciosPage } from './anuncios.page';

describe('AnunciosPage', () => {
  let component: AnunciosPage;
  let fixture: ComponentFixture<AnunciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnunciosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnunciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
