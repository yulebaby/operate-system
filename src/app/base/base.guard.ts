import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class BaseGuard implements CanActivate {
  constructor() { }

  canActivate(): boolean | Promise<boolean> {
    
    return true
  }
}