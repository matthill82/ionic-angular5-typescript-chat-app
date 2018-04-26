import { Injectable } from '@angular/core';

interface User {
  id?: string;
  displayName?: string;
  bgColour?: string;
}

@Injectable()
export class DataService {
  userData: User;
  imageData: string
}
