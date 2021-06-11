import Mithril from 'mithril';

interface Agent {
    play(animation: string): void

    animate(): void

    animations(): string[]

    speak(text: string): void

    moveTo(x: number, y: number): void

    gestureAt(x: number, y: number): void

    stopCurrent(): void

    stop(): void

    show(): void

    hide(): void
}

interface Clippy {
    BASE_PATH: string

    load(agent: string, callback: (agent: Agent) => void): void
}

declare global {
    const m: Mithril.Static;
    const flarum: any;
    const clippy: Clippy;
}

declare module 'flarum/common/components/Page' {
    export default interface Page {
        skipSkippyEvent?: boolean
    }
}

declare module 'flarum/forum/states/ComposerState' {
    export default interface ComposerState {
        nextHideIsSubmit?: boolean
    }
}

interface EventConfiguration {
    [event: string]: {
        text?: string
        animation?: string
    }
}
