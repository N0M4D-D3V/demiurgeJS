export interface LayoutPartConfig {
  selector: string;
  url: string;
}

export interface PageLayoutConfig {
  header?: LayoutPartConfig;
  footer?: LayoutPartConfig;
  navSelector?: string;
}

export interface PageConfigEntry {
  scripts?: string[];
  init?: string | null;
  teardown?: string | null;
}

export interface DemiurgePageConfig {
  layout?: PageLayoutConfig;
  sharedScripts?: string[];
  pages?: Record<string, PageConfigEntry>;
}

export interface PseudoSPATransitionOptions {
  enabled?: boolean;
  duration?: number;
  leaveClass?: string;
  leaveActiveClass?: string;
  enterClass?: string;
  enterActiveClass?: string;
}

export interface PseudoSPAOptions {
  contentSelector?: string;
  linkSelector?: string;
  shouldHandleLink?: (link: HTMLAnchorElement, event: MouseEvent) => boolean;
  getTitle?: (doc: Document) => string;
  onBeforeNavigate?: (url: string) => void | Promise<void>;
  onAfterNavigate?: (url: string, newDoc: Document) => void | Promise<void>;
  transition?: PseudoSPATransitionOptions;
}

export declare class PseudoSPA {
  constructor(options?: PseudoSPAOptions);
  options: PseudoSPAOptions;
  isNavigating: boolean;
  currentUrl: string;
  init(): void;
  destroy(): void;
  navigate(url: string, opts?: { push?: boolean }): void;
  loadDocument(url: string): Promise<Document | null>;
  swapContent(newDoc: Document, url: string, push: boolean): void;
}

export declare function defaultShouldHandleLink(
  link: HTMLAnchorElement,
  event: MouseEvent
): boolean;

export declare function injectPartial(
  selector: string,
  url: string
): Promise<Element | null>;
export declare function markActiveNavLink(
  root?: ParentNode,
  selector?: string
): void;

export declare const Layout: {
  injectPartial: typeof injectPartial;
  markActiveNavLink: typeof markActiveNavLink;
};

export declare function loadScript(
  src: string,
  options?: { trackForCleanup?: boolean }
): Promise<void>;
export declare function resolveFunction(path: string | null | undefined): Function | null;
export declare function loadForPage(pageId: string): Promise<void>;
export declare function resetScriptLoaderState(): void;

export declare const PageScriptLoader: {
  loadForPage: typeof loadForPage;
  loadScript: typeof loadScript;
  resolveFunction: typeof resolveFunction;
  resetScriptLoaderState: typeof resetScriptLoaderState;
};

export declare class Modal {
  static instances: Map<Element, Modal>;
  static getOrCreate(root: Element | null): Modal | null;
  constructor(root: Element);
  root: Element;
  previouslyFocused: Element | null;
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
}

export declare function initModalDelegation(root?: Document | Element): void;

export interface BootstrapOptions {
  config?: DemiurgePageConfig;
  layout?: typeof Layout;
  scriptLoader?: typeof PageScriptLoader;
  PseudoSPAClass?: typeof PseudoSPA;
  enableModalDelegation?: boolean;
  logBanner?: boolean;
  routerOptions?: Partial<PseudoSPAOptions>;
}

export declare function bootstrapDemiurge(
  options?: BootstrapOptions
): Promise<PseudoSPA>;

export declare const ASCII_BANNER: string;
