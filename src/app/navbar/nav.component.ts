import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isSidebarOpen: boolean = false;
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  menuItems = ['dashboard', 'Connect', 'Report', 'Settings'];

  toggleSidenav() {
    // Toggle the sidebar visibility here
    // For example, you can use a boolean variable to track the sidebar's open/closed state
    // This is just a placeholder example
    // Replace 'isSidebarOpen' with your actual variable name
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
