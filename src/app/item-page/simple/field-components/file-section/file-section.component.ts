import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { hasValue } from '../../../../shared/empty.util';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';

// add Udem 2022
import * as moment from 'moment';


/**
 * This component renders the file section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */
@Component({
  selector: 'ds-item-page-file-section',
  templateUrl: './file-section.component.html'
})
export class FileSectionComponent implements OnInit {

  @Input() item: Item;

  label = 'item.page.files';

  separator = '<br/>';

  bitstreams$: BehaviorSubject<Bitstream[]>;

  currentPage: number;

  isLoading: boolean;

  isLastPage: boolean;

  pageSize = 5;


  // avril 2022: add UdeM
  embargo: string[] = [
    'UdeM.EmbargoLift'
  ];

  afficherBoutonResult = false;

  urlDemandeCopie = '';

  dateEmbargoAfficher = '';

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.getNextPage();
    //console.log(this.item);
    //console.log(this.item.allMetadata(['thumbnail']));
    // add UdeM 2022
    if (this.item.allMetadata(this.embargo).entries()) {
       this.afficherBoutonResult = this.afficherBouton(this.item.allMetadata(this.embargo)[0].value);
       // exemple de date: 2023-05-12T04:00:00Z
       this.dateEmbargoAfficher = this.item.allMetadata(this.embargo)[0].value.split('T')[0];
    }
    this.urlDemandeCopie = '/items/' + this.item.id + '/request-a-copy';
     // console.log(this.item);

  }

  /**
   * This method will retrieve the next page of Bitstreams from the external BitstreamDataService call.
   * It'll retrieve the currentPage from the class variables and it'll add the next page of bitstreams with the
   * already existing one.
   * If the currentPage variable is undefined, we'll set it to 1 and retrieve the first page of Bitstreams
   */
  getNextPage(): void {
    this.isLoading = true;
    if (this.currentPage === undefined) {
      this.currentPage = 1;
      this.bitstreams$ = new BehaviorSubject([]);
    } else {
      this.currentPage++;
    }
    this.bitstreamDataService.findAllByItemAndBundleName(this.item, 'ORIGINAL', {
      currentPage: this.currentPage,
      elementsPerPage: this.pageSize
    }).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
      if (bitstreamsRD.errorMessage) {
        this.notificationsService.error(this.translateService.get('file-section.error.header'), `${bitstreamsRD.statusCode} ${bitstreamsRD.errorMessage}`);
      } else if (hasValue(bitstreamsRD.payload)) {
        const current: Bitstream[] = this.bitstreams$.getValue();
        this.bitstreams$.next([...current, ...bitstreamsRD.payload.page]);
        this.isLoading = false;
        this.isLastPage = this.currentPage === bitstreamsRD.payload.totalPages;
      }
    });
  }

  // add UdeM 2022 : afficher le bouton si l'item est sous embargo
  // On compare la date actuelle avec la date d'embargo definit pour cet item
  afficherBouton(dateCompare): boolean {
    const dateItem = new Date(dateCompare);
    const dateNow = new Date(moment().format('yyyy-MM-DD'));
    let afficher = false;

    if (!(dateCompare === undefined || dateCompare === '')) {
      if (dateNow.toISOString() < dateItem.toISOString()) {
        afficher = true;
      }
    }
    return afficher;
  }
}
