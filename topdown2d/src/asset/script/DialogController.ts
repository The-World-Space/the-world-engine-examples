import { Component, Coroutine, CoroutineIterator, CssHtmlElementRenderer, WaitUntil } from "the-world-engine";
import { MathUtils } from "three/src/Three"; 

export class DialogController extends Component {
    public override readonly disallowMultipleComponent = true;
    public override readonly requiredComponents = [CssHtmlElementRenderer];

    private _dialogUi: CssHtmlElementRenderer|null = null;
    private _transitionCoroutine: Coroutine|null = null;
    private _textAnimationCoroutine: Coroutine|null = null;
    private _isShowing = false;
    private readonly _maxWidth = 10;

    private _initializeFunction: (() => void)|null = null;

    private readonly onScreenResize = (): void => {
        if (this._dialogUi) {
            const screen = this.engine.screen;
            const aspectRatio = screen.width / screen.height;
            this.startCoroutine(this.getViewSize((viewSize: number) => {
                const viewSize2 = viewSize * 2;
                this._dialogUi!.elementWidth = Math.min(this._maxWidth, viewSize2 * aspectRatio - 1);
            }));
        }
    };

    public awake(): void {
        this._dialogUi = this.gameObject.getComponent(CssHtmlElementRenderer)!;
        this._dialogUi.htmlElementEventHandler!.onmousedown = (): void => {
            this.hideUi();
        };
        this.onScreenResize();

        this._initializeFunction?.();
    }

    public onEnable(): void {
        this.engine.screen.onResize.addListener(this.onScreenResize);
    }

    public onDisable(): void {
        this.engine.screen.onResize.removeListener(this.onScreenResize);
    }

    public showMessage(message: string): void {
        if (!this._dialogUi) {
            this._initializeFunction = (): void => this.showMessage(message);
            return;
        }

        this.showUi();
        if (this._textAnimationCoroutine) this.stopCoroutine(this._textAnimationCoroutine);
        this._textAnimationCoroutine = this.startCoroutine(this.showTextAnimation(message, 0.7));
    }

    private *showTextAnimation(text: string, duration: number): CoroutineIterator {
        let currentTime = 0;
        while (currentTime < duration) {
            this._dialogUi!.element!.firstChild!.textContent = text.substring(0, Math.floor(currentTime / duration * text.length));
            yield null;
            currentTime += this.engine.time.deltaTime;
        }
        this._dialogUi!.element!.firstChild!.textContent = text;
    }

    private showUi(): void {
        if (this._isShowing) return;
        this._isShowing = true;

        if (this._transitionCoroutine) this.stopCoroutine(this._transitionCoroutine);
        
        this.startCoroutine(this.getViewSize((viewSize: number) => {
            this._transitionCoroutine = this.startCoroutine(this.moveUiAnim(-viewSize + 1.5));
        }));
    }

    private hideUi(): void {
        if (!this._isShowing) return;
        this._isShowing = false;

        if (this._transitionCoroutine) this.stopCoroutine(this._transitionCoroutine);

        this.startCoroutine(this.getViewSize((viewSize: number) => {
            this._transitionCoroutine = this.startCoroutine(this.moveUiAnim(-viewSize - 1.5));
        }));
    }

    private *getViewSize(callback: (viewSize: number) => void): CoroutineIterator {
        yield new WaitUntil(() => this.engine.cameraContainer.camera !== null);
        callback(this.engine.cameraContainer.camera!.viewSize);
    }

    private *moveUiAnim(targetY: number): CoroutineIterator {
        let currentTime = 0;
        while (currentTime < 1) {
            this.transform.localPosition.y = MathUtils.damp(this.transform.localPosition.y, targetY, 4, currentTime);
            yield null;
            currentTime += this.engine.time.deltaTime;
        }
        this.transform.localPosition.y = targetY;
    }
}
