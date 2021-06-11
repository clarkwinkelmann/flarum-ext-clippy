import app from 'flarum/admin/app';
import Select from 'flarum/common/components/Select';
import {extend} from 'flarum/common/extend';
import withAttr from 'flarum/common/utils/withAttr';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import arrayOfStringsToSelectOptions from './arrayOfStringsToSelectOptions';
import {Agent, EventConfiguration} from '../../shims';

const AGENTS = [
    'Clippy',
    'Merlin',
    'Rover',
    'Links',
    'Bonzi',
    'F1',
    'Genie',
    'Genius',
    'Peedy',
    'Rocky',
];

const EVENTS = [
    'page.index',
    'page.search',
    'page.discussion',
    'page.profile',
    'page.tags',
    'page.settings',
    'modal.signup',
    'modal.login',
    'composer.discussion.open',
    'composer.discussion.hide',
    'composer.discussion.submit',
    'composer.reply.open',
    'composer.reply.hide',
    'composer.reply.submit',
    'action.subscription.follow',
    'action.subscription.unfollow',
    'action.subscription.notifications',
    'action.likes.like',
    'action.likes.unlike',
];

app.initializers.add('clarkwinkelmann-clippy', () => {
    let agent: Agent | null = null;

    extend(ExtensionPage.prototype, 'oninit', function (this: ExtensionPage) {
        // @ts-ignore missing type-hints for attrs.id in Flarum
        if (this.attrs.id !== 'clarkwinkelmann-clippy') {
            return;
        }

        // In case we come back to the same page later
        if (agent) {
            agent.hide();
        }

        clippy.BASE_PATH = app.forum.attribute('clippyAgentPath');
        clippy.load(app.data.settings['clippy.agent'] || 'Clippy', a => {
            agent = a;
            agent.show();

            // To redraw the animation choices
            m.redraw();
        });
    });

    app.extensionData
        .for('clarkwinkelmann-clippy')
        .registerSetting({
            type: 'select',
            setting: 'clippy.cdn',
            options: {
                s3: app.translator.trans('clarkwinkelmann-clippy.admin.settings.cdn-options.s3'),
                jsdelivr: app.translator.trans('clarkwinkelmann-clippy.admin.settings.cdn-options.jsdelivr'),
                custom: app.translator.trans('clarkwinkelmann-clippy.admin.settings.cdn-options.custom'),
            },
            default: 's3',
            label: app.translator.trans('clarkwinkelmann-clippy.admin.settings.cdn'),
        })
        .registerSetting(function (this: ExtensionPage) {
            return m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-clippy.admin.settings.path')),
                m('.helpText', app.translator.trans('clarkwinkelmann-clippy.admin.settings.path-help', {
                    a: m('a', {
                        href: 'https://github.com/smore-inc/clippy.js',
                        target: '_blank',
                        rel: 'noopener',
                    }),
                })),
                m('input.FormControl', {
                    type: 'text',
                    bidi: this.setting('clippy.path'),
                    disabled: this.setting('clippy.cdn')() !== 'custom',
                }),
            ]);
        })
        .registerSetting(function (this: ExtensionPage) {
            return m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-clippy.admin.settings.agent')),
                m('.helpText', app.translator.trans('clarkwinkelmann-clippy.admin.settings.agent-help')),
                Select.component({
                    value: this.setting('clippy.agent', 'Clippy')(),
                    options: arrayOfStringsToSelectOptions(AGENTS),
                    onchange: (value: string) => {
                        this.setting('clippy.agent')(value);

                        if (agent) {
                            agent.hide();
                            agent = null;
                        }

                        clippy.load(value, a => {
                            agent = a;
                            agent.show();

                            const validAnimations = agent.animations();

                            try {
                                const events = JSON.parse(this.setting('clippy.events')());

                                if (typeof events === 'object') {
                                    EVENTS.forEach(eventName => {
                                        if (
                                            events[eventName] &&
                                            events[eventName].animation &&
                                            validAnimations.indexOf(events[eventName].animation) === -1
                                        ) {
                                            if (events[eventName].text) {
                                                delete events[eventName].animation;
                                            } else {
                                                delete events[eventName];
                                            }
                                        }
                                    });

                                    this.setting('clippy.events')(JSON.stringify(events));
                                }
                            } catch (e) {
                                // do nothing, the settings are probably not set
                            }

                            // To redraw the animation choices
                            m.redraw();
                        });
                    },
                }),
            ]);
        })
        .registerSetting(function (this: ExtensionPage) {
            const settingsKey = 'clippy.events';
            let events: EventConfiguration = {};

            try {
                events = JSON.parse(this.setting(settingsKey)());
            } catch (e) {
                // do nothing, we'll reset to something usable
            }

            if (typeof events !== 'object') {
                events = {};
            }

            return m('.Form-group', m.fragment({
                // Force a redraw of all the Select components otherwise there are issues with aligning options
                key: this.setting('clippy.agent')() + (agent ? 'Loaded' : 'Loading'),
            }, [
                m('label', app.translator.trans('clarkwinkelmann-clippy.admin.settings.events')),
                m('.helpText', app.translator.trans('clarkwinkelmann-clippy.admin.settings.events-help')),
                m('table', [
                    m('thead', m('tr', [
                        m('th', app.translator.trans('clarkwinkelmann-clippy.admin.events.name')),
                        m('th', app.translator.trans('clarkwinkelmann-clippy.admin.events.animation')),
                        m('th', app.translator.trans('clarkwinkelmann-clippy.admin.events.text')),
                    ])),
                    m('tbody', EVENTS.map(eventName => m('tr', [
                        m('td', m('pre', eventName)),
                        m('td', Select.component({
                            value: (events[eventName] && events[eventName].animation) || 'none',
                            options: arrayOfStringsToSelectOptions(agent ? agent.animations() : [], {
                                none: '---',
                            }),
                            onchange: (value: string) => {
                                if (value === 'none') {
                                    // If there's a text, we delete just the animation
                                    // If there's neither text nor animation, we remove the whole event from the list
                                    if (events[eventName].text) {
                                        delete events[eventName].animation;
                                    } else {
                                        delete events[eventName];
                                    }
                                } else {
                                    if (agent) {
                                        agent.stop();
                                        agent.play(value);
                                    }

                                    events[eventName] = events[eventName] || {};
                                    events[eventName].animation = value;
                                }

                                this.setting(settingsKey)(JSON.stringify(events));
                            },
                        })),
                        m('td', m('input.FormControl', {
                            type: 'text',
                            value: (events[eventName] && events[eventName].text) || '',
                            onchange: withAttr('value', (value: string) => {
                                if (value) {
                                    if (agent) {
                                        //agent.stop();
                                        console.log('speak', agent, value);
                                        agent.speak(value);
                                    }

                                    events[eventName] = events[eventName] || {};
                                    events[eventName].text = value;
                                } else {
                                    if (events[eventName].animation) {
                                        delete events[eventName].text;
                                    } else {
                                        delete events[eventName];
                                    }
                                }

                                this.setting(settingsKey)(JSON.stringify(events));
                            }),
                        })),
                    ]))),
                ]),
            ]));
        });
});
