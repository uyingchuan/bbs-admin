import { TemplateRef } from '@angular/core';
import { SafeAny } from '@interfaces/global';

/**
 * Defines valid templates in OverlayPanel.
 * @group Templates
 */
export interface OverlayPanelTemplates {
  /**
   * Custom template of content.
   */
  content(): TemplateRef<SafeAny>;

  /**
   * Custom template of closeicon.
   */
  closeicon(): TemplateRef<SafeAny>;
}
