<?php

namespace ClarkWinkelmann\Clippy;

use Flarum\Frontend\Document;

class IncludeClippyAssets
{
    protected $settings;

    public function __construct(PathSettings $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(Document $document)
    {
        $path = $this->settings->buildPath();

        $document->head[] = '<link rel="stylesheet" href="' . $path . 'clippy.css">';
        $document->js[] = $path . 'clippy.min.js';
    }
}
