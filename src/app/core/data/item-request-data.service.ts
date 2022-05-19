import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, find, map } from 'rxjs/operators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData, sendRequest } from '../shared/operators';
import { RemoteData } from './remote-data';
import { PostRequest, PutRequest } from './request.models';
import { RequestService } from './request.service';
import { ItemRequest } from '../shared/item-request.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { DataService } from './data.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { RequestCopyEmail } from '../../request-copy/email-request-copy/request-copy-email.model';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';

/**
 * A service responsible for fetching/sending data from/to the REST API on the itemrequests endpoint
 */
@Injectable(
  {
    providedIn: 'root',
  }
)
export class ItemRequestDataService extends DataService<ItemRequest> {

  protected linkPath = 'itemrequests';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ItemRequest>,
  ) {
    super();
  }

  getItemRequestEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

  /**
   * Get the endpoint for an {@link ItemRequest} by their token
   * @param token
   */
  getItemRequestEndpointByToken(token: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}/${token}`));
  }

  /**
   * Request a copy of an item
   * @param itemRequest
   */
  requestACopy(itemRequest: ItemRequest): Observable<RemoteData<ItemRequest>> {
    const requestId = this.requestService.generateRequestId();

    const href$ = this.getItemRequestEndpoint();

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, itemRequest);
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID<ItemRequest>(requestId).pipe(
      getFirstCompletedRemoteData()
    );
  }

  /**
   * Deny the request of an item
   * @param token Token of the {@link ItemRequest}
   * @param email Email to send back to the user requesting the item
   */
  deny(token: string, email: RequestCopyEmail): Observable<RemoteData<ItemRequest>> {
    return this.process(token, email, false);
  }

  /**
   * Grant the request of an item
   * @param token Token of the {@link ItemRequest}
   * @param email Email to send back to the user requesting the item
   * @param suggestOpenAccess Whether or not to suggest the item to become open access
   */
  grant(token: string, email: RequestCopyEmail, suggestOpenAccess = false): Observable<RemoteData<ItemRequest>> {
    return this.process(token, email, true, suggestOpenAccess);
  }

  /**
   * Process the request of an item
   * @param token Token of the {@link ItemRequest}
   * @param email Email to send back to the user requesting the item
   * @param grant Grant or deny the request (true = grant, false = deny)
   * @param suggestOpenAccess Whether or not to suggest the item to become open access
   */
  process(token: string, email: RequestCopyEmail, grant: boolean, suggestOpenAccess = false): Observable<RemoteData<ItemRequest>> {
    const requestId = this.requestService.generateRequestId();

    this.getItemRequestEndpointByToken(token).pipe(
      distinctUntilChanged(),
      map((endpointURL: string) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        // headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Content-Type','application/json; charset=UTF-8');
        options.headers = headers;
        return new PutRequest(requestId, endpointURL, JSON.stringify({
          acceptRequest: grant,
          responseMessage: email.message,
          subject: email.subject,
          suggestOpenAccess,
        }), options);
      }),
      sendRequest(this.requestService)).subscribe();

    return this.rdbService.buildFromRequestUUID(requestId);
  }

}
