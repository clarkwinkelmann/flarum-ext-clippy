<?php

namespace ClarkWinkelmann\Clippy;

use Flarum\Settings\SettingsRepositoryInterface;

class PathSettings
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function buildPath(): string
    {
        $cdn = $this->settings->get('clippy.cdn');

        if ($cdn === 'custom') {
            return $this->settings->get('clippy.path') . '/build/';
        }

        // Even if we select S3 as the CDN, we still need to load the JS and CSS from another CDN
        return 'https://cdn.jsdelivr.net/gh/smore-inc/clippy.js/build/';
    }

    public function agentPath(): string
    {
        $cdn = $this->settings->get('clippy.cdn');

        if (!$cdn || $cdn === 's3') {
            return 'https://s3.amazonaws.com/clippy.js/Agents/';
        } else if ($cdn === 'jsdelivr') {
            return 'https://cdn.jsdelivr.net/gh/smore-inc/clippy.js/agents/';
        }

        return $this->settings->get('clippy.path') . '/agents/';
    }
}
