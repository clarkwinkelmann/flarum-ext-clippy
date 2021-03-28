<?php

namespace ClarkWinkelmann\Clippy;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->content(IncludeClippyAssets::class)
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->content(IncludeClippyAssets::class)
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/resources/less/admin.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(ForumAttributes::class),

    (new Extend\Settings())
        ->serializeToForum('clippyAgent', 'clippy.agent')
        ->serializeToForum('clippyEvents', 'clippy.events', function ($value) {
            return json_decode($value, true);
        }),
];
