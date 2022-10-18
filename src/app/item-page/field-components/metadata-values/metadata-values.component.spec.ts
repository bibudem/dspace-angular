import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { MetadataValuesComponent } from './metadata-values.component';
import { By } from '@angular/platform-browser';
import { MetadataValue } from '../../../core/shared/metadata.models';
<<<<<<< HEAD
import { APP_CONFIG } from '../../../../config/app-config.interface';
import { environment } from '../../../../environments/environment';
=======
>>>>>>> version-7.3/udem-7.3

let comp: MetadataValuesComponent;
let fixture: ComponentFixture<MetadataValuesComponent>;

const mockMetadata = [
  {
    language: 'en_US',
    value: '1234'
  },
  {
    language: 'en_US',
    value: 'a publisher'
  },
  {
    language: 'en_US',
    value: 'desc'
  }] as MetadataValue[];
const mockSeperator = '<br/>';
const mockLabel = 'fake.message';

describe('MetadataValuesComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
<<<<<<< HEAD
        },
      })],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
      ],
=======
        }
      })],
>>>>>>> version-7.3/udem-7.3
      declarations: [MetadataValuesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MetadataValuesComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(MetadataValuesComponent);
    comp = fixture.componentInstance;
    comp.mdValues = mockMetadata;
    comp.separator = mockSeperator;
    comp.label = mockLabel;
    fixture.detectChanges();
  }));

  it('should display all metadata values', () => {
    const innerHTML = fixture.nativeElement.innerHTML;
    for (const metadatum of mockMetadata) {
      expect(innerHTML).toContain(metadatum.value);
    }
  });

  it('should contain separators equal to the amount of metadata values minus one', () => {
<<<<<<< HEAD
    const separators = fixture.debugElement.queryAll(By.css('span.separator'));
=======
    const separators = fixture.debugElement.queryAll(By.css('span>span'));
>>>>>>> version-7.3/udem-7.3
    expect(separators.length).toBe(mockMetadata.length - 1);
  });

});
