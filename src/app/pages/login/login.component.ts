import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  passwordVisible = false;
  loading = false;
  showSuccess = false;
  loginError = '';
  activeTab: string = 'all';
  // keep a reference to the last clicked tab element so we can scroll it into view
  private lastActiveButton?: HTMLElement;



  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  // Log only the current values to avoid dumping the full FormGroup internals to the terminal
  console.log('[LoginComponent] constructor: form initialized, value=', this.form.value);
  }
  @ViewChild('tabsWrapper') tabsWrapper!: ElementRef;

  ngAfterViewInit(): void {
    // After view init, ensure the active tab ('all' by default) is visible
    setTimeout(() => this.scrollActiveIntoView(), 50);
  }

  selectTab(tab: string, event?: Event) {
    this.activeTab = tab;
    // if an event or target is provided, try to store the button and scroll it into view
    const target = (event?.currentTarget || (event as any)?.target) as HTMLElement | undefined;
    if (target && target instanceof HTMLElement) {
      this.lastActiveButton = target;
      this.scrollElementIntoWrapper(target);
    } else {
      // fallback: find the active button inside the wrapper
      this.scrollActiveIntoView();
    }
  }

  private scrollActiveIntoView() {
    try {
      const wrapper = this.tabsWrapper?.nativeElement as HTMLElement | undefined;
      if (!wrapper) { return; }
      const activeBtn = wrapper.querySelector('button.active') as HTMLElement | null;
      if (activeBtn) {
        this.scrollElementIntoWrapper(activeBtn);
      }
    } catch (e) {
      // noop
      console.warn('scrollActiveIntoView failed', e);
    }
  }

  private scrollElementIntoWrapper(el: HTMLElement) {
    const wrapper = this.tabsWrapper?.nativeElement as HTMLElement | undefined;
    if (!wrapper || !el) { return; }
    // compute offsets to center the element in the wrapper when possible
    const wrapperRect = wrapper.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    // current scrollLeft + element left edge relative to wrapper
    const offsetLeft = elRect.left - wrapperRect.left + wrapper.scrollLeft;
    const targetScroll = Math.max(0, offsetLeft - (wrapper.clientWidth - elRect.width) / 2);
    wrapper.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }

scrollTabs(direction: 'left' | 'right') {
  const wrapper = this.tabsWrapper.nativeElement;
  if (!wrapper) { return; }
  // Scroll by a percentage of the visible wrapper width so we reliably move across items
  const scrollAmount = Math.round(wrapper.clientWidth * 0.8);
  const delta = direction === 'left' ? -scrollAmount : scrollAmount;
  wrapper.scrollBy({ left: delta, behavior: 'smooth' });
}


  onSubmit() {
    console.log('[LoginComponent] onSubmit called');
    if (this.form.valid) {
      console.log('[LoginComponent] form valid, values:', this.form.value);
      const { username, password } = this.form.value;
      this.setLoading(true);
      this.loginError = '';

      // call the AuthService (simulated async)
      this.auth.login(username, password).then(ok => {
        console.log('[LoginComponent] auth.login resolved ->', ok);
        this.setLoading(false);
        if (ok) {
          this.showGentleSuccess();
        } else {
          // Avoid showing specific credentials or lengthy error text in the UI;
          // keep the error state internal and just clear the password for retry.
          this.loginError = '';
          // clear password field for user to retry
          this.form.patchValue({ password: '' });
          this.password?.markAsTouched();
        }
      });
    } else {
      console.log('[LoginComponent] form invalid', this.form.errors, this.form.value);
      this.form.markAllAsTouched();
    }
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
  
  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
  
  socialLogin(provider: string, event: Event) {
    event?.preventDefault();
    console.log(`Signing in with ${provider}...`);
    const btn = (event.currentTarget as HTMLElement);
    if (!btn) { return; }
    // gentle loading state on the clicked button
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.style.pointerEvents = 'auto';
      btn.style.opacity = '1';
      // Here you would trigger actual social auth flow
      console.log(`${provider} flow complete (demo)`);
    }, 2000);
  }
  
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  
  showGentleSuccess() {
    // Directly navigate to dashboard without triggering the in-card success animation
    this.router.navigate(['/dashboard']);
  }
  allPages = [
  { url: '../../../assets/bienvenida.png'},
  { url: '../../../assets/que-es.png', section: 'que-es' },
  { url: '../../../assets/gerencial1.png', section: 'gerencial' },
  { url: '../../../assets/gerencial2.png', section: 'gerencial' },
  { url: '../../../assets/operativa1.png', section: 'operativa' },
  { url: '../../../assets/operativa2.png', section: 'operativa' },
  { url: '../../../assets/finan1.png', section: 'financiera' },
  { url: '../../../assets/alerta.png', section: 'alertas' },
  { url: '../../../assets/reportead.png', section: 'adhoc' },
  // etc.
];
get filteredPages() {
  if (this.activeTab === 'all') {
    return this.allPages;
  }
  return this.allPages.filter(p => p.section === this.activeTab);
}

}
