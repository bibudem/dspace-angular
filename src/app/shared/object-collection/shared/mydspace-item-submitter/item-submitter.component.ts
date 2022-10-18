import { Component, Input, OnInit } from '@angular/core';

<<<<<<< HEAD
import { EMPTY, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotEmpty } from '../../../empty.util';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { followLink } from '../../../utils/follow-link-config.model';
=======
import { Observable } from 'rxjs';
import { filter, find, map, mergeMap } from 'rxjs/operators';

import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotEmpty, isNotUndefined } from '../../../empty.util';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
>>>>>>> version-7.3/udem-7.3

/**
 * This component represents a badge with submitter information.
 */
@Component({
  selector: 'ds-item-submitter',
  styleUrls: ['./item-submitter.component.scss'],
  templateUrl: './item-submitter.component.html'
})
export class ItemSubmitterComponent implements OnInit {

  /**
   * The target object
   */
  @Input() object: any;

  /**
<<<<<<< HEAD
   * The submitter object
   */
  submitter$: Observable<EPerson>;

  public constructor(protected linkService: LinkService) {

  }

=======
   * The Eperson object
   */
  submitter$: Observable<EPerson>;

>>>>>>> version-7.3/udem-7.3
  /**
   * Initialize submitter object
   */
  ngOnInit() {
<<<<<<< HEAD
    this.linkService.resolveLinks(this.object, followLink('workflowitem', {},
      followLink('submitter',{})
    ));
    this.submitter$ = (this.object.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((rd: RemoteData<WorkflowItem>) => {
        if (rd.hasSucceeded && isNotEmpty(rd.payload)) {
          return (rd.payload.submitter as Observable<RemoteData<EPerson>>).pipe(
            getFirstCompletedRemoteData(),
            map((rds: RemoteData<EPerson>) => {
              if (rds.hasSucceeded && isNotEmpty(rds.payload)) {
                return rds.payload;
              } else {
                return null;
              }
            })
          );
        } else {
          return EMPTY;
        }
      }));
=======
    this.submitter$ = (this.object.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      filter((rd: RemoteData<WorkflowItem>) => (rd.hasSucceeded && isNotUndefined(rd.payload))),
      mergeMap((rd: RemoteData<WorkflowItem>) => rd.payload.submitter as Observable<RemoteData<EPerson>>),
      find((rd: RemoteData<EPerson>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      map((rd: RemoteData<EPerson>) => rd.payload));
>>>>>>> version-7.3/udem-7.3
  }
}
