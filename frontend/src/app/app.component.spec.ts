import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {MessagesComponent} from "./messages/messages.component";
import {By} from "@angular/platform-browser";
import {routes} from "./app-routing.module";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {TaskSearchComponent} from "./task-search/task-search.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let h1: HTMLElement;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MessagesComponent,
        TaskSearchComponent,
        DashboardComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        FormsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    h1 = fixture.nativeElement.querySelector('h1');
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'opus'`, () => {
    expect(component.title).toEqual('opus');
  });

  it('should contain "DashboardTasks"', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    expect(bannerElement.textContent).toContain('DashboardTasks');
  });

  it('should display original title', () => {
    fixture.detectChanges();
    expect(h1.textContent).toContain(component.title);
  });

  it('should display a different test title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    expect(h1.textContent).toContain('Test Title');
  });

  it('should navigate correctly', fakeAsync(() => {
    let a = fixture.debugElement.queryAll(By.css('a'));
    a[0].nativeElement.click();
    tick();
    expect(router.url).toBe(`/dashboard`);
    a[1].nativeElement.click();
    tick();
    expect(router.url).toBe('/tasks');
  }));
});
