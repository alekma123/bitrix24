<?php

require_once __DIR__ . "/DealEventHandler.php";

use EventHandlers\DealEventHandler;

class EventHandlers
{
    public static function addEventHandlers (): void
    {
        new DealEventHandler();
    }

}
