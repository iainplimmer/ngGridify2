import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class NgGridifyService {

  constructor (private http: Http) {}

  //  Retrieve data from an externally provided service, throw an error if an exception occurs
  GetDataFromService(url: string): Observable<Response> {    
    return this.http.get(url)
      .map(response => response.json())
      .catch(error => {
        return Observable.throw(error)
      });      
  }

  //  Gets a deep-value from an object, by a specified dot separated key (ie. user.firstname)
  DeepValue(obj: Object, key: string) {
    let c = obj;
    key.split('.').forEach((p) => c = (c == undefined) ? '' : c[p]);
    return c;
  }

  //  Provides a sort function on deep value and shallow value array properties
  Sort(dataIn: any[], byProperty:string, ascending:boolean): any {
    if (byProperty != null) {
      dataIn.sort((a: Object, b: Object) => {
        const aProp = this.DeepValue(a, byProperty);
        const bProp = this.DeepValue(b, byProperty);
        
        if (aProp < bProp) {
          return -1;
        } else if (aProp > bProp) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    if (!ascending) {
      dataIn.reverse();
    }

    return dataIn;
  }

  //  We take an array coming in of any type and slice this into pages, if there is no data, the first page 
  //  is called or the data is empty the same value is returned.
  PageData(dataIn: any[], itemsPerPage:number, currentPage:number): any {

    if (!dataIn || dataIn.length == 0 || dataIn.length <= itemsPerPage) {
      return dataIn;
    }
    else if (currentPage == 1) {
      return dataIn.slice(0, itemsPerPage);
    }
    else {      
      const start = itemsPerPage * (currentPage-1);
      return dataIn.slice(start, start+itemsPerPage);
    }
  }
}