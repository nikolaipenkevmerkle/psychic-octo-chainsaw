import {WebElementPromise} from 'selenium-webdriver';
import {WebComponent, Button, TextInput} from './components';

class WebComponentEnsurer {
    constructor(private component: WebComponent) {
    }

    public async textIs(expected: string) {
        const text = await this.component.getText();

        if (expected.trim() !== text.trim()) {
            throw new Error(`Element ${this.component.elementId} text is '${text}'. Expected value is '${expected}'`);
        }
    }

    public async isVisible() {
        if (!await this.component.isDisplayed()) {
            throw new Error(`Element ${this.component.elementId} is visible`);
        }
    }

    public async isNotVisible() {
        if (await this.component.isDisplayed()) {
            throw new Error(`Element ${this.component.elementId} is visible`);
        }
    }
}

class ButtonEnsurer extends WebComponentEnsurer {
    protected button: Button;

    constructor(button: Button) {
        super(button);
        this.button = button;
    }

    public async isNotDisabled() {
        if (await this.button.isDisabled()) {
            throw new Error(`Button ${this.button.elementId} is disabled`);
        }
    }
}

class TextInputEnsurer extends WebComponentEnsurer {
    constructor(element: TextInput) {
        super(element);
    }
}

export function ensure(component: Button): ButtonEnsurer;
export function ensure(component: TextInput): TextInputEnsurer;
export function ensure(component: WebComponent): WebComponentEnsurer;
export function ensure(component: WebComponent | Button): any {
    if (component instanceof Button) {
        return new ButtonEnsurer(component);
    } else {
        return new WebComponentEnsurer(component);
    }
}