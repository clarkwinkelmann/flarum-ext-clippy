import app from 'flarum/app';
import Select from 'flarum/common/components/Select';

/* global m */

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

const ANIMATIONS = [
    'Congratulate',
    'LookRight',
    'SendMail',
    'Thinking',
    'Explain',
    'IdleRopePile',
    'IdleAtom',
    'Print',
    'Hide',
    'GetAttention',
    'Save',
    'GetTechy',
    'GestureUp',
    'Idle1_1',
    'Processing',
    'Alert',
    'LookUpRight',
    'IdleSideToSide',
    'GoodBye',
    'LookLeft',
    'IdleHeadScratch',
    'LookUpLeft',
    'CheckingSomething',
    'Hearing_1',
    'GetWizardy',
    'IdleFingerTap',
    'GestureLeft',
    'Wave',
    'GestureRight',
    'Writing',
    'IdleSnooze',
    'LookDownRight',
    'GetArtsy',
    'Show',
    'LookDown',
    'Searching',
    'EmptyTrash',
    'Greeting',
    'LookUp',
    'GestureDown',
    'RestPose',
    'IdleEyeBrowRaise',
    'LookDownLeft'
];

// For use in Flarum's Select
const ANIMATION_OPTIONS = {
    none: '---',
};
ANIMATIONS.forEach(animation => {
    ANIMATION_OPTIONS[animation] = animation;
});

app.initializers.add('clarkwinkelmann-clippy', () => {
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
        .registerSetting(function () {
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
        .registerSetting(function () {
            const settingsKey = 'clippy.events';
            let events;

            try {
                events = JSON.parse(this.setting(settingsKey)());
            } catch (e) {
                // do nothing, we'll reset to something usable
            }

            if (typeof events !== 'object') {
                events = {};
            }

            return m('table', [
                m('thead', m('tr', [
                    m('th', app.translator.trans('clarkwinkelmann-clippy.admin.events.name')),
                    m('th', app.translator.trans('clarkwinkelmann-clippy.admin.events.animation')),
                    m('th', app.translator.trans('clarkwinkelmann-clippy.admin.events.text')),
                ])),
                m('tbody', EVENTS.map(eventName => m('tr', [
                    m('td', m('pre', eventName)),
                    m('td', Select.component({
                        value: (events[eventName] && events[eventName].animation) || 'none',
                        options: ANIMATION_OPTIONS,
                        onchange: value => {
                            if (value === 'none') {
                                delete events[eventName].animation;

                                if (!events[eventName].text) {
                                    delete events[eventName];
                                }
                            } else {
                                events[eventName] = events[eventName] || {};
                                events[eventName].animation = value;
                            }

                            this.setting(settingsKey)(JSON.stringify(events));
                        },
                    })),
                    m('td', m('input.FormControl', {
                        type: 'text',
                        value: (events[eventName] && events[eventName].text) || '',
                        onchange: event => {
                            const {value} = event.target;

                            if (value) {
                                events[eventName] = events[eventName] || {};
                                events[eventName].text = value;
                            } else {
                                delete events[eventName].text;

                                if (!events[eventName].animation) {
                                    delete events[eventName];
                                }
                            }

                            this.setting(settingsKey)(JSON.stringify(events));
                        },
                    })),
                ]))),
            ]);
        });
});
