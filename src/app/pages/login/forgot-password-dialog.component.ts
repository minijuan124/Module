import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="soft-card dialog-card">
      <div class="comfort-header">
        <h2 class="comfort-title">¿Olvidaste tu contraseña?</h2>
        <p class="gentle-subtitle">
          Por favor comunícate con el administrador:
        </p>
      </div>

      <div class="soft-field">
        <div class="field-container">
          <input
            class="email-input"
            readonly
            [value]="data.email"
            aria-label="Correo administrador"
          />
          <div class="field-accent"></div>
        </div>
      </div>

      <div
        class="dialog-actions"
        style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;"
      >
        <div style="display:flex;align-items:center;gap:12px;">
          <button
            type="button"
            class="comfort-button small"
            (click)="copy()"
            aria-label="Copiar correo"
          >
            <div class="button-background"></div>
            <span class="button-text"
              ><mat-icon class="copy-icon">content_copy</mat-icon> Copiar</span
            >
          </button>
          <span *ngIf="copied" class="copied"
            >Correo copiado al portapapeles</span
          >
        </div>
        <button type="button" class="info-close" (click)="close()">
          Cerrar
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      .dialog-card {
        width: 100%;
        padding: 20px 22px;
        box-sizing: border-box;
      }
      .email-input {
        width: 100%;
        max-width: 100%;
        background: transparent;
        border: none;
        padding: 12px 16px;
        font-size: 14px;
        color: #1b2b3a;
        border-radius: 8px;
      }
      .email-input:focus {
        outline: none;
        box-shadow: none;
      }
      .field-container {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        padding: 6px;
        border: 1.2px solid rgba(240, 206, 170, 0.28);
      }
      .field-container input {
        border: none;
      }
      .comfort-title {
        margin: 0;
        font-size: 18px;
        color: #37799d;
      }
      .gentle-subtitle {
        margin: 6px 0 0 0;
        color: rgba(30, 40, 50, 0.75);
      }
      .copied {
        color: green;
      }

      /* small variant of the comfort button to match login's primary button */
      .comfort-button.small {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 36px;
        min-width: 120px;
        padding: 6px 12px;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        background: transparent;
        border: none;
        box-sizing: border-box;
      }
      .comfort-button.small .button-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, #0c76c8 0%, #2aa0ff 100%);
        border-radius: 8px;
        transition: all 0.25s ease;
      }
      .comfort-button.small .button-text {
        position: relative;
        z-index: 2;
        color: #fff;
        font-weight: 700;
        display: inline-flex;
        gap: 8px;
        align-items: center;
      }
      .comfort-button.small:hover .button-background {
        filter: brightness(1.02) saturate(1.05);
        box-shadow: 0 10px 20px rgba(12, 118, 200, 0.12);
      }
      .copy-icon {
        font-size: 18px;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        vertical-align: middle;
      }
      .info-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 36px;
        min-width: 120px;
        padding: 6px 12px;
        box-sizing: border-box;
        border-radius: 8px;
        background: transparent;
        border: 2px solid rgba(183, 146, 57, 0.6);
        color: #bd9000;
        cursor: pointer;
        font-weight: 700;
      }
      .info-close:hover {
        background: rgba(183, 146, 57, 0.08);
      }
    `,
  ],
})
export class ForgotPasswordDialogComponent {
  copied = false;

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {}

  close() {
    this.dialogRef.close();
  }

  async copy() {
    const text = this.data?.email ?? '';
    try {
      if (navigator && typeof navigator.clipboard?.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      this.copied = true;
      setTimeout(() => (this.copied = false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
      this.copied = false;
    }
  }
}
