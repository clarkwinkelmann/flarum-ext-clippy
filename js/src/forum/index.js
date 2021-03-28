import {extend, override} from 'flarum/common/extend';
import app from 'flarum/app';
import ForumApplication from 'flarum/forum/ForumApplication';
import IndexPage from 'flarum/forum/components/IndexPage';
import UserPage from 'flarum/forum/components/UserPage';
import SettingsPage from 'flarum/forum/components/SettingsPage';
import SignUpModal from 'flarum/forum/components/SignUpModal';
import LogInModal from 'flarum/forum/components/LogInModal';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';
import EditPostComposer from 'flarum/forum/components/EditPostComposer';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import ComposerState from 'flarum/forum/states/ComposerState';
import Discussion from 'flarum/common/models/Discussion';
import Post from 'flarum/common/models/Post';

/* global clippy, flarum */

app.initializers.add('clarkwinkelmann-clippy', () => {
    let agent;
    const eventQueue = [];

    function runEvent(eventName) {
        if (!agent) {
            // Queue for events triggering before the agent is ready
            eventQueue.push(eventName);
            return;
        }

        const definitions = app.forum.attribute('clippyEvents');

        if (!definitions) {
            return;
        }

        const eventDefinition = definitions[eventName];

        // Kept on purpose to know which event triggers when
        console.info('Clippy event: ' + eventName, eventDefinition);

        if (!eventDefinition) {
            return;
        }

        agent.stop();

        if (eventDefinition.text) {
            agent.speak(eventDefinition.text);
        }

        if (eventDefinition.animation) {
            agent.play(eventDefinition.animation);
        }
    }

    extend(ForumApplication.prototype, 'mount', () => {
        clippy.BASE_PATH = app.forum.attribute('clippyAgentPath');
        clippy.load(app.forum.attribute('clippyAgent') || 'Clippy', a => {
            agent = a;
            agent.show();

            eventQueue.forEach(eventName => {
                runEvent(eventName);
            });
        });
    });

    extend(IndexPage.prototype, 'oninit', function () {
        if (app.search.stickyParams().q) {
            runEvent('page.search');
        } else {
            runEvent('page.index');
        }
    });

    extend(DiscussionPage.prototype, 'oninit', function () {
        runEvent('page.discussion');
    });

    extend(UserPage.prototype, 'oninit', function () {
        if (this.skipSkippyEvent) {
            return;
        }

        runEvent('page.profile');
    });

    override(SettingsPage.prototype, 'oninit', function (original, vnode) {
        runEvent('page.settings');

        // Because SettingsPage extends UserPage, we don't want the two events to trigger
        this.skipSkippyEvent = true;

        original(vnode);
    });

    const TagsPage = flarum.core.compat['tags/components/TagsPage'];

    if (TagsPage) {
        extend(TagsPage.prototype, 'oninit', function () {
            runEvent('page.tags');
        });
    }

    extend(SignUpModal.prototype, 'oninit', function () {
        runEvent('modal.signup');
    });

    extend(LogInModal.prototype, 'oninit', function () {
        runEvent('modal.login');
    });

    extend(DiscussionComposer.prototype, 'oninit', function () {
        runEvent('composer.discussion.open');
    });
    extend(DiscussionComposer.prototype, 'onsubmit', function () {
        this.composer.nextHideIsSubmit = true;
    });

    extend(ReplyComposer.prototype, 'oninit', function () {
        runEvent('composer.reply.open');
    });
    extend(ReplyComposer.prototype, 'onsubmit', function () {
        this.composer.nextHideIsSubmit = true;
    });

    extend(EditPostComposer.prototype, 'oninit', function () {
        runEvent('composer.reply.open');
    });
    extend(EditPostComposer.prototype, 'onsubmit', function () {
        this.composer.nextHideIsSubmit = true;
    });

    override(ComposerState.prototype, 'hide', function (original) {
        if (this.nextHideIsSubmit) {
            this.nextHideIsSubmit = false;

            switch (this.body.componentClass) {
                case DiscussionComposer:
                    runEvent('composer.discussion.submit');
                    break;
                case ReplyComposer:
                case EditPostComposer:
                    runEvent('composer.reply.submit');
                    break;
            }
        } else {
            switch (this.body.componentClass) {
                case DiscussionComposer:
                    runEvent('composer.discussion.hide');
                    break;
                case ReplyComposer:
                case EditPostComposer:
                    runEvent('composer.reply.hide');
                    break;
            }
        }

        original();
    });

    extend(Discussion.prototype, 'save', function (returnValue, attributes) {
        if (!attributes || !attributes.hasOwnProperty('subscription')) {
            return;
        }

        // Handles both null and false https://github.com/flarum/subscriptions/pull/37
        if (!attributes.subscription) {
            runEvent('action.subscription.unfollow');
        } else if (attributes.subscription === 'follow') {
            runEvent('action.subscription.follow');
        } else if (attributes.subscription === 'ignore') {
            runEvent('action.subscription.ignore');
        }
    });

    extend(Post.prototype, 'save', function (returnValue, attributes) {
        if (!attributes || !attributes.hasOwnProperty('isLiked')) {
            return;
        }

        if (attributes.isLiked) {
            runEvent('action.likes.like');
        } else {
            runEvent('action.likes.unlike');
        }
    });
});
