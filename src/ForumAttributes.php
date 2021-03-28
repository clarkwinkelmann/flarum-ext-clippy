<?php

namespace ClarkWinkelmann\Clippy;

class ForumAttributes
{
    protected $settings;

    public function __construct(PathSettings $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(): array
    {
        return [
            'clippyAgentPath' => $this->settings->agentPath(),
        ];
    }
}
