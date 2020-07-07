import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TiposEstabelecimentosPage } from './tipos-estabelecimentos.page';

describe('TiposEstabelecimentosPage', () => {
  let component: TiposEstabelecimentosPage;
  let fixture: ComponentFixture<TiposEstabelecimentosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposEstabelecimentosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TiposEstabelecimentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
