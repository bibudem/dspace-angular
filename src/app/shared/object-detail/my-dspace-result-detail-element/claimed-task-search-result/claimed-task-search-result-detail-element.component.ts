<<<<<<< HEAD
import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
=======
import { Component } from '@angular/core';

import { Observable } from 'rxjs';
>>>>>>> version-7.3/udem-7.3

import { RemoteData } from '../../../../core/data/remote-data';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { SearchResultDetailElementComponent } from '../search-result-detail-element.component';
<<<<<<< HEAD
import {
  MyDspaceItemStatusType
} from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
=======
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
>>>>>>> version-7.3/udem-7.3
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ClaimedTaskSearchResult } from '../../../object-collection/shared/claimed-task-search-result.model';
import { followLink } from '../../../utils/follow-link-config.model';
import { LinkService } from '../../../../core/cache/builders/link.service';
<<<<<<< HEAD
import { Item } from '../../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { isNotEmpty } from '../../../empty.util';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
=======
>>>>>>> version-7.3/udem-7.3

/**
 * This component renders claimed task object for the search result in the detail view.
 */
@Component({
  selector: 'ds-claimed-task-search-result-detail-element',
  styleUrls: ['../search-result-detail-element.component.scss'],
  templateUrl: './claimed-task-search-result-detail-element.component.html'
})

@listableObjectComponent(ClaimedTaskSearchResult, ViewMode.DetailedListElement)
<<<<<<< HEAD
export class ClaimedTaskSearchResultDetailElementComponent extends SearchResultDetailElementComponent<ClaimedTaskSearchResult, ClaimedTask> implements OnInit, OnDestroy  {

  /**
   * The item object that belonging to the result object
   */
  public item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);
=======
export class ClaimedTaskSearchResultDetailElementComponent extends SearchResultDetailElementComponent<ClaimedTaskSearchResult, ClaimedTask> {
>>>>>>> version-7.3/udem-7.3

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.VALIDATION;

  /**
   * The workflowitem object that belonging to the result object
   */
<<<<<<< HEAD
  public workflowitem$: BehaviorSubject<WorkflowItem> = new BehaviorSubject<WorkflowItem>(null);

  constructor(protected linkService: LinkService, protected objectCache: ObjectCacheService) {
=======
  public workflowitemRD$: Observable<RemoteData<WorkflowItem>>;

  constructor(protected linkService: LinkService) {
>>>>>>> version-7.3/udem-7.3
    super();
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.linkService.resolveLinks(this.dso, followLink('workflowitem', {},
      followLink('item', {}, followLink('bundles')),
      followLink('submitter')
    ), followLink('action'));
<<<<<<< HEAD

    (this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((wfiRD: RemoteData<WorkflowItem>) => {
        if (wfiRD.hasSucceeded) {
          this.workflowitem$.next(wfiRD.payload);
          return (wfiRD.payload.item as Observable<RemoteData<Item>>).pipe(
            getFirstCompletedRemoteData()
          );
        } else {
          return EMPTY;
        }
      }),
      tap((itemRD: RemoteData<Item>) => {
        if (isNotEmpty(itemRD) && itemRD.hasSucceeded) {
          this.item$.next(itemRD.payload);
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    // This ensures the object is removed from cache, when action is performed on task
    this.objectCache.remove(this.dso._links.workflowitem.href);
=======
    this.workflowitemRD$ = this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>;
>>>>>>> version-7.3/udem-7.3
  }

}
